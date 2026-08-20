// Production-safe default. An approved deployment may replace this public configuration.
window.EXPERIMENT_BACKEND_CONFIG = window.EXPERIMENT_BACKEND_CONFIG || {
  mode: "local_only",
  apiBaseUrl: "",
  requestTimeoutMs: 10000,
  headers: {},
  studyKey: "ai_assisted_loan_decision",
  consentVersion: "EVIDENCE_REQUIRED",
  consentGateSatisfied: false,
  allowUnapprovedConsentForSynthetic: false
};
