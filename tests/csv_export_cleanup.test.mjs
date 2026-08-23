import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "ai_decision_prototype.html"), "utf8");

const expectedHeaders = [
  "participant_id",
  "time_pressure_condition",
  "counterbalance_list",
  "trial_order",
  "applicant_id",
  "trial_condition",
  "trial_deadline_ms",
  "stimulus_type",
  "annual_income_eur",
  "requested_loan_eur",
  "repayment_term_years",
  "credit_score",
  "savings_eur",
  "ai_recommendation",
  "ai_recommendation_shown",
  "warranted_cue_id",
  "warranted_cue_text",
  "unwarranted_cue_id",
  "unwarranted_cue_text",
  "warranted_cue_position",
  "user_final_decision",
  "user_agreed_with_ai",
  "decision_rt_ms",
  "timed_out",
  "obvious_response_matches_direction",
  "reported_cue_ids",
  "reported_no_additional_ai_information",
  "session_quality_flag",
  "pre_mails_s_01",
  "pre_mails_s_02",
  "pre_mails_s_03",
  "pre_mails_s_04",
  "pre_mails_s_05",
  "pre_mails_s_06",
  "pre_mails_s_07",
  "pre_mails_s_08",
  "pre_mails_s_09",
  "pre_mails_s_10",
  "post_trust_01",
  "post_trust_02",
  "post_trust_03",
  "post_trust_04",
  "post_trust_05",
  "post_trust_06",
  "post_perceived_ai_accuracy_pct",
  "post_pressure_01",
  "post_pressure_02",
  "post_pressure_03"
];

function extractBetween(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `Could not extract ${startMarker}`);
  return html.slice(start, end);
}

const headerMatch = html.match(/const CSV_HEADERS = (\[[\s\S]*?\]);/);
assert.ok(headerMatch, "CSV_HEADERS was not found");
const actualHeaders = vm.runInNewContext(headerMatch[1]);
assert.deepEqual([...actualHeaders], expectedHeaders);
assert.equal(actualHeaders.length, 48);

const conditionFor = (index) => {
  if (index < 10) return "no_ai";
  if (index < 20) return "ai_only";
  return ["W1_U1", "W1_U2", "W2_U1", "W2_U2"][Math.floor((index - 20) / 10)];
};

const responses = Array.from({ length: 60 }, (_, index) => {
  const condition = conditionFor(index);
  const aiShown = condition !== "no_ai";
  const cueShown = condition.startsWith("W");
  const warrantedId = cueShown ? condition.slice(0, 2) : "";
  const unwarrantedId = cueShown ? condition.slice(3) : "";
  const isObvious = index % 10 === 9;
  return {
    participant_id: "P-CLEANUP-001",
    counterbalance_list: 3,
    trial_order: index + 1,
    applicant_id: `A${String(index + 1).padStart(3, "0")}`,
    assigned_condition: condition,
    trial_deadline_ms: index < 10 ? 30000 : 15000,
    stimulus_type: isObvious ? (index % 20 === 9 ? "obvious_approve" : "obvious_reject") : "grey_zone",
    annual_income_eur: 40000 + index * 1000,
    requested_loan_eur: 10000 + index * 100,
    repayment_term_years: 2 + (index % 4),
    credit_score: 300 + index * 10,
    savings_eur: 1000 + index * 250,
    ai_recommendation: index % 2 === 0 ? "APPROVE" : "REJECT",
    ai_recommendation_shown: String(aiShown),
    warranted_cue_id: warrantedId,
    warranted_cue_text: cueShown
      ? (index === 20
        ? 'The AI treated "stable, verified" income as evidence supporting APPROVE.'
        : `Displayed warranted cue ${index + 1}.`)
      : "",
    unwarranted_cue_id: unwarrantedId,
    unwarranted_cue_text: cueShown ? `AI confidence: ${[70, 80, 90][index % 3]}%.` : "",
    current_warranted_cue_position: cueShown ? (index % 2 === 0 ? 1 : 2) : "",
    user_final_decision: index % 2 === 0 ? "APPROVE" : "REJECT",
    user_agreed_with_ai: aiShown ? "true" : "",
    decision_rt_ms: index === 30 ? "" : 1000 + index,
    timed_out: String(index === 30),
    is_obvious_case: String(isObvious),
    decision_completed: "true",
    obvious_response_matches_direction: isObvious ? "true" : "",
    reported_cue_ids: cueShown ? `${warrantedId}|${unwarrantedId}` : "",
    reported_no_additional_ai_information: cueShown ? "false" : "",
    backend_idempotency_key: `session:T${index + 1}`,
    dataset_version: "internal-only-version",
    trial_onset_timestamp_iso: "2026-08-23T12:00:00.000Z"
  };
});

const preSurvey = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => [`pre_mails_s_${String(index + 1).padStart(2, "0")}`, index + 1])
);
const postSurvey = {
  ...Object.fromEntries(
    Array.from({ length: 6 }, (_, index) => [`post_trust_${String(index + 1).padStart(2, "0")}`, index + 1])
  ),
  post_perceived_ai_accuracy_pct: 70,
  post_pressure_01: 2,
  post_pressure_02: 3,
  post_pressure_03: 6
};
const state = {
  responses,
  timePressureCondition: "high_pressure",
  preSurvey,
  postSurvey
};

const csvFunctions = [
  extractBetween("function csvValue(value)", "function getCsvRows()"),
  extractBetween("function getCsvRows()", "function downloadCsv()")
].join("\n");
const context = vm.createContext({ state });
vm.runInContext(csvFunctions, context);
const rows = vm.runInContext("getCsvRows()", context);

assert.equal(rows.length, 60);
assert.ok(rows.every((row) => Object.keys(row).join("|") === expectedHeaders.join("|")));
assert.equal(new Set(rows.map((row) => `${row.participant_id}|${row.applicant_id}`)).size, 60);
assert.deepEqual(
  Object.fromEntries(expectedHeaders.map((header) => [header, rows[0][header] !== undefined])),
  Object.fromEntries(expectedHeaders.map((header) => [header, true]))
);

const conditionCounts = rows.reduce((counts, row) => {
  counts[row.trial_condition] = (counts[row.trial_condition] || 0) + 1;
  return counts;
}, {});
assert.deepEqual(conditionCounts, {
  no_ai: 10,
  ai_only: 10,
  W1_U1: 10,
  W1_U2: 10,
  W2_U1: 10,
  W2_U2: 10
});

const noAiRows = rows.filter((row) => row.trial_condition === "no_ai");
const aiRows = rows.filter((row) => row.ai_recommendation_shown === "true");
const cueRows = rows.filter((row) => row.warranted_cue_id);
assert.equal(noAiRows.length, 10);
assert.ok(noAiRows.every((row) => row.ai_recommendation === "" && row.user_agreed_with_ai === ""));
assert.equal(aiRows.length, 50);
assert.ok(aiRows.every((row) => ["true", "false"].includes(row.user_agreed_with_ai)));
assert.equal(cueRows.length, 40);
assert.ok(rows.slice(0, 20).every((row) => row.warranted_cue_text === "" && row.unwarranted_cue_text === ""));
assert.equal(cueRows[0].warranted_cue_text, responses[20].warranted_cue_text);
assert.equal(rows.filter((row) => row.obvious_response_matches_direction).length, 6);
assert.equal(rows.filter((row) => row.timed_out === "true").length, 1);
assert.equal(rows[30].decision_rt_ms, "");
assert.ok(rows.every((row) => row.session_quality_flag === "pass"));

for (const row of rows) {
  assert.ok(["true", "false"].includes(row.ai_recommendation_shown));
  assert.ok(["", "true", "false"].includes(row.user_agreed_with_ai));
  assert.ok(["true", "false"].includes(row.timed_out));
  assert.ok(!Object.values(row).includes(null));
  assert.ok(!Object.values(row).includes(undefined));
}
for (const header of [
  "session_id",
  "session_status",
  "dataset_version",
  "manifest_version",
  "trial_onset_timestamp_iso",
  "backend_idempotency_key",
  "model_estimated_approval_propensity",
  "decision_rt_total_ms",
  "timeout_reason_codes",
  "pre_mails_s_mean",
  "post_trust_mean"
]) assert.ok(!actualHeaders.includes(header), `Forbidden CSV header present: ${header}`);

for (const key of Object.keys(preSurvey)) {
  assert.ok(rows.every((row) => row[key] === preSurvey[key]));
}
for (const key of Object.keys(postSurvey)) {
  assert.ok(rows.every((row) => row[key] === postSurvey[key]));
}

const csvLines = [
  expectedHeaders.join(","),
  ...rows.map((row) => expectedHeaders.map((header) => context.csvValue(row[header])).join(","))
];
const artifactDirectory = path.join(root, "test-artifacts", "csv-export");
const artifactPath = path.join(artifactDirectory, "strict-48-column-fixture.csv");
fs.mkdirSync(artifactDirectory, { recursive: true });
fs.writeFileSync(artifactPath, `\uFEFF${csvLines.join("\r\n")}`, "utf8");

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  cells.push(current);
  return cells;
}

assert.equal(csvLines.length, 61);
assert.ok(csvLines.every((line) => parseCsvLine(line).length === 48));
assert.equal(parseCsvLine(csvLines[21])[16], responses[20].warranted_cue_text);
assert.equal((html.match(/link\.click\(\)/g) || []).length, 1);
assert.ok(!html.toLowerCase().includes(".zip"));

let clickCount = 0;
let appendedCount = 0;
let removedCount = 0;
let revokedCount = 0;
let downloadName = "";
let createdBlob = null;
const link = {
  href: "",
  set download(value) {
    downloadName = value;
  },
  click() {
    clickCount += 1;
  },
  remove() {
    removedCount += 1;
  }
};
Object.assign(context, {
  CSV_HEADERS: expectedHeaders,
  participantId: "P-CLEANUP-001",
  Blob,
  URL: {
    createObjectURL(blob) {
      createdBlob = blob;
      return "blob:csv-fixture";
    },
    revokeObjectURL() {
      revokedCount += 1;
    }
  },
  document: {
    createElement(tagName) {
      assert.equal(tagName, "a");
      return link;
    },
    body: {
      appendChild(element) {
        assert.equal(element, link);
        appendedCount += 1;
      }
    }
  },
  window: {
    setTimeout(callback) {
      callback();
    }
  }
});
vm.runInContext(
  extractBetween("function downloadCsv()", "function handlePageExit()"),
  context
);
vm.runInContext("downloadCsv()", context);
assert.equal(clickCount, 1);
assert.equal(appendedCount, 1);
assert.equal(removedCount, 1);
assert.equal(revokedCount, 1);
assert.match(downloadName, /^ai-loan-decision-P-CLEANUP-001-.+\.csv$/);
assert.ok(createdBlob instanceof Blob);
const downloadedCsv = await createdBlob.text();
const downloadedLines = downloadedCsv.replace(/^\uFEFF/, "").split("\r\n");
assert.equal(downloadedLines.length, 61);
assert.ok(downloadedLines.every((line) => parseCsvLine(line).length === 48));

console.log(`Strict 48-column CSV export validation: PASS (${artifactPath})`);
