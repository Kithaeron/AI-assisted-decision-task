export const API_CONTRACT_VERSION = "v1";
export const STIMULUS_SET_VERSION = "fixed-60-counterbalanced-six-obvious-v4";
export const TIMING_POLICY_VERSION = "pressure_v2_first10_30s_then50_15s";
export const STUDY_KEY = "ai_assisted_loan_decision";
export const MAX_SINGLE_RECORD_BYTES = 128 * 1024;
export const MAX_BATCH_BYTES = 512 * 1024;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TRIAL_ID_PATTERN = /^T(00[1-9]|0[1-5][0-9]|060)$/;
const CONDITIONS = new Set(["pressure", "no_pressure"]);
const ASSIGNED_CONDITIONS = new Set(["no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"]);
const ASSIGNED_CONDITION_ORDER = ["no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"];
const FORBIDDEN_IDENTIFIER_KEYS = new Set([
  "prolific_pid",
  "prolific_study_id",
  "prolific_session_id",
  "PROLIFIC_PID",
  "STUDY_ID",
  "SESSION_ID",
  "session_write_token"
]);

export class ContractError extends Error {
  constructor(status, code, message, details = null) {
    super(message);
    this.name = "ContractError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function conditionLabel(conditionKey) {
  if (conditionKey === "pressure") return "15_seconds";
  if (conditionKey === "no_pressure") return "no_time_limit";
  throw new ContractError(400, "invalid_condition", "Unknown condition key.");
}

export function expectedTrialIds() {
  return Array.from({ length: 60 }, (_, index) => `T${String(index + 1).padStart(3, "0")}`);
}

export function expectedAssignedCondition(trialId, counterbalanceList) {
  if (!TRIAL_ID_PATTERN.test(String(trialId || ""))) {
    throw new ContractError(400, "invalid_trial_id", "trial_id must be one of T001-T060.");
  }
  const list = Number(counterbalanceList);
  if (!Number.isInteger(list) || list < 1 || list > 6) {
    throw new ContractError(400, "invalid_counterbalance", "Counterbalance list must be 1-6.");
  }
  const profileIndex = Number.parseInt(String(trialId).slice(1), 10) - 1;
  const blockIndex = Math.floor(profileIndex / 10);
  const assignedIndex = (blockIndex - (list - 1) + ASSIGNED_CONDITION_ORDER.length)
    % ASSIGNED_CONDITION_ORDER.length;
  return ASSIGNED_CONDITION_ORDER[assignedIndex];
}

function requiredString(value, name, maxLength = 256) {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) {
    throw new ContractError(400, "invalid_request", `${name} must be a non-empty string.`);
  }
  return value;
}

function requireUuid(value, name) {
  const result = requiredString(value, name, 64);
  if (!UUID_PATTERN.test(result)) {
    throw new ContractError(400, "invalid_uuid", `${name} must be a UUID.`);
  }
  return result;
}

function booleanValue(value, name) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new ContractError(400, "invalid_record", `${name} must be boolean.`);
}

export function assertNoRawIdentifiers(value, path = "record") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_IDENTIFIER_KEYS.has(key)) {
      throw new ContractError(400, "raw_identifier_forbidden", `${path}.${key} is not allowed.`);
    }
    assertNoRawIdentifiers(child, `${path}.${key}`);
  }
}

export function validateStartInput(input, options = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ContractError(400, "invalid_request", "A JSON object is required.");
  }
  if (input.api_contract_version !== API_CONTRACT_VERSION) {
    throw new ContractError(400, "unsupported_api_version", "Unsupported API contract version.");
  }
  if (input.study_key !== STUDY_KEY) {
    throw new ContractError(400, "invalid_study", "Unknown study key.");
  }
  if (input.stimulus_set_version !== STIMULUS_SET_VERSION) {
    throw new ContractError(409, "stimulus_version_mismatch", "Unsupported stimulus set version.");
  }
  if (input.timing_policy_version !== TIMING_POLICY_VERSION) {
    throw new ContractError(409, "timing_version_mismatch", "Unsupported timing policy version.");
  }

  const prolificPid = requiredString(input.prolific_pid, "prolific_pid");
  const consentVersion = requiredString(input.consent_version, "consent_version", 128);
  const syntheticAllowed = options.allowUnapprovedSynthetic === true
    && prolificPid.startsWith("synthetic-");
  if (consentVersion === "EVIDENCE_REQUIRED" && !syntheticAllowed) {
    throw new ContractError(403, "consent_version_unapproved", "An approved consent version is required.");
  }

  return {
    studyKey: STUDY_KEY,
    prolificPid,
    prolificStudyId: requiredString(input.prolific_study_id, "prolific_study_id"),
    prolificSessionId: requiredString(input.prolific_session_id, "prolific_session_id"),
    clientInstanceId: requireUuid(input.client_instance_id, "client_instance_id"),
    stimulusSetVersion: STIMULUS_SET_VERSION,
    timingPolicyVersion: TIMING_POLICY_VERSION,
    consentVersion,
    clientBuildVersion: requiredString(input.client_build_version, "client_build_version", 128)
  };
}

export function validateSessionCredentials(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ContractError(400, "invalid_request", "A JSON object is required.");
  }
  if (input.api_contract_version !== API_CONTRACT_VERSION) {
    throw new ContractError(400, "unsupported_api_version", "Unsupported API contract version.");
  }
  return {
    experimentSessionId: requireUuid(input.experiment_session_id, "experiment_session_id"),
    sessionWriteToken: requiredString(input.session_write_token, "session_write_token", 512)
  };
}

export function validateRecordEnvelope(envelope, session) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new ContractError(400, "invalid_record", "A record envelope is required.");
  }
  const recordType = requiredString(envelope.record_type, "record_type", 32);
  if (!["trial", "questionnaire"].includes(recordType)) {
    throw new ContractError(400, "invalid_record_type", "record_type must be trial or questionnaire.");
  }
  const record = envelope.record;
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new ContractError(400, "invalid_record", "record must be a JSON object.");
  }
  if (new TextEncoder().encode(JSON.stringify(record)).length > MAX_SINGLE_RECORD_BYTES) {
    throw new ContractError(413, "record_too_large", "The record exceeds the size limit.");
  }
  assertNoRawIdentifiers(record);

  const idempotencyKey = requiredString(envelope.idempotency_key, "idempotency_key", 256);
  if (record.record_type !== recordType) {
    throw new ContractError(400, "record_type_mismatch", "Envelope and record types must match.");
  }
  if (record.session_id !== session.id || record.participant_id !== session.id) {
    throw new ContractError(409, "session_identity_mismatch", "Record session identity is not authoritative.");
  }
  if (record.study_id !== session.study_key) {
    throw new ContractError(409, "study_mismatch", "Record study identity does not match the session.");
  }
  if (record.condition !== conditionLabel(session.condition_key)) {
    throw new ContractError(409, "condition_mismatch", "Record condition does not match the server assignment.");
  }
  if (Number(record.counterbalance_list) !== Number(session.counterbalance_list)) {
    throw new ContractError(409, "counterbalance_mismatch", "Record list does not match the server assignment.");
  }
  if (record.stimulus_set_version !== session.stimulus_set_version) {
    throw new ContractError(409, "stimulus_version_mismatch", "Record stimulus version does not match the session.");
  }
  if (record.timing_policy_version !== session.timing_policy_version) {
    throw new ContractError(409, "timing_version_mismatch", "Record timing version does not match the session.");
  }

  if (recordType === "trial") {
    if (!TRIAL_ID_PATTERN.test(String(record.trial_id || ""))) {
      throw new ContractError(400, "invalid_trial_id", "trial_id must be one of T001-T060.");
    }
    if (!ASSIGNED_CONDITIONS.has(record.assigned_condition)) {
      throw new ContractError(400, "invalid_assigned_condition", "Unknown assigned trial condition.");
    }
    const expectedCondition = expectedAssignedCondition(record.trial_id, session.counterbalance_list);
    if (record.assigned_condition !== expectedCondition) {
      throw new ContractError(409, "assigned_condition_mismatch", "Trial condition does not match the server list.");
    }
    const expectedTrialType = expectedCondition === "no_ai"
      ? "no_ai_baseline"
      : expectedCondition === "ai_only"
        ? "ai_only_baseline"
        : "ai_plus_cues";
    const expectedTrialPhase = expectedCondition === "no_ai"
      ? "phase_1_no_ai"
      : expectedCondition === "ai_only"
        ? "phase_2_ai_only"
        : "phase_3_ai_plus_cues";
    if (record.trial_type !== expectedTrialType || record.trial_phase !== expectedTrialPhase) {
      throw new ContractError(409, "trial_phase_mismatch", "Trial type or phase does not match its assignment.");
    }
    const expectedDeadlineMs = session.condition_key === "no_pressure"
      ? null
      : expectedTrialType === "no_ai_baseline" ? 30000 : 15000;
    const savedDeadlineMs = record.trial_deadline_ms === "" || record.trial_deadline_ms == null
      ? null
      : Number(record.trial_deadline_ms);
    if (savedDeadlineMs !== expectedDeadlineMs) {
      throw new ContractError(409, "trial_deadline_mismatch", "Trial deadline does not match the timing policy.");
    }
    if (idempotencyKey !== `${session.id}:${record.trial_id}`) {
      throw new ContractError(409, "idempotency_key_mismatch", "Trial idempotency key is not canonical.");
    }
    return {
      recordType,
      idempotencyKey,
      record,
      trialId: record.trial_id,
      reportCompleted: booleanValue(record.report_completed, "report_completed"),
      timedOut: booleanValue(record.timed_out, "timed_out")
    };
  }

  if (!["pre", "post"].includes(record.questionnaire_stage)) {
    throw new ContractError(400, "invalid_questionnaire_stage", "Questionnaire stage must be pre or post.");
  }
  if (idempotencyKey !== `${session.id}:questionnaire:${record.questionnaire_stage}`) {
    throw new ContractError(409, "idempotency_key_mismatch", "Questionnaire idempotency key is not canonical.");
  }
  return {
    recordType,
    idempotencyKey,
    record,
    questionnaireStage: record.questionnaire_stage
  };
}

export function inspectCompleteness(trials, questionnaires) {
  const byTrialId = new Map(trials.map((trial) => [trial.trial_id, trial]));
  const missingTrialIds = expectedTrialIds().filter((trialId) => !byTrialId.has(trialId));
  const incompleteReportIds = [...byTrialId.values()]
    .filter((trial) => !(trial.report_completed === true || trial.report_completed === "true"))
    .map((trial) => trial.trial_id);
  const stages = new Set(questionnaires.map((questionnaire) => questionnaire.questionnaire_stage));
  return {
    complete: byTrialId.size === 60
      && missingTrialIds.length === 0
      && incompleteReportIds.length === 0
      && stages.has("pre")
      && stages.has("post"),
    distinctTrialCount: byTrialId.size,
    missingTrialIds,
    incompleteReportIds,
    hasPreQuestionnaire: stages.has("pre"),
    hasPostQuestionnaire: stages.has("post")
  };
}
