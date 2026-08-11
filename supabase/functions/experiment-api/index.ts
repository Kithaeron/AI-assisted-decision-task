import { createClient } from "npm:@supabase/supabase-js@2";
import {
  API_CONTRACT_VERSION,
  ContractError,
  MAX_BATCH_BYTES,
  STIMULUS_SET_VERSION,
  TIMING_POLICY_VERSION,
  conditionLabel,
  validateRecordEnvelope,
  validateSessionCredentials,
  validateStartInput
} from "./domain.js";

const DEFAULT_LOCAL_ORIGINS = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:8000",
  "http://localhost:8000"
];

function env(name: string): string {
  return String(Deno.env.get(name) || "").trim();
}

function resolveSupabaseSecretKey(): string {
  const direct = env("SUPABASE_SECRET_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");
  if (direct) return direct;

  const dictionary = env("SUPABASE_SECRET_KEYS");
  if (dictionary) {
    try {
      const parsed = JSON.parse(dictionary);
      return String(parsed.default || Object.values(parsed)[0] || "");
    } catch {
      return "";
    }
  }
  return "";
}

function allowedOrigins(): Set<string> {
  const configured = env("EXPERIMENT_ALLOWED_ORIGINS")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return new Set(configured.length > 0 ? configured : DEFAULT_LOCAL_ORIGINS);
}

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin"
  };
  if (origin && allowedOrigins().has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function assertOriginAllowed(request: Request): void {
  const origin = request.headers.get("Origin");
  if (origin && !allowedOrigins().has(origin)) {
    throw new ContractError(403, "origin_not_allowed", "The request origin is not allowed.");
  }
}

function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin)
    }
  });
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  if (!String(request.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json")) {
    throw new ContractError(415, "unsupported_content_type", "Content-Type must be application/json.");
  }
  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > MAX_BATCH_BYTES) {
    throw new ContractError(413, "payload_too_large", "The request exceeds the size limit.");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BATCH_BYTES) {
    throw new ContractError(413, "payload_too_large", "The request exceeds the size limit.");
  }
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    return parsed;
  } catch {
    throw new ContractError(400, "invalid_json", "A valid JSON object is required.");
  }
}

async function hmacHex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBase64Url(hex: string): string {
  const bytes = new Uint8Array(hex.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function constantTimeEqual(left: string, right: string): boolean {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] || 0) ^ (b[index] || 0);
  }
  return difference === 0;
}

function createAdminClient() {
  const url = env("SUPABASE_URL");
  const secretKey = resolveSupabaseSecretKey();
  if (!url || !secretKey) {
    throw new ContractError(503, "server_not_configured", "Backend database configuration is unavailable.");
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

async function loadAuthorizedSession(
  supabase: ReturnType<typeof createAdminClient>,
  input: Record<string, unknown>
) {
  const credentials = validateSessionCredentials(input);
  const tokenHash = await sha256Hex(credentials.sessionWriteToken);
  const { data, error } = await supabase
    .from("experiment_sessions")
    .select("id,study_key,condition_key,counterbalance_list,stimulus_set_version,timing_policy_version,status,write_token_hash")
    .eq("id", credentials.experimentSessionId)
    .maybeSingle();

  if (error) {
    throw new ContractError(503, "database_read_failed", "The session could not be verified.");
  }
  if (!data || !constantTimeEqual(String(data.write_token_hash), tokenHash)) {
    throw new ContractError(401, "invalid_session_token", "The session token is invalid.");
  }
  return { session: data, tokenHash, credentials };
}

async function enforceRateLimit(supabase: ReturnType<typeof createAdminClient>, sessionId: string) {
  const { data, error } = await supabase.rpc("check_experiment_rate_limit", {
    p_session_id: sessionId,
    p_limit: 180
  });
  if (error) {
    throw new ContractError(503, "rate_limit_check_failed", "The request could not be authorized.");
  }
  if (data !== true) {
    throw new ContractError(429, "rate_limit_exceeded", "Too many requests for this session.");
  }
}

async function handleStart(input: Record<string, unknown>) {
  const parsed = validateStartInput(input, {
    allowUnapprovedSynthetic: env("ALLOW_UNAPPROVED_CONSENT_FOR_SYNTHETIC") === "true"
  });
  const identitySecret = env("IDENTIFIER_HMAC_SECRET");
  const tokenSecret = env("SESSION_TOKEN_SECRET");
  if (identitySecret.length < 32 || tokenSecret.length < 32) {
    throw new ContractError(503, "server_not_configured", "Backend token secrets are unavailable.");
  }

  const identitySource = [
    parsed.studyKey,
    parsed.prolificPid,
    parsed.prolificStudyId,
    parsed.prolificSessionId
  ].join("\u001f");
  const identityHmac = await hmacHex(identitySecret, identitySource);
  const sessionToken = hexToBase64Url(await hmacHex(tokenSecret, identityHmac));
  const writeTokenHash = await sha256Hex(sessionToken);
  const storeRawIdentifiers = env("IDENTIFIER_STORAGE_MODE") === "raw";
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("allocate_experiment_session", {
    p_study_key: parsed.studyKey,
    p_identity_hmac: identityHmac,
    p_prolific_pid: storeRawIdentifiers ? parsed.prolificPid : null,
    p_prolific_study_id: storeRawIdentifiers ? parsed.prolificStudyId : null,
    p_prolific_session_id: storeRawIdentifiers ? parsed.prolificSessionId : null,
    p_stimulus_set_version: parsed.stimulusSetVersion,
    p_timing_policy_version: parsed.timingPolicyVersion,
    p_api_contract_version: API_CONTRACT_VERSION,
    p_client_build_version: parsed.clientBuildVersion,
    p_consent_version: parsed.consentVersion,
    p_write_token_hash: writeTokenHash
  });
  if (error || !Array.isArray(data) || !data[0]) {
    throw new ContractError(503, "session_allocation_failed", "The session could not be allocated.");
  }

  const allocation = data[0];
  return {
    api_contract_version: API_CONTRACT_VERSION,
    experiment_session_id: allocation.experiment_session_id,
    session_write_token: sessionToken,
    resumed: Boolean(allocation.resumed),
    assignment: {
      condition_key: allocation.condition_key,
      condition_label: conditionLabel(allocation.condition_key),
      counterbalance_list: Number(allocation.counterbalance_list)
    },
    stimulus_set_version: allocation.stimulus_set_version,
    timing_policy_version: allocation.timing_policy_version
  };
}

async function saveValidatedRecord(
  supabase: ReturnType<typeof createAdminClient>,
  session: Record<string, unknown>,
  envelope: Record<string, unknown>
) {
  if (session.status === "completed") {
    throw new ContractError(409, "session_already_completed", "Completed sessions cannot be changed.");
  }
  const validated = validateRecordEnvelope(envelope, session);
  const common = {
    experiment_session_id: session.id,
    idempotency_key: validated.idempotencyKey,
    condition_key: session.condition_key,
    counterbalance_list: session.counterbalance_list,
    stimulus_set_version: session.stimulus_set_version,
    timing_policy_version: session.timing_policy_version,
    payload: validated.record,
    server_updated_at: new Date().toISOString()
  };

  if (validated.recordType === "trial") {
    const { error } = await supabase.from("experiment_trial_responses").upsert({
      ...common,
      trial_id: validated.trialId,
      report_completed: validated.reportCompleted,
      timed_out: validated.timedOut,
      client_decision_timestamp: validated.record.decision_timestamp_iso || null
    }, { onConflict: "experiment_session_id,trial_id" });
    if (error) {
      throw new ContractError(503, "trial_upsert_failed", "The trial record was not saved.");
    }
  } else {
    const { error } = await supabase.from("experiment_questionnaires").upsert({
      ...common,
      stage: validated.questionnaireStage
    }, { onConflict: "experiment_session_id,stage" });
    if (error) {
      throw new ContractError(503, "questionnaire_upsert_failed", "The questionnaire was not saved.");
    }
  }

  const { error: sessionUpdateError } = await supabase
    .from("experiment_sessions")
    .update({ last_write_at: new Date().toISOString() })
    .eq("id", session.id);
  if (sessionUpdateError) {
    throw new ContractError(503, "session_timestamp_failed", "The record acknowledgement could not be finalized.");
  }
  return validated.idempotencyKey;
}

async function handleRecord(input: Record<string, unknown>) {
  const supabase = createAdminClient();
  const { session } = await loadAuthorizedSession(supabase, input);
  await enforceRateLimit(supabase, String(session.id));
  const rawRecords = Array.isArray(input.records)
    ? input.records
    : [{
        idempotency_key: input.idempotency_key,
        record_type: input.record_type,
        record: input.record
      }];

  if (rawRecords.length === 0 || rawRecords.length > 100) {
    throw new ContractError(400, "invalid_batch", "A record batch must contain 1-100 records.");
  }

  // Validate the full batch before the first write; retries remain idempotent if a database call later fails.
  rawRecords.forEach((record) => validateRecordEnvelope(record, session));
  const acknowledged: string[] = [];
  for (const record of rawRecords) {
    acknowledged.push(await saveValidatedRecord(supabase, session, record));
  }
  return {
    api_contract_version: API_CONTRACT_VERSION,
    acknowledged_idempotency_keys: acknowledged,
    server_timestamp_iso: new Date().toISOString()
  };
}

async function handleComplete(input: Record<string, unknown>) {
  const supabase = createAdminClient();
  const { session, tokenHash } = await loadAuthorizedSession(supabase, input);
  await enforceRateLimit(supabase, String(session.id));
  const { data, error } = await supabase.rpc("complete_experiment_session", {
    p_session_id: session.id,
    p_write_token_hash: tokenHash
  });
  if (error) {
    throw new ContractError(503, "completion_check_failed", "Server completeness could not be verified.");
  }
  if (!data?.ok) {
    throw new ContractError(409, data?.code || "session_incomplete", "The session is not complete.", data);
  }

  const completionUrl = env("PROLIFIC_COMPLETION_URL");
  if (!completionUrl.startsWith("https://app.prolific.com/submissions/complete")) {
    throw new ContractError(503, "completion_url_not_configured", "The Prolific completion URL is not configured.");
  }
  return {
    api_contract_version: API_CONTRACT_VERSION,
    completed: true,
    completed_at: data.completed_at,
    completion_url: completionUrl
  };
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  try {
    assertOriginAllowed(request);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const path = new URL(request.url).pathname.replace(/\/+$/, "");
    const input = await readJson(request);
    let result;
    if (request.method === "POST" && path.endsWith("/session/start")) {
      result = await handleStart(input);
    } else if (["PUT", "POST"].includes(request.method) && path.endsWith("/record")) {
      result = await handleRecord(input);
    } else if (request.method === "POST" && path.endsWith("/session/complete")) {
      result = await handleComplete(input);
    } else {
      throw new ContractError(405, "method_or_route_not_allowed", "Unknown API route or HTTP method.");
    }
    return jsonResponse(result, 200, origin);
  } catch (error) {
    const contractError = error instanceof ContractError
      ? error
      : new ContractError(500, "internal_error", "The request could not be completed.");
    return jsonResponse({
      api_contract_version: API_CONTRACT_VERSION,
      code: contractError.code,
      message: contractError.message,
      details: contractError.details
    }, contractError.status, origin);
  }
});
