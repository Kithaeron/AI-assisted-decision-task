# Backend data dictionary

## Version fields

| Field | Value / meaning |
| --- | --- |
| `api_contract_version` | HTTP contract, currently `v1` |
| `client_build_version` | Frontend/backend integration build |
| `stimulus_set_version` | `synthetic-loan-policy-no-error-v1-manifest-v1` |
| `dataset_version` | Source dataset, `synthetic-loan-policy-no-error-v1` |
| `stimulus_manifest_hash` | SHA-256 of the generated manifest payload |
| `timing_policy_version` | `pressure_v3_first10_30s_then50_15s_overtime_completion` |
| `report_schema_version` | `additional_ai_information_v3_no_ai_recommendation_option` |

The pressure analysis/session label is `pressure_30s_no_ai_15s_ai`. Pressure No-AI trials use 30,000 ms; pressure AI trials use 15,000 ms; no-pressure trials have no deadline.

## Identity separation

| Location | Identity content |
| --- | --- |
| `experiment_participant_links` | keyed identity HMAC; optionally raw Prolific values only if governance approves `IDENTIFIER_STORAGE_MODE=raw` |
| `experiment_sessions` | internal UUID and authoritative assignment; no raw Prolific value |
| trial/questionnaire payloads | internal UUID in `participant_id` and `session_id`; study key in `study_id` |
| backend-mode CSV and filename | internal UUID only |

The session write token is held in browser localStorage for hidden recovery and sent only to the API. It is never included in CSV, URLs, logs, or database plaintext. Participants are not offered self-service resume controls.

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

## Decision and deadline fields

`deadline_exceeded` and legacy alias `timed_out` indicate that the deadline passed; they are not a participant choice. A deadline record is first stored as `deadline_exceeded_incomplete`, then updated under the same trial idempotency key. Final choices remain `approve`, `reject`, `agree`, or `override`.

`decision_rt_total_ms` uses a monotonic clock. Exceeded trials leave legacy `decision_rt_ms` blank and separately store `overtime_ms` and `post_timeout_decision_ms`. Untimed trials use `decision_rt_untimed_ms`. Visibility events are stored in `visibility_events_json` with a derived hidden-duration total.

## Evidence status

The workbook defines a deterministic fictional policy ground truth for the task. It is not an observed banking outcome or a claim about correct real-world lending. Reliability, confidence, and consensus values are fixed experimental manipulations, not measured historical facts. `observed_no_ai_approve_rate` remains blank before formal data collection.
