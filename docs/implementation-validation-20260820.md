# Experiment update validation - 2026-08-20

## Source package

- Authoritative browser manifest: `fixed_stimuli_synthetic_v1.js`
- Dataset version: `synthetic-loan-policy-no-error-v1`
- Manifest version: `synthetic-loan-fixed-ai-cues-v1`
- Production manifest SHA-256: `881ada667dba642b47403e20660d7edfeb644ba093a7134110bcc741e0c9931f`
- The production `fixed_stimuli.js` is byte-identical to the supplied browser manifest.

## Production changes

- Replaced the root stimulus manifest with the supplied 60 fixed records.
- Added one instructions page, no page after trial 10, and one Next phase page after trial 20.
- Kept the accepted trial cards, recommendation colors, tables, buttons, countdown and Tailwind layout.
- Shortened the ordinary fade transition from 250 ms per half to 200 ms per half.
- Applied 30-second pressure deadlines to trials 1-10 and 15-second deadlines to trials 11-60; no-pressure trials have no visible timer.
- Replaced automatic timeout advancement with deadline modal, overtime decision, required multi-select reason, and retrospective report where applicable.
- Removed participant-facing IDs, condition/list metadata, RT, backend status, CSV controls, restore controls, and trivial select-a-number attention items.
- Added completion-quality metadata based on the six supplied obvious cases; three or more mismatches produces `review_exclusion_threshold_met` only after completion.

## Automated checks

- JavaScript syntax: PASS.
- Manifest SHA-256 and version: PASS.
- 60 unique trial IDs and 60 unique applicant IDs: PASS.
- Policy labels 30 APPROVE / 30 REJECT: PASS.
- AI recommendations 30 APPROVE / 30 REJECT: PASS.
- AI-policy matches 48 and mismatches 12: PASS.
- Six source blocks of ten, one obvious case per block, three obvious APPROVE and three obvious REJECT: PASS.
- W2, U1 and U2 values restricted to 70/80/90 with 20 of each overall: PASS.
- Six counterbalance lists: each condition has 10 trials; each applicant enters every condition once across lists: PASS.
- Every list has 50 AI trials, AI direction 25/25, and 40 matches / 10 mismatches: PASS.
- Persistence idempotency, failure queue, retry, beacon and checkpoint cleanup tests: PASS.
- Root index query-string and hash preservation: PASS.
- CSV required-field static check, including report and timeout fields: PASS.

Run with:

```powershell
node tests/experiment_update.test.mjs
node tests/persistence.test.mjs
```

## Browser checks

- Pressure trial 1 showed a 30-second countdown: PASS.
- Pressure trials after trial 10 showed a 15-second countdown: PASS.
- No-pressure trials showed no countdown UI: PASS.
- Counterbalance lists 1-6 opened with their assigned fixed applicants: PASS.
- One no-pressure session completed all 60 decisions and 40 retrospective reports: PASS.
- The downloaded run contained 60 unique trial rows and six condition groups of 10: PASS.
- Trial 10 advanced directly to trial 11; trial 20 showed Next phase exactly once: PASS.
- No-AI and AI + information timeout paths retained the same applicant and required an eventual real choice: PASS.
- Timeout-reason multi-select, AI-only reason option, Other text requirement, and timeout-to-retrospective sequence: PASS.
- Mid-session reload showed only the participant-safe interruption page: PASS.
- Root `index.html` preserved Prolific, condition, list and hash parameters: PASS.

Visual evidence is stored in `docs/visual-regression/`.

## Remaining configuration

- `EXPERIMENT_BACKEND_CONFIG` remains `local_only` unless an approved endpoint is injected by the deployment environment. Retry, idempotent upsert and beacon interfaces are implemented and tested, but server persistence must not be claimed without that endpoint.
- `PROLIFIC_COMPLETION_URL` still contains the completion-code placeholder. Automatic redirection remains disabled until a real code is configured and all configured backend records are acknowledged.
- The supplied fixed manifest retains a legacy property named `actualOutcome`. Production logic does not read, display, or export it; analysis uses explicitly named fictional-policy/model fields. Renaming it would violate the requirement to keep the supplied manifest byte-identical, so this naming issue remains documented.
