import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const sql = fs.readFileSync(
  "supabase/migrations/202608110001_initial_experiment_backend.sql",
  "utf8"
).toLowerCase();

test("migration initializes two conditions by six lists", () => {
  assert.match(sql, /unnest\(array\['pressure', 'no_pressure'\]\)/);
  assert.match(sql, /generate_series\(1, 6\)/);
  assert.match(sql, /primary key \(study_key, condition_key, counterbalance_list\)/);
});

test("all backend data tables enable RLS and revoke browser access", () => {
  const tables = [
    "experiment_assignment_cells",
    "experiment_sessions",
    "experiment_participant_links",
    "experiment_trial_responses",
    "experiment_questionnaires",
    "experiment_api_rate_limits"
  ];
  tables.forEach((table) => {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
    assert.match(sql, new RegExp(`revoke all on public\\.${table} from anon, authenticated`));
  });
  assert.doesNotMatch(sql, /create\s+policy/);
});

test("identity linkage is isolated from researcher views", () => {
  const trialView = sql.match(/create view public\.research_session_trial_export[\s\S]*?revoke all/)[0];
  const questionnaireView = sql.match(/create view public\.research_session_questionnaire_export[\s\S]*?revoke all/)[0];
  assert.doesNotMatch(trialView, /participant_links|prolific_pid|prolific_study_id|prolific_session_id/);
  assert.doesNotMatch(questionnaireView, /participant_links|prolific_pid|prolific_study_id|prolific_session_id/);
});

test("allocation, rate-limit, and completion functions are service-role only", () => {
  [
    "allocate_experiment_session",
    "check_experiment_rate_limit",
    "complete_experiment_session"
  ].forEach((functionName) => {
    assert.match(sql, new RegExp(`revoke all on function public\\.${functionName}`));
    assert.match(sql, new RegExp(`grant execute on function public\\.${functionName}[\\s\\S]*?to service_role`));
  });
});
