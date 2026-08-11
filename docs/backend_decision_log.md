# Backend implementation decision log

Date: 2026-08-11  
Branch: `feat/supabase-backend`  
Starting commit: `b6089d0`

## Implemented decisions

- Retain the vanilla static experiment and local-first checkpoint/CSV behavior.
- Add a provider-neutral `v1` HTTP boundary with start, record upsert, and completion operations.
- Use a Supabase Edge Function as the only browser-facing writer; browser roles receive no direct table access.
- Allocate the two conditions x six lists atomically on the server and treat that assignment as authoritative in formal sessions.
- Change the pressure export/session label to `15_seconds` while retaining the frozen 30-second No-AI and 15-second AI deadlines.
- Save `timing_policy_version=pressure_v2_first10_30s_then50_15s` in session state, trial/questionnaire payloads, and CSV.
- Keep raw Prolific values out of analysis payloads and backend-mode filenames. Restrict them to the isolated start/linkage path.
- Store only a write-token hash. Derive the client token with a server-only HMAC secret so an interrupted submission can resume without plaintext token storage.
- Require server completeness confirmation before returning the server-configured Prolific completion URL.
- Preserve stimulus manifest `fixed-60-counterbalanced-six-obvious-v4`; no v5 values or pilot results are introduced.

## Methodological effect

The timing behavior is unchanged from the prior implementation, but the pressure label is corrected from `10_seconds` to `15_seconds`. Backend assignment replaces participant-hash/URL allocation only in `backend_required`; local development retains manual selection. The collection mechanism now distinguishes local acknowledgement, record acknowledgement, and server-confirmed completeness.

## EVIDENCE_REQUIRED

- supervisor/Data Steward approval for Supabase and the final EU region;
- HREC/DMP approval and exact consent version;
- raw versus HMAC-only Prolific identifier policy and deletion schedule;
- Edge Function/platform log retention and subprocessor assessment;
- approved GitHub Pages production origin and Prolific completion code;
- Project Data Storage export path and schedule;
- deployment abuse controls for unauthenticated `/session/start`;
- production payment/completion recovery procedure.
- review/removal or approved self-hosting of the existing Tailwind CDN and Google Fonts; this backend task does not claim control of their request metadata, availability, or script supply-chain risk.
