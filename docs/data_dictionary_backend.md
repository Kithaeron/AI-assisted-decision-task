# Backend data dictionary

## Version fields

| Field | Value / meaning |
| --- | --- |
| `api_contract_version` | HTTP contract, currently `v1` |
| `client_build_version` | Frontend/backend integration build |
| `stimulus_set_version` | Fixed stimulus manifest; remains `fixed-60-counterbalanced-six-obvious-v4` |
| `timing_policy_version` | `pressure_v2_first10_30s_then50_15s` |
| `report_schema_version` | Retrospective response schema |

The pressure analysis/session label is `15_seconds`. Per-trial fields retain `trial_deadline_ms`, `trial_deadline_seconds`, and `deadline_policy`: pressure No-AI trials use 30,000 ms; pressure AI trials use 15,000 ms; no-pressure trials have no deadline.

## Identity separation

| Location | Identity content |
| --- | --- |
| `experiment_participant_links` | keyed identity HMAC; optionally raw Prolific values only if governance approves `IDENTIFIER_STORAGE_MODE=raw` |
| `experiment_sessions` | internal UUID and authoritative assignment; no raw Prolific value |
| trial/questionnaire payloads | internal UUID in `participant_id` and `session_id`; study key in `study_id` |
| backend-mode CSV and filename | internal UUID only |

The session write token is held in browser localStorage for retry/resume and sent only to the API. It is never included in CSV, URLs, logs, or database plaintext.

## Tables

### `experiment_assignment_cells`

Twelve enabled cells: condition key x counterbalance list. `assigned_count` changes only inside the allocation function.

### `experiment_sessions`

Internal session UUID, study key, condition/list, versions, consent version/status, hashed token, and server timestamps. `completed_at` is server-generated.

### `experiment_participant_links`

Isolated linkage for resume and later deletion/retention policy. Excluded from research views.

### `experiment_trial_responses`

Validation-critical scalar fields plus complete JSONB payload. Unique session/trial and idempotency keys prevent duplicate inflation. Client and server timestamps are retained separately.

### `experiment_questionnaires`

One row per session/stage (`pre`, `post`), with complete JSONB payload and server timestamps.

### `experiment_api_rate_limits`

Session UUID and minute bucket only; no extra participant/network identifier. Limits authenticated write/completion calls to 180 requests per minute per session.

## Research views

`research_session_trial_export` and `research_session_questionnaire_export` provide pseudonymous assignment and response data. They omit participant linkage by default and are revoked from browser roles.

## Unvalidated evidence

The stimulus manifest remains v4. Grey-zone classifications are `model_estimated_unvalidated`; obvious cases have intended design directions, not observed banking ground truth. `observed_no_ai_approve_rate` remains separate from model estimates.
