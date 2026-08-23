import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "fixed_stimuli.js");
const manifestSource = fs.readFileSync(manifestPath, "utf8");
const html = fs.readFileSync(path.join(root, "ai_decision_prototype.html"), "utf8");
const persistence = fs.readFileSync(path.join(root, "experiment_persistence.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");

const sandbox = { window: {} };
vm.runInNewContext(manifestSource, sandbox, { filename: "fixed_stimuli.js" });
const stimuli = sandbox.window.FIXED_STIMULI;
const version = sandbox.window.STIMULUS_SET_VERSION;

const countBy = (items, selector) => items.reduce((counts, item) => {
  const key = selector(item);
  counts[key] = (counts[key] || 0) + 1;
  return counts;
}, {});

const expectedManifestHash = "b73d057387335ff2ee1d3773c3d5c968fc5ac3ca158f79fd554475ea54cec954";
assert.equal(crypto.createHash("sha256").update(manifestSource).digest("hex"), expectedManifestHash);
assert.equal(version, "synthetic-loan-fixed-ai-cues-70pct-v2");
assert.equal(stimuli.length, 60);
assert.equal(new Set(stimuli.map((item) => item.trialId)).size, 60);
assert.equal(new Set(stimuli.map((item) => item.applicant.applicantId)).size, 60);
assert.deepEqual(countBy(stimuli, (item) => item.groundTruthLabel), { APPROVE: 30, REJECT: 30 });
assert.deepEqual(countBy(stimuli, (item) => item.applicant.aiRecommendation), { REJECT: 30, APPROVE: 30 });
assert.equal(stimuli.filter((item) => item.applicant.aiIsCorrect).length, 42);
assert.equal(stimuli.filter((item) => !item.applicant.aiIsCorrect).length, 18);
assert.ok(stimuli.every((item) => item.datasetVersion === "synthetic-loan-policy-no-error-v1"));
assert.ok(stimuli.every((item) => item.manifestVersion === version));
assert.ok(stimuli.every((item) => item.observedNoAiApproveRate === ""));
assert.ok(stimuli.filter((item) => !item.applicant.aiIsCorrect).every((item) => (
  !item.isObviousCase
  && item.cueBank.W1.text.includes(`supporting ${item.applicant.aiRecommendation}`)
)));

const obvious = stimuli.filter((item) => item.isObviousCase);
assert.equal(obvious.length, 6);
assert.deepEqual(countBy(obvious, (item) => item.intendedObviousDirection), { APPROVE: 3, REJECT: 3 });
for (let block = 1; block <= 6; block += 1) {
  const blockItems = stimuli.filter((item) => item.counterbalanceBlock === block);
  assert.equal(blockItems.length, 10);
  assert.equal(blockItems.filter((item) => item.isObviousCase).length, 1);
}
assert.ok(obvious.every((item) => item.applicant.aiRecommendation === item.intendedObviousDirection));

for (const cueId of ["W2", "U1", "U2"]) {
  const metrics = stimuli.map((item) => item.cueBank[cueId].metric);
  assert.deepEqual(countBy(metrics, (value) => value), { 70: 20, 80: 20, 90: 20 });
}

const conditionKeys = ["no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"];
const assignmentsByTrial = new Map(stimuli.map((item) => [item.trialId, []]));
for (let list = 1; list <= 6; list += 1) {
  const assigned = stimuli.map((item) => {
    const index = ((item.counterbalanceBlock - 1) - (list - 1) + 6) % 6;
    const condition = conditionKeys[index];
    assignmentsByTrial.get(item.trialId).push(condition);
    return { item, condition };
  });
  assert.deepEqual(countBy(assigned, ({ condition }) => condition), {
    no_ai: 10,
    ai_only: 10,
    W1_U1: 10,
    W1_U2: 10,
    W2_U1: 10,
    W2_U2: 10
  });
  assert.equal(new Set(assigned.map(({ item }) => item.trialId)).size, 60);
  const aiTrials = assigned.filter(({ condition }) => condition !== "no_ai").map(({ item }) => item);
  assert.equal(aiTrials.length, 50);
  const recommendationCounts = countBy(aiTrials, (item) => item.applicant.aiRecommendation);
  assert.equal(recommendationCounts.APPROVE + recommendationCounts.REJECT, 50);
  assert.ok(Math.abs(recommendationCounts.APPROVE - recommendationCounts.REJECT) <= 2);
  assert.equal(aiTrials.filter((item) => item.applicant.aiIsCorrect).length, 35);
  assert.equal(aiTrials.filter((item) => !item.applicant.aiIsCorrect).length, 15);
}
for (const assignments of assignmentsByTrial.values()) {
  assert.deepEqual([...assignments].sort(), [...conditionKeys].sort());
}

for (const requiredText of [
  "You will review 60 loan applications for a bank. The applications and decisions in this study will not affect real people.",
  "The AI recommendations and Additional AI Information were prepared before the study",
  "Next phase",
  "Time is up",
  "Why were you unable to decide before time ran out?",
  "I did not use any Additional AI Information",
  "Credit scores range from 0 to 1000, with higher scores indicating lower estimated credit risk."
]) assert.ok(html.includes(requiredText), `Missing required participant text: ${requiredText}`);

assert.ok(html.includes("const TRANSITION_HALF_MS = 200"));
assert.ok(html.includes('return stimulus.trialType === "no_ai_baseline" ? 30000 : 15000'));
assert.ok(!html.includes('recordDecision("timeout")'));
assert.ok(!html.includes("Attention check:"));
assert.ok(!html.includes("Condition: ${"));
assert.ok(!html.includes("actualOutcome"));
assert.ok(html.includes('reported_ai_recommendation: ""'));
assert.ok(html.includes('record_status: "deadline_exceeded_incomplete"') || html.includes('"deadline_exceeded_incomplete"'));

for (const internalField of [
  "dataset_version", "manifest_version", "deadline_exceeded", "decision_completed",
  "decision_completed_on_time", "trial_onset_timestamp_iso", "deadline_exceeded_timestamp_iso",
  "timeout_modal_ack_timestamp_iso", "final_choice_timestamp_iso", "decision_rt_total_ms",
  "decision_rt_on_time_ms", "decision_rt_untimed_ms", "decision_rt_ms", "overtime_ms",
  "post_timeout_decision_ms", "timeout_reason_codes", "timeout_reason_other_text",
  "record_status", "report_completed"
]) assert.ok(html.includes(`${internalField}:`), `Internal response field missing: ${internalField}`);

assert.ok(indexHtml.includes("window.location.search"));
assert.ok(indexHtml.includes("window.location.hash"));
assert.ok(indexHtml.includes("ai_decision_prototype.html"));
assert.ok(persistence.includes("function clear()"));
assert.ok(persistence.includes("backoffDelay"));
assert.ok(persistence.includes("sendBeacon"));

console.log("Experiment static/data validation: PASS");
