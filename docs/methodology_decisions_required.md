# Methodology decisions required

## 1. Trial-10 feedback conflict

The enabled phase-one page reports how many of the first 10 decisions matched the fictional policy. This may teach the policy before AI exposure and change later reliance. Confirm with the supervisor whether this feedback is part of the intended manipulation; if not, set `window.EXPERIMENT_UI_CONFIG.enablePhase1Feedback = false` before data collection and preregister that choice.

## Other unresolved items

1. Confirm that the timing manipulation is analyzed and described as 30 seconds for No-AI and 15 seconds for all AI trials, not as a uniform 10- or 15-second condition.
2. Document the deterministic fictional policy as task ground truth and avoid interpreting it as actual creditworthiness or real lending correctness.
3. State that reliability, confidence, and consensus values are fixed experimental manipulations, not measured model calibration or real reviewer behavior.
4. Preregister the comprehension-retry handling and whether attempt count enters exclusion or sensitivity analyses.
5. Preregister the obvious-case quality flag threshold of three errors and keep the item-level responses for sensitivity analysis.
6. Decide how background/hidden-page events affect RT exclusion or robustness checks.
7. Validate the survey items or replace them with approved instruments and citations before formal collection.
8. `EVIDENCE_REQUIRED`: approve a consent version, production backend endpoint, origin allowlist, retention/deletion policy, and Prolific completion URL before server-backed deployment.
9. The static frontend uses Tailwind via CDN as required by the current technical specification; decide whether formal collection requires a locally pinned stylesheet for availability and version control.
