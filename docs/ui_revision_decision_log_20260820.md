# UI revision decision log - 2026-08-20

- Replaced runtime-generated/legacy profiles with a generated static manifest from the supplied formula workbook.
- Defined the workbook's deterministic classification as fictional task ground truth, not real loan performance.
- Fixed AI recommendations before participant assignment so every block retains a 5/5 direction split and 8/10 policy match rate.
- Changed the truthful pressure label to `pressure_30s_no_ai_15s_ai` and versioned the timing contract.
- Added a monotonic clock with deadline-first boundary resolution and a required same-trial overtime completion path.
- Kept transition time outside RT and logged page visibility changes.
- Removed participant-facing identifiers, assignment metadata, RT displays, CSV controls, and self-service resume.
- Replaced trivial instructed-response attention checks with a retryable task comprehension check.
- Added phase-one fictional-policy feedback behind `enablePhase1Feedback`, enabled by default.
- Renamed participant-facing cue language to Additional AI Information and removed AI recommendation from retrospective options.
- Retained immediate local checkpointing, idempotent backend upserts, retry/backoff, page-exit beacon, and automatic CSV backup.
- Kept backend mode disabled by default because no approved production endpoint or consent/completion configuration is present.
