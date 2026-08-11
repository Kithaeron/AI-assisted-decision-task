// Safe example only. Copy values through an approved deployment process; never add secret keys here.
window.EXPERIMENT_BACKEND_CONFIG = {
  mode: "local_only",
  apiBaseUrl: "https://example.invalid/functions/v1/experiment-api",
  requestTimeoutMs: 10000,
  headers: {},
  studyKey: "ai_assisted_loan_decision",
  consentVersion: "EVIDENCE_REQUIRED",
  consentGateSatisfied: false,
  allowUnapprovedConsentForSynthetic: false
};
