import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import {
  API_CONTRACT_VERSION,
  ContractError,
  MAX_SINGLE_RECORD_BYTES,
  STIMULUS_SET_VERSION,
  STUDY_KEY,
  TIMING_POLICY_VERSION,
  conditionLabel,
  expectedAssignedCondition,
  expectedTrialIds,
  inspectCompleteness,
  validateRecordEnvelope,
  validateStartInput
} from "../supabase/functions/experiment-api/domain.js";

class SyntheticBackend {
  constructor() {
    this.cells = ["pressure", "no_pressure"].flatMap((conditionKey) => (
      Array.from({ length: 6 }, (_, index) => ({
        conditionKey,
        list: index + 1,
        count: 0
      }))
    ));
    this.sessionsByIdentity = new Map();
  }

  start(identity) {
    if (this.sessionsByIdentity.has(identity)) {
      return { ...this.sessionsByIdentity.get(identity), resumed: true };
    }
    const minimum = Math.min(...this.cells.map((cell) => cell.count));
    const candidates = this.cells.filter((cell) => cell.count === minimum);
    const cell = candidates[this.sessionsByIdentity.size % candidates.length];
    cell.count += 1;
    const id = randomUUID();
    const session = {
      id,
      study_key: STUDY_KEY,
      condition_key: cell.conditionKey,
      counterbalance_list: cell.list,
      stimulus_set_version: STIMULUS_SET_VERSION,
      timing_policy_version: TIMING_POLICY_VERSION,
      token: randomUUID(),
      trials: new Map(),
      questionnaires: new Map(),
      completed: false,
      resumed: false
    };
    this.sessionsByIdentity.set(identity, session);
    return session;
  }

  save(session, token, envelope) {
    if (token !== session.token) throw new ContractError(401, "invalid_session_token", "Invalid token.");
    const result = validateRecordEnvelope(envelope, session);
    if (result.recordType === "trial") session.trials.set(result.trialId, result.record);
    else session.questionnaires.set(result.questionnaireStage, result.record);
    return result.idempotencyKey;
  }

  complete(session, token) {
    if (token !== session.token) throw new ContractError(401, "invalid_session_token", "Invalid token.");
    const result = inspectCompleteness(
      [...session.trials.values()],
      [...session.questionnaires.values()]
    );
    if (!result.complete) return { completed: false, ...result };
    session.completed = true;
    return { completed: true, ...result };
  }
}

function trialRecord(session, trialId, overrides = {}) {
  const assignedCondition = expectedAssignedCondition(trialId, session.counterbalance_list);
  const trialType = assignedCondition === "no_ai"
    ? "no_ai_baseline"
    : assignedCondition === "ai_only" ? "ai_only_baseline" : "ai_plus_cues";
  return {
    record_type: "trial",
    participant_id: session.id,
    study_id: session.study_key,
    session_id: session.id,
    stimulus_set_version: session.stimulus_set_version,
    timing_policy_version: session.timing_policy_version,
    condition: conditionLabel(session.condition_key),
    counterbalance_list: session.counterbalance_list,
    assigned_condition: assignedCondition,
    trial_type: trialType,
    trial_phase: trialType === "no_ai_baseline"
      ? "phase_1_no_ai"
      : trialType === "ai_only_baseline" ? "phase_2_ai_only" : "phase_3_ai_plus_cues",
    trial_deadline_ms: session.condition_key === "no_pressure"
      ? ""
      : trialType === "no_ai_baseline" ? 30000 : 15000,
    trial_id: trialId,
    report_completed: "true",
    timed_out: "false",
    ...overrides
  };
}

function trialEnvelope(session, trialId, overrides = {}) {
  return {
    idempotency_key: `${session.id}:${trialId}`,
    record_type: "trial",
    record: trialRecord(session, trialId, overrides)
  };
}

function questionnaireEnvelope(session, stage, responses = {}) {
  return {
    idempotency_key: `${session.id}:questionnaire:${stage}`,
    record_type: "questionnaire",
    record: {
      record_type: "questionnaire",
      questionnaire_stage: stage,
      participant_id: session.id,
      study_id: session.study_key,
      session_id: session.id,
      stimulus_set_version: session.stimulus_set_version,
      timing_policy_version: session.timing_policy_version,
      condition: conditionLabel(session.condition_key),
      counterbalance_list: session.counterbalance_list,
      responses
    }
  };
}

test("frozen versions and pressure label are stable", () => {
  assert.equal(API_CONTRACT_VERSION, "v1");
  assert.equal(TIMING_POLICY_VERSION, "pressure_v2_first10_30s_then50_15s");
  assert.equal(conditionLabel("pressure"), "15_seconds");
  assert.equal(conditionLabel("no_pressure"), "no_time_limit");
  assert.equal(expectedTrialIds().length, 60);
  assert.equal(new Set(expectedTrialIds()).size, 60);
});

test("start validation rejects client attempts to alter frozen versions", () => {
  const valid = {
    api_contract_version: API_CONTRACT_VERSION,
    study_key: STUDY_KEY,
    prolific_pid: "synthetic-pid",
    prolific_study_id: "synthetic-study",
    prolific_session_id: "synthetic-session",
    client_instance_id: randomUUID(),
    stimulus_set_version: STIMULUS_SET_VERSION,
    timing_policy_version: TIMING_POLICY_VERSION,
    consent_version: "EVIDENCE_REQUIRED",
    client_build_version: "test"
  };
  assert.doesNotThrow(() => validateStartInput(valid, { allowUnapprovedSynthetic: true }));
  assert.throws(
    () => validateStartInput({ ...valid, timing_policy_version: "10_seconds" }, { allowUnapprovedSynthetic: true }),
    (error) => error.code === "timing_version_mismatch"
  );
  assert.throws(
    () => validateStartInput({ ...valid, prolific_pid: "real-looking-id" }),
    (error) => error.code === "consent_version_unapproved"
  );
});

test("120 synthetic participants remain balanced across all 12 cells", () => {
  const backend = new SyntheticBackend();
  for (let index = 0; index < 120; index += 1) backend.start(`synthetic-${index}`);
  const counts = backend.cells.map((cell) => cell.count);
  assert.equal(backend.cells.length, 12);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
  assert.deepEqual(new Set(counts), new Set([10]));
});

test("duplicate start resumes one assignment and increments one cell once", async () => {
  const backend = new SyntheticBackend();
  const starts = await Promise.all(Array.from({ length: 10 }, () => backend.start("same-identity")));
  assert.equal(new Set(starts.map((session) => session.id)).size, 1);
  assert.equal(backend.cells.reduce((sum, cell) => sum + cell.count, 0), 1);
});

test("trial and questionnaire retries update rather than duplicate", () => {
  const backend = new SyntheticBackend();
  const session = backend.start("idempotent");
  backend.save(session, session.token, trialEnvelope(session, "T001", { report_completed: "false" }));
  backend.save(session, session.token, trialEnvelope(session, "T001", { report_completed: "true" }));
  backend.save(session, session.token, questionnaireEnvelope(session, "pre", { value: 1 }));
  backend.save(session, session.token, questionnaireEnvelope(session, "pre", { value: 2 }));
  assert.equal(session.trials.size, 1);
  assert.equal(session.trials.get("T001").report_completed, "true");
  assert.equal(session.questionnaires.size, 1);
  assert.equal(session.questionnaires.get("pre").responses.value, 2);
});

test("wrong tokens, identity mismatches, raw identifiers and oversized records are rejected", () => {
  const backend = new SyntheticBackend();
  const session = backend.start("security");
  assert.throws(
    () => backend.save(session, "wrong", trialEnvelope(session, "T001")),
    (error) => error.code === "invalid_session_token"
  );
  assert.throws(
    () => backend.save(session, session.token, trialEnvelope(session, "T001", { session_id: randomUUID() })),
    (error) => error.code === "session_identity_mismatch"
  );
  assert.throws(
    () => backend.save(session, session.token, trialEnvelope(session, "T001", { prolific_pid: "forbidden" })),
    (error) => error.code === "raw_identifier_forbidden"
  );
  assert.throws(
    () => backend.save(session, session.token, trialEnvelope(session, "T001", { assigned_condition: "ai_only" })),
    (error) => error.code === "assigned_condition_mismatch"
  );
  assert.throws(
    () => backend.save(session, session.token, trialEnvelope(session, "T001", { trial_deadline_ms: 9999 })),
    (error) => error.code === "trial_deadline_mismatch"
  );
  assert.throws(
    () => backend.save(session, session.token, trialEnvelope(session, "T001", { padding: "x".repeat(MAX_SINGLE_RECORD_BYTES) })),
    (error) => error.code === "record_too_large"
  );
});

test("completion requires 60 unique trials, completed reports, and both questionnaires", () => {
  const backend = new SyntheticBackend();
  const session = backend.start("complete");
  expectedTrialIds().slice(0, 59).forEach((trialId) => {
    backend.save(session, session.token, trialEnvelope(session, trialId));
  });
  backend.save(session, session.token, questionnaireEnvelope(session, "pre"));
  backend.save(session, session.token, questionnaireEnvelope(session, "post"));
  assert.equal(backend.complete(session, session.token).completed, false);

  backend.save(session, session.token, trialEnvelope(session, "T060", {
    timed_out: "true",
    user_final_decision: "",
    user_agreed_with_ai: ""
  }));
  assert.equal(backend.complete(session, session.token).completed, true);
  assert.equal(backend.complete(session, session.token).completed, true);

  const missingPre = backend.start("missing-pre");
  expectedTrialIds().forEach((trialId) => backend.save(missingPre, missingPre.token, trialEnvelope(missingPre, trialId)));
  backend.save(missingPre, missingPre.token, questionnaireEnvelope(missingPre, "post"));
  assert.equal(backend.complete(missingPre, missingPre.token).completed, false);

  const missingReport = backend.start("missing-report");
  expectedTrialIds().forEach((trialId) => backend.save(
    missingReport,
    missingReport.token,
    trialEnvelope(missingReport, trialId, trialId === "T021" ? { report_completed: "false" } : {})
  ));
  backend.save(missingReport, missingReport.token, questionnaireEnvelope(missingReport, "pre"));
  backend.save(missingReport, missingReport.token, questionnaireEnvelope(missingReport, "post"));
  assert.equal(backend.complete(missingReport, missingReport.token).completed, false);
});
