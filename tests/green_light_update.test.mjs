import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "ai_decision_prototype.html"), "utf8");
const manifestSource = fs.readFileSync(path.join(root, "fixed_stimuli.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(manifestSource, sandbox, { filename: "fixed_stimuli.js" });
const stimuli = sandbox.window.FIXED_STIMULI;

const instructionsBody = html.match(/function instructionsContentHtml\(\) \{([\s\S]*?)\n      \}/)?.[1] || "";
assert.ok(instructionsBody);
assert.ok(!instructionsBody.toLowerCase().includes("fictional"));
assert.ok(html.includes("There is no fixed time limit for each response."));
assert.ok(html.includes(">\n                  Start\n                </button>"));
assert.ok(html.includes('id="trialInstructionsButton"'));
assert.ok(html.includes("instructionsModalContent.innerHTML = instructionsContentHtml()"));
const openInstructionsBody = html.match(/function openTrialInstructions\(\) \{([\s\S]*?)\n      \}/)?.[1] || "";
assert.ok(openInstructionsBody);
assert.ok(!openInstructionsBody.includes("stopTimer()"));
assert.ok(html.includes("Which information did you rely on when making your final decision?"));
assert.ok(html.includes("What percentage of the AI recommendations shown during the task do you think were correct? Please enter a whole number from 0 to 100."));
assert.ok(html.includes("/^\\d+$/.test(accuracyText)"));
assert.ok(html.includes("timeoutReasonOtherText.value = \"\""));
assert.ok(html.includes("Please briefly describe the other reason."));

for (const forbiddenFeedback of [
  "Your decision was correct",
  "Your decision was incorrect",
  "Correct answer",
  "Incorrect answer"
]) {
  assert.ok(!html.includes(forbiddenFeedback), `Participant feedback must not be shown: ${forbiddenFeedback}`);
}

const conditions = ["no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"];
for (let list = 1; list <= 6; list += 1) {
  const assigned = stimuli.map((item) => ({
    item,
    condition: conditions[((item.counterbalanceBlock - 1) - (list - 1) + 6) % 6]
  }));
  const aiTrials = assigned.filter(({ condition }) => condition !== "no_ai");
  assert.equal(aiTrials.filter(({ item }) => item.applicant.aiIsCorrect).length, 35);
  assert.equal(aiTrials.filter(({ item }) => !item.applicant.aiIsCorrect).length, 15);
  assert.equal(aiTrials.length, 50);
}

console.log("Green-light UI/data validation: PASS");
