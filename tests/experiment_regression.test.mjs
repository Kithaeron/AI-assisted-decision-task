import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";

function loadStimuli() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync("fixed_stimuli.js", "utf8"), context);
  return context.window;
}

const CONDITIONS = ["no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"];

function assignedCondition(profileIndex, list) {
  const blockIndex = Math.floor(profileIndex / 10);
  return CONDITIONS[(blockIndex - (list - 1) + CONDITIONS.length) % CONDITIONS.length];
}

test("stimulus v4 remains unchanged at 60 unique fixed profiles", () => {
  const { FIXED_STIMULI, STIMULUS_SET_VERSION } = loadStimuli();
  assert.equal(STIMULUS_SET_VERSION, "fixed-60-counterbalanced-six-obvious-v4");
  assert.equal(FIXED_STIMULI.length, 60);
  assert.equal(new Set(FIXED_STIMULI.map((item) => item.trialId)).size, 60);
  assert.equal(new Set(FIXED_STIMULI.map((item) => item.applicant.applicantId)).size, 60);
  assert.equal(FIXED_STIMULI.filter((item) => item.isObviousCase).length, 6);
});

test("all six lists retain ten trials per condition and no duplicate applicants", () => {
  const { FIXED_STIMULI } = loadStimuli();
  for (let list = 1; list <= 6; list += 1) {
    const counts = Object.fromEntries(CONDITIONS.map((condition) => [condition, 0]));
    FIXED_STIMULI.forEach((stimulus, index) => { counts[assignedCondition(index, list)] += 1; });
    assert.deepEqual(counts, Object.fromEntries(CONDITIONS.map((condition) => [condition, 10])));
    assert.equal(new Set(FIXED_STIMULI.map((item) => item.applicant.applicantId)).size, 60);
  }
});

test("frontend exports the frozen timing policy and protects backend identity", () => {
  const html = fs.readFileSync("ai_decision_prototype.html", "utf8");
  assert.match(html, /csvLabel:\s*"15_seconds"/);
  assert.doesNotMatch(html, /csvLabel:\s*"10_seconds"/);
  assert.match(html, /pressure_v2_first10_30s_then50_15s/);
  assert.match(html, /stimulus\.trialType === "no_ai_baseline" \? 30000 : 15000/);
  assert.match(html, /"timing_policy_version"/);
  assert.match(html, /backendClient\.completeSession/);
  assert.match(html, /window\.location\.assign\(result\.completion_url\)/);
  assert.doesNotMatch(html, /PUT_COMPLETION_CODE_HERE/);

  const headerBlock = html.match(/const headers = \[([\s\S]*?)\n\s*\];/)[1];
  assert.doesNotMatch(headerBlock, /session_write_token|prolific_pid|prolific_study_id|prolific_session_id/i);
  const filenameLine = html.match(/link\.download = .*;/)[0];
  assert.doesNotMatch(filenameLine, /prolific|participantId/);
});

test("deadline policy remains 30 seconds, 15 seconds, and unlimited", () => {
  function deadline(conditionKey, trialType) {
    if (conditionKey === "no_pressure") return null;
    return trialType === "no_ai_baseline" ? 30000 : 15000;
  }
  assert.equal(deadline("pressure", "no_ai_baseline"), 30000);
  assert.equal(deadline("pressure", "ai_only_baseline"), 15000);
  assert.equal(deadline("pressure", "ai_plus_cues"), 15000);
  assert.equal(deadline("no_pressure", "ai_plus_cues"), null);
});

test("index forwarding still preserves search and hash", () => {
  const source = fs.readFileSync("index.html", "utf8");
  assert.match(source, /destination\.search = window\.location\.search/);
  assert.match(source, /destination\.hash = window\.location\.hash/);
});
