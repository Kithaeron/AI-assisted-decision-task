import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";

function loadStimuli() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync("fixed_stimuli.js", "utf8"), context);
  return JSON.parse(JSON.stringify(context.window));
}

const CONDITIONS = ["no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"];

test("manifest contains the 60 fixed formula-workbook applicants", () => {
  const manifest = loadStimuli();
  assert.equal(manifest.DATASET_VERSION, "synthetic-loan-policy-no-error-v1");
  assert.equal(manifest.STIMULUS_MANIFEST_VERSION, "synthetic-loan-policy-no-error-v1-manifest-v1");
  assert.match(manifest.STIMULUS_MANIFEST_HASH, /^[0-9a-f]{64}$/);
  assert.match(manifest.STIMULUS_SOURCE_WORKBOOK_SHA256, /^[0-9a-f]{64}$/);
  assert.equal(manifest.FIXED_STIMULI.length, 60);
  assert.equal(new Set(manifest.FIXED_STIMULI.map((item) => item.trialId)).size, 60);
  assert.equal(new Set(manifest.FIXED_STIMULI.map((item) => item.applicantId)).size, 60);
  assert.equal(manifest.FIXED_STIMULI.every((item) => item.observedNoAiApproveRate === ""), true);
  assert.equal(manifest.FIXED_STIMULI.every((item) => item.groundTruthStatus === "task_defined_fictional_policy"), true);
});

test("policy and fixed AI schedules retain all balance constraints", () => {
  const { FIXED_STIMULI } = loadStimuli();
  assert.equal(FIXED_STIMULI.filter((item) => item.policyGroundTruth === "APPROVE").length, 30);
  assert.equal(FIXED_STIMULI.filter((item) => item.aiRecommendation === "APPROVE").length, 30);
  assert.equal(FIXED_STIMULI.filter((item) => item.aiMatchesPolicy).length, 48);
  assert.equal(FIXED_STIMULI.filter((item) => item.isObviousCase).length, 6);
  assert.equal(FIXED_STIMULI.filter((item) => item.stimulusType === "obvious_approve").length, 3);
  assert.equal(FIXED_STIMULI.filter((item) => item.stimulusType === "obvious_reject").length, 3);
  for (let block = 1; block <= 6; block += 1) {
    const rows = FIXED_STIMULI.filter((item) => item.counterbalanceBlock === block);
    assert.equal(rows.length, 10);
    assert.equal(rows.filter((item) => item.isObviousCase).length, 1);
    assert.equal(rows.filter((item) => item.policyGroundTruth === "APPROVE").length, 5);
    assert.equal(rows.filter((item) => item.aiRecommendation === "APPROVE").length, 5);
    assert.equal(rows.filter((item) => item.aiMatchesPolicy).length, 8);
    assert.equal(rows.filter((item) => item.isObviousCase).every((item) => item.aiMatchesPolicy), true);
  }
});

test("cue levels are 70, 80, or 90 and balanced overall and by block", () => {
  const { FIXED_STIMULI } = loadStimuli();
  for (const cue of ["W2", "U1", "U2"]) {
    const overall = Object.fromEntries([70, 80, 90].map((level) => [level, 0]));
    for (const stimulus of FIXED_STIMULI) overall[stimulus.cueBank[cue].level] += 1;
    assert.deepEqual(overall, { 70: 20, 80: 20, 90: 20 });
    for (let block = 1; block <= 6; block += 1) {
      const counts = Object.fromEntries([70, 80, 90].map((level) => [level, 0]));
      FIXED_STIMULI.filter((item) => item.counterbalanceBlock === block)
        .forEach((item) => { counts[item.cueBank[cue].level] += 1; });
      assert.deepEqual(Object.values(counts).sort(), [3, 3, 4]);
    }
  }
});

test("all six lists allocate ten unique applicants to each condition", () => {
  const { FIXED_STIMULI, COUNTERBALANCE_LISTS } = loadStimuli();
  for (let list = 1; list <= 6; list += 1) {
    const counts = Object.fromEntries(CONDITIONS.map((condition) => [condition, 0]));
    const obviousCounts = Object.fromEntries(CONDITIONS.map((condition) => [condition, 0]));
    for (const stimulus of FIXED_STIMULI) {
      const condition = COUNTERBALANCE_LISTS[String(list)][stimulus.counterbalanceBlock - 1];
      counts[condition] += 1;
      if (stimulus.isObviousCase) obviousCounts[condition] += 1;
    }
    assert.deepEqual(counts, Object.fromEntries(CONDITIONS.map((condition) => [condition, 10])));
    assert.deepEqual(obviousCounts, Object.fromEntries(CONDITIONS.map((condition) => [condition, 1])));
    assert.equal(new Set(FIXED_STIMULI.map((item) => item.applicantId)).size, 60);
  }
});

test("each applicant rotates through all six conditions across lists", () => {
  const { FIXED_STIMULI, COUNTERBALANCE_LISTS } = loadStimuli();
  for (const stimulus of FIXED_STIMULI) {
    const assigned = Array.from({ length: 6 }, (_, index) => (
      COUNTERBALANCE_LISTS[String(index + 1)][stimulus.counterbalanceBlock - 1]
    ));
    assert.deepEqual(new Set(assigned), new Set(CONDITIONS));
  }
});

test("frontend contains the revised timing, timeout, report, and clean UI contracts", () => {
  const html = fs.readFileSync("ai_decision_prototype.html", "utf8");
  const app = fs.readFileSync("experiment_app.js", "utf8");
  assert.match(app, /pressure_30s_no_ai_15s_ai/);
  assert.match(app, /pressure_v3_first10_30s_then50_15s_overtime_completion/);
  assert.match(app, /trial\.trialType === "no_ai_baseline" \? 30000 : 15000/);
  assert.match(app, /deadline_exceeded_incomplete/);
  assert.match(app, /decision_saved_reason_pending/);
  assert.match(app, /reported_ai_recommendation = ""/);
  assert.match(app, /I did not use any Additional AI Information/);
  assert.match(app, /This session was interrupted/);
  assert.match(html, /experiment_timing\.js/);
  assert.match(html, /experiment_app\.js/);
  assert.doesNotMatch(app, /TEST_PARTICIPANT|Download CSV Again|Finish and Download CSV/);
  assert.doesNotMatch(app, /Attention check|select option [0-9]/i);
  assert.doesNotMatch(app, /actualOutcome/);
});

test("CSV schema contains decision, deadline, cue, quality, and schema fields", () => {
  const app = fs.readFileSync("experiment_app.js", "utf8");
  for (const field of [
    "decision_rt_total_ms", "decision_rt_on_time_ms", "decision_rt_untimed_ms", "overtime_ms",
    "post_timeout_decision_ms", "deadline_exceeded", "decision_completed", "user_choice",
    "page_hidden_during_trial", "page_hidden_total_ms", "visibility_events_json",
    "user_final_decision", "user_agreed_with_ai", "timeout_reason_codes", "actual_cues_json",
    "stimulus_manifest_hash", "obvious_response_matches_direction", "obvious_quality_flag",
    "reported_other_text", "report_schema_version"
  ]) {
    assert.match(app, new RegExp(`"${field}"`));
  }
});

test("index forwarding preserves search and hash", () => {
  const source = fs.readFileSync("index.html", "utf8");
  assert.match(source, /destination\.search = window\.location\.search/);
  assert.match(source, /destination\.hash = window\.location\.hash/);
});
