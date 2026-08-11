# Local backend setup

The repository is currently configured for `local_only`. No remote project, endpoint, completion code, or credentials are committed.

## Prerequisites

Install and start Docker Desktop, then install the Supabase CLI using an approved method. Supabase's local runtime uses Docker.

```powershell
cd "D:\cs_study\master_thesis\pilot study"
supabase start
supabase db reset
```

Copy `.env.example` to an ignored local env file and replace every placeholder with synthetic/local values. Do not commit the result.

```powershell
supabase functions serve experiment-api --env-file .env.local --no-verify-jwt
```

The local endpoint is normally:

```text
http://127.0.0.1:54321/functions/v1/experiment-api
```

Create an ignored `backend_config.local.js` or inject equivalent configuration before the experiment scripts:

```js
window.EXPERIMENT_BACKEND_CONFIG = {
  mode: "backend_required",
  apiBaseUrl: "http://127.0.0.1:54321/functions/v1/experiment-api",
  requestTimeoutMs: 10000,
  headers: {},
  studyKey: "ai_assisted_loan_decision",
  consentVersion: "EVIDENCE_REQUIRED",
  consentGateSatisfied: true,
  allowUnapprovedConsentForSynthetic: true
};
```

`EVIDENCE_REQUIRED` is accepted only for synthetic IDs when the server-only local flag `ALLOW_UNAPPROVED_CONSENT_FOR_SYNTHETIC=true` is set. Production must use an approved consent version and must not enable that flag.

## Browser-safe versus server-only

Browser-safe:

- API base URL;
- request timeout;
- optional publishable/anon gateway headers;
- study key and approved consent version.

Server-only:

- Supabase secret/service-role key;
- `IDENTIFIER_HMAC_SECRET`;
- `SESSION_TOKEN_SECRET`;
- Prolific completion URL/code;
- any future export credentials.

The Edge Function uses a secret key and bypasses RLS. Browser roles receive no table policies or grants.

## Checks

Run dependency-free synthetic and static tests:

```powershell
$node = "C:\Users\13913\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$tests = Get-ChildItem tests -Filter "*.test.mjs" | Select-Object -ExpandProperty FullName
& $node --test $tests
```

After local Supabase starts, verify migrations, all 12 rows, RLS, direct anon denial, Edge Function writes, completeness, and researcher views. Use only explicitly synthetic fixtures.

## Researcher export

Run with a researcher/server database role, never the browser role:

```sql
select * from public.research_session_trial_export order by experiment_session_id, trial_id;
select * from public.research_session_questionnaire_export order by experiment_session_id, stage;
```

Neither view joins `experiment_participant_links`. Export to approved Project Data Storage using the schedule agreed in the DMP.

## Deployment gate

Do not deploy until the supervisor/Data Steward has approved the provider, region, identifier policy, consent version, CORS origin, logging/retention, export path, and completion handling. Set production secrets through Supabase secrets, not Git.

The current experiment still loads Tailwind's browser CDN script and Google Fonts. Their network metadata, retention, availability, and the effect of third-party script access to localStorage are outside this backend implementation and require a production decision. Prefer approved self-hosted static assets before formal collection.
