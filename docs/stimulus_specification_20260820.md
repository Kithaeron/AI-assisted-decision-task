# Stimulus specification - 2026-08-20

## Source

- Dataset version: `synthetic-loan-policy-no-error-v1`
- Source workbook: `formula_synthetic_applicant_dataset.xlsx` supplied outside this repository
- Source workbook SHA-256: recorded in `fixed_stimuli.js`
- Generator: `scripts/build_stimulus_manifest.py`
- Browser manifest: `fixed_stimuli.js`

The generator reads the workbook's Applicant Data and Counterbalance Map sheets, independently recalculates every policy formula, and stops on any mismatch. Browser code does not read XLSX files or generate applicant values.

## Visible applicant fields

1. Requested loan
2. Annual income
3. Repayment term in years
4. Credit score
5. Savings

The only credit-score explanation displayed is: "Credit scores range from 0 to 1000, with higher scores indicating lower estimated credit risk."

## Fixed policy

The task-defined fictional policy is deterministic:

- annual burden = requested loan / (repayment term x annual income)
- affordability signal = clip((0.12 - annual burden) / 0.08, -1, 1)
- credit signal = clip((credit score - 500) / 200, -1, 1)
- savings signal = clip((savings/requested loan - 0.25) / 0.20, -1, 1)
- raw score = 0.50 affordability + 0.35 credit + 0.15 savings
- latent score = raw score / 0.362859017617954
- task label = APPROVE when latent score >= 0; otherwise REJECT

This is fictional task ground truth, not an observed banking outcome.

## AI schedule and Additional AI Information

Each 10-applicant block has five AI APPROVE and five AI REJECT recommendations. Eight recommendations match the fictional policy; one is a false approve and one a false reject. Obvious cases always match. Mismatches use non-obvious cases nearest the decision boundary that still contain a visible signal supporting the AI direction.

Feature Explanation text names one displayed signal that supports the fixed AI recommendation without exposing the formula. Historical Reliability, Raw Confidence, and Social Consensus use only 70, 80, or 90. Each level occurs 20 times overall and 3/3/4 times per block for each applicable cue family.

## Counterbalancing

Six fixed lists rotate each applicant block through `no_ai`, `ai_only`, `W1_U1`, `W1_U2`, `W2_U1`, and `W2_U2`. Each participant sees all 60 applicants once, with phase order No-AI, AI-only, then AI plus cues. Trials are shuffled within phase, and the two Additional AI Information panels are independently randomized with a logged seed and position.

## Fixed checks

- 60 unique applicants and trial IDs
- 30 policy APPROVE / 30 policy REJECT
- 30 AI APPROVE / 30 AI REJECT
- 48/60 AI-policy matches
- six obvious cases: three intended APPROVE and three intended REJECT
- one obvious case in each source block and each assigned condition per list
- each participant's 50 AI trials contain 40 matches and 10 mismatches
