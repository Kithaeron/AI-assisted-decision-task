# Verification report - 2026-08-20

## Automated checks

- JavaScript syntax: passed for manifest, application, timing, persistence, client, and backend domain files.
- Node test suite: 30 passed, 0 failed.
- Git whitespace/error check: passed.
- CSV schema: 96 unique fields.
- Generator reproducibility: repeated generation produced manifest SHA-256 `6c0f523adfad830f8e8c3cbb191aadaf8a759fa2c603cf8dba974ee4e0dcaa4e`.

## Stimulus and assignment checks

- 60 unique trial IDs and 60 unique applicant IDs.
- Six blocks of 10; each block has five policy APPROVE, five policy REJECT, and one obvious case.
- Three obvious APPROVE and three obvious REJECT cases; obvious AI advice always aligns.
- Overall AI schedule: 30 APPROVE, 30 REJECT, 48/60 policy matches.
- Every list: 10 trials in each of the six conditions, 60 unique applicants, and one obvious case per condition.
- Across six lists, each applicant enters every condition exactly once.
- Each participant's 50 AI trials contain 40 matches and 10 mismatches.
- W2, U1, and U2 levels are restricted to 70/80/90, with 20 of each level overall and 3/3/4 per block.

## Browser checks

- Completed one full 60-trial pressure session through post-task completion.
- Induced a 15-second deadline crossing and verified modal acknowledgement, same-application overtime choice, required timeout reason, idempotent record update, and no retrospective for the AI-only trial.
- The generated test CSV had 60 complete unique rows, no missing choices or total RTs, 10 rows per assigned condition, and a blank legacy RT for the induced deadline-exceeded row.
- Verified No-AI 30-second and AI 15-second countdowns.
- Verified no-time-limit trials render no countdown element and do not generate a deadline modal.
- Verified all six counterbalance-list URLs reach Application 1 with the expected No-AI actions.
- Verified a refreshed incomplete session shows the researcher-assistance interruption page instead of silently resuming.
- Verified instruction, feedback, trial, timeout, overtime, reason, completion, and mobile layouts by screenshot.
- Browser console: no application errors. Tailwind CDN emits its standard production-use warning; see methodology decisions.

## Backend checks

Automated tests cover authoritative 12-cell assignment, duplicate-session behavior, wrong-token and raw-identifier rejection, canonical idempotency, retry replacement under one key, page-exit batch shape, and refusal to complete before 60 complete trials plus both questionnaires are acknowledged.

The committed production configuration remains `local_only`. An approved endpoint, consent version, origin allowlist, retention policy, and Prolific completion URL are still required before claiming server-backed collection or automatic completion redirect.
