# Experiment export data dictionary - UI v3

## Identity and assignment

`participant_id`, `study_id`, and `session_id` identify the session. In backend mode these are authoritative internal values. `condition` is either `pressure_30s_no_ai_15s_ai` or `no_time_limit`. `counterbalance_list`, its source, trial order, trial/applicant ID, assigned condition, phase, manifest versions, hash, and presentation seeds are exported on every row.

## Decision timing

| Field | Meaning |
| --- | --- |
| `trial_onset_timestamp_iso` | Trial became fully visible after transition |
| `trial_deadline_ms` | 30000, 15000, or blank for untimed |
| `deadline_exceeded` | Deadline boundary passed before a valid choice |
| `timed_out` | Legacy alias of `deadline_exceeded` |
| `decision_completed` | A final choice was eventually saved |
| `decision_completed_on_time` | Final choice occurred before the deadline, or in an untimed trial |
| `decision_rt_total_ms` | Monotonic onset-to-final-choice time |
| `decision_rt_on_time_ms` | Timed on-time RT only |
| `decision_rt_untimed_ms` | No-time-limit RT only |
| `decision_rt_ms` | Legacy RT; blank after deadline exceeded |
| `overtime_ms` | Time from deadline boundary to final choice |
| `post_timeout_decision_ms` | Time from modal acknowledgement to final choice |

`page_hidden_during_trial`, `page_hidden_total_ms`, and `visibility_events_json` retain background/foreground events for sensitivity checks.

## Choice

`user_choice` is `approve`/`reject` for No-AI or `agree`/`override` for AI trials. `user_final_decision` and compatibility alias `final_decision` are always `approve` or `reject` after completion. `user_agreed_with_ai` is boolean on AI trials and blank on No-AI trials. Choice fields remain blank in a partial deadline record.

## Deadline follow-up

Deadline records progress through `deadline_exceeded_incomplete`, `overtime_decision`, `decision_saved_reason_pending`, optional `retrospective_pending`, and `complete`, always under the same idempotency key. Reason codes and optional Other text are stored before the retrospective report.

## Retrospective report

The report appears only for AI plus cues. The displayed AI recommendation is not an option, and `reported_ai_recommendation` remains blank for backward compatibility. The export records applicant information, the displayed warranted/unwarranted cue, the explicit no-Additional-AI-Information option, Other, Other text, timestamp, and report schema version.

## Quality and phase fields

Every obvious item stores whether the final response matched its intended design direction. `obvious_quality_flag` is true at three or more errors; no participant is stopped mid-study. Phase-one feedback and phase-two transition shown/acknowledged timestamps are repeated into the final CSV, with the fictional-policy match count for the first 10 trials.
