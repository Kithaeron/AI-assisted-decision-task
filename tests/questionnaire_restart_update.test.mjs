import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "ai_decision_prototype.html"), "utf8");
const manifestSource = fs.readFileSync(path.join(root, "fixed_stimuli.js"), "utf8");

function extractConstant(name) {
  const match = html.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);`));
  assert.ok(match, `Could not locate ${name}`);
  return vm.runInNewContext(match[1]);
}

const expectedMailsS = [
  "I can tell if I am dealing with an application based on artificial intelligence.",
  "I can program new applications in the field of \u201dartificial intelligence\u201d.",
  "Although there are often new AI applications, I manage to always be \u201dup-to date\u201d.",
  "I can handle it when interactions with AI frustrate or frighten me",
  "I can weigh the consequences of using AI for society.",
  "I can design new AI applications.",
  "I can use artificial intelligence meaningfully to achieve my goals.",
  "I can also usually solve strenuous and complicated tasks when working with artificial intelligence well.",
  "I can prevent an AI from influencing me in my decisions.",
  "I can assess what advantages and disadvantages the use of an artificial intelligence entails."
];
const expectedTrust = [
  "The AI recommendation system performed competently during the task.",
  "Overall, I trusted the AI recommendation system.",
  "I had confidence in the recommendations provided by the AI.",
  "The AI recommendation system was dependable.",
  "The AI recommendation system behaved consistently.",
  "I was willing to rely on the AI recommendation system when making decisions."
];
const expectedPressure = [
  "I felt under time pressure while making my decisions.",
  "I had to make decisions faster than I wanted.",
  "The available time was sufficient for me to make careful decisions."
];

assert.deepEqual([...extractConstant("MAILS_S_ITEMS")], expectedMailsS);
assert.deepEqual([...extractConstant("TRUST_ITEMS")], expectedTrust);
assert.deepEqual([...extractConstant("PRESSURE_ITEMS")], expectedPressure);
assert.ok(html.includes("A value of 0 means that an ability is not at all or hardly pronounced."));
assert.ok(html.includes("A value of 10 means that an ability is very well or (almost) perfectly pronounced."));
assert.ok(html.includes("0,\n          10,"), "MAILS-S must use the 0-10 scale");

assert.ok(html.includes('conditionOption("high_pressure", "High pressure")'));
assert.ok(html.includes('conditionOption("low_pressure", "Low pressure")'));
assert.ok(html.includes('state.conditionKey = selected.value === "high_pressure" ? "pressure" : "no_pressure"'));
assert.ok(html.includes('const CONDITION_ASSIGNMENT_SOURCE = "manual_researcher_start_screen"'));
assert.ok(!html.includes('params.get("condition")'));
assert.ok(!html.includes('params.get("time_pressure")'));
assert.ok(html.includes('sessionId: ""'));
assert.ok(html.indexOf("state.sessionId = createUuid()") > html.indexOf("function confirmCondition()"));

assert.ok(html.includes('const ACTIVE_RUN_MARKER_KEY = "ai-loan-experiment:experiment_in_progress"'));
assert.ok(html.includes('sessionStatus: "interrupted"'));
assert.ok(html.includes('state.sessionStatus = "completed"'));
assert.ok(html.includes("markRunInterrupted(interruptedRun)"));
assert.ok(html.includes("retryArchivedQueuesInBackground()"));
assert.ok(!html.includes("renderInterrupted"));
assert.ok(!html.includes("This session was interrupted."));
assert.ok(!html.includes("Resume Experiment"));

const requiredCsvFields = [
  ...Array.from({ length: 10 }, (_, index) => `pre_mails_s_${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 6 }, (_, index) => `post_trust_${String(index + 1).padStart(2, "0")}`),
  "post_perceived_ai_accuracy_pct",
  "post_pressure_01",
  "post_pressure_02",
  "post_pressure_03"
];
for (const field of requiredCsvFields) {
  assert.ok(html.includes(`"${field}"`), `Missing questionnaire CSV field: ${field}`);
}
for (const internalField of [
  "session_status",
  "condition_assignment_source",
  "pre_mails_s_mean",
  "post_trust_mean",
  "post_pressure_03_reversed",
  "post_perceived_time_pressure_mean"
]) {
  assert.ok(html.includes(`${internalField}:`), `Missing internal field: ${internalField}`);
}
assert.ok(html.includes("const reversedPressure = 8 - survey.values.post_pressure_03"));
assert.ok(html.includes("post_trust_mean: mean("));
assert.ok(html.includes("post_perceived_time_pressure_mean: mean(["));
assert.ok(html.includes("/^\\d+$/.test(accuracyText)"));
assert.ok(html.includes('state.postSubmitting = true'));

assert.equal(
  crypto.createHash("sha256").update(manifestSource).digest("hex"),
  "b73d057387335ff2ee1d3773c3d5c968fc5ac3ca158f79fd554475ea54cec954",
  "The approved 70% AI-accuracy stimulus manifest must remain byte-for-byte unchanged"
);

console.log("Questionnaire/manual-condition/fresh-restart validation: PASS");
