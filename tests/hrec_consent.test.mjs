import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "ai_decision_prototype.html"), "utf8");

function extractBetween(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `Could not extract ${startMarker}`);
  return html.slice(start, end);
}

const consentPage = extractBetween("function renderConsentPage()", "function agreeToConsent()");
const confirmCondition = extractBetween("function confirmCondition()", "function renderConsentPage()");
const agree = extractBetween("function agreeToConsent()", "function declineConsent()");
const decline = extractBetween("function declineConsent()", "function renderConsentDeclined()");
const declinedPage = extractBetween("function renderConsentDeclined()", "function renderPreSurvey()");
const interruptedCleanup = extractBetween("function markRunInterrupted(run)", "function retryArchivedQueuesInBackground()");

for (const requiredText of [
  "Participant Information and Consent",
  "Modeling Human Cognition in AI-Assisted Decision-Making.",
  "approximately <strong>15 minutes</strong>",
  "Depending on the assigned experimental condition, some decisions may be subject to a time limit",
  "Participation is entirely voluntary.",
  "I agree and continue",
  "I do not agree",
  "Z.Zhu-5@student.tudelft.nl",
  "U.K.Gadiraju@tudelft.nl",
  "4TU.ResearchData"
]) assert.ok(consentPage.includes(requiredText), `Missing consent content: ${requiredText}`);

assert.ok(!consentPage.includes("type=\"checkbox\""));
assert.ok(!consentPage.includes("type=\"text\""));
assert.ok(!consentPage.toLowerCase().includes("countdown"));
assert.ok(!consentPage.includes("Approve</strong>"));
assert.ok(!consentPage.includes("Override</strong>"));

assert.ok(confirmCondition.includes('state.consentStatus = "pending"'));
assert.ok(confirmCondition.includes("renderConsentPage()"));
assert.ok(!confirmCondition.includes("createUuid()"));
assert.ok(!confirmCondition.includes("initializeSessionPersistence()"));
assert.ok(!confirmCondition.includes("queueSessionStatus()"));
assert.ok(!confirmCondition.includes("renderPreSurvey()"));

assert.ok(agree.includes('state.consentStatus = "affirmative"'));
assert.ok(agree.includes("state.sessionId = createUuid()"));
assert.ok(agree.includes("initializeSessionPersistence()"));
assert.ok(agree.includes('checkpoint("consent_affirmed_session_started")'));
assert.ok(agree.includes("queueSessionStatus()"));
assert.ok(agree.includes("renderPreSurvey()"));

assert.ok(decline.includes('state.consentStatus = "declined"'));
assert.ok(decline.includes("state.responses = []"));
assert.ok(decline.includes("clearActiveRunMarker()"));
assert.ok(decline.includes('removeIdentity("ai-loan-experiment:development-identity")'));
assert.ok(decline.includes("renderConsentDeclined()"));
assert.ok(!decline.includes("checkpoint("));
assert.ok(!decline.includes("queueSessionStatus("));
assert.ok(!decline.includes("downloadCsv("));
assert.ok(declinedPage.includes("You have not consented to participate. No research data have been saved. Please inform the researcher that the session has ended."));

assert.ok(interruptedCleanup.includes("if (!oldPersistence.endpointConfigured)"));
assert.ok(interruptedCleanup.includes("oldPersistence.clear()"));
assert.ok(interruptedCleanup.includes("clearActiveRunMarker()"));
assert.ok(interruptedCleanup.includes('removeIdentity("ai-loan-experiment:development-identity")'));

assert.ok(html.indexOf("function renderConsentPage()") < html.indexOf("function renderPreSurvey()"));
assert.ok(html.indexOf("function renderPreSurvey()") < html.indexOf("function renderInstructions()"));
assert.ok(html.includes('consentStatus: "not_presented"'));
assert.ok(html.includes('const CONSENT_VERSION = "hrec_consent_v1_2026-08-25"'));

const headerMatch = html.match(/const CSV_HEADERS = (\[[\s\S]*?\]);/);
assert.ok(headerMatch);
const csvHeaders = vm.runInNewContext(headerMatch[1]);
assert.equal(csvHeaders.length, 48);
assert.ok(!csvHeaders.some((header) => header.startsWith("consent_")));

console.log("HREC consent flow validation: PASS");
