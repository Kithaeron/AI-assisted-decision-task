# Experiment backend contract

Status: implemented and tested; deployment still requires an approved endpoint and consent configuration.

## Boundary

The experiment calls `experiment_backend_client.js`. It knows only an API base URL and three operations. It does not import `supabase-js`, refer to database tables, or hold a secret/service-role key. A TU Delft service can replace Supabase by implementing the same `v1` contract.

## `POST /session/start`

Starts or resumes one internal experiment session. The request contains the Prolific linkage identifiers only at this boundary, plus:

- `api_contract_version = v1`
- `study_key = ai_assisted_loan_decision`
- `client_instance_id`
- `stimulus_set_version`
- `timing_policy_version`
- `consent_version`
- `client_build_version`

The server atomically selects the least-used enabled cell among two timing conditions and six lists. A transaction advisory lock serializes allocation; random ordering breaks ties. A keyed identity HMAC resumes the same submission without incrementing a cell again.

The response supplies the authoritative internal session UUID, condition, list, versions, and a per-session write token. The token is deterministically derived with a server-only secret so a resumed identity receives the same unguessable value; only its SHA-256 hash is stored.

In `backend_required` mode, URL condition/list values never override this response. The call is blocked until an external approved consent gate provides `granted: true` and a non-placeholder consent version.

## `PUT /record`

Writes one envelope:

```json
{
  "api_contract_version": "v1",
  "experiment_session_id": "uuid",
  "session_write_token": "client-held-token",
  "idempotency_key": "uuid:T001",
  "record_type": "trial",
  "record": {}
}
```

`record_type` is explicitly `trial` or `questionnaire`. Trial rows upsert on `(experiment_session_id, trial_id)`; questionnaire rows upsert on `(experiment_session_id, stage)`. A later retrospective response updates the original trial row. Database success occurs before acknowledgement.

`POST /record` accepts 1-100 envelopes for page-exit `sendBeacon`. The full batch is validated before writing; every write remains independently idempotent if a later database operation fails.

Validation rejects unknown versions/types, noncanonical idempotency keys, invalid trial IDs, oversized JSON, raw Prolific keys, and assignment/session/version mismatches. Completed sessions cannot be changed.

## `POST /session/complete`

The server transaction checks:

- all unique trial IDs `T001` through `T060` exist;
- all trial rows have `report_completed=true`, including valid timeout rows;
- exactly one pre and one post questionnaire exist;
- assignment and versions were enforced during every write.

Success marks the session completed exactly once and returns the server-configured Prolific completion URL. Repeated completion calls are safe. The frontend never redirects merely because its retry queue is empty.

## Offline behavior

Every response is checkpointed in localStorage first. Failed HTTP writes remain in the exponential-backoff queue. The hidden checkpoint retains the internal session UUID/token, exact trial order, current position, responses, and queue. A participant who refreshes an incomplete session sees an interruption message and must ask the researcher for assistance; the UI does not silently resume. CSV remains a backup, not proof of server completeness.

## Provider replacement

A replacement backend must preserve the three routes, authoritative 12-cell allocation, session-token authentication, idempotent records, completeness rules, privacy separation, and `v1` response shapes. The frontend API client need only receive a new `apiBaseUrl`.
