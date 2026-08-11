(() => {
  "use strict";

  const API_CONTRACT_VERSION = "v1";
  const DEFAULT_CONFIG = Object.freeze({
    mode: "local_only",
    apiBaseUrl: "",
    requestTimeoutMs: 10000,
    headers: {},
    credentials: "omit"
  });

  class ExperimentBackendError extends Error {
    constructor(message, options = {}) {
      super(message);
      this.name = "ExperimentBackendError";
      this.status = Number(options.status) || 0;
      this.code = String(options.code || "backend_request_failed");
      this.details = options.details ?? null;
      this.retryable = options.retryable ?? (this.status === 0 || this.status >= 500 || this.status === 429);
    }
  }

  function normalizeConfig(value) {
    const candidate = value && typeof value === "object" ? value : {};
    const requestedMode = String(candidate.mode || DEFAULT_CONFIG.mode).trim().toLowerCase();
    const mode = requestedMode === "backend_required" ? "backend_required" : "local_only";
    const apiBaseUrl = String(candidate.apiBaseUrl || "").trim().replace(/\/+$/, "");

    return {
      ...DEFAULT_CONFIG,
      ...candidate,
      mode,
      apiBaseUrl,
      requestTimeoutMs: Math.max(1000, Number(candidate.requestTimeoutMs) || DEFAULT_CONFIG.requestTimeoutMs),
      headers: candidate.headers && typeof candidate.headers === "object" ? candidate.headers : {}
    };
  }

  function createExperimentBackendClient(configuration) {
    const config = normalizeConfig(configuration);

    function assertConfigured() {
      if (config.mode === "backend_required" && !config.apiBaseUrl) {
        throw new ExperimentBackendError(
          "Backend-required mode has no API base URL.",
          { code: "backend_not_configured", retryable: false }
        );
      }
    }

    async function request(path, method, input) {
      assertConfigured();
      if (config.mode === "local_only") {
        throw new ExperimentBackendError(
          "The backend API is disabled in local-only mode.",
          { code: "local_only", retryable: false }
        );
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), config.requestTimeoutMs);
      let response;

      try {
        response = await window.fetch(`${config.apiBaseUrl}${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...config.headers
          },
          credentials: config.credentials,
          signal: controller.signal,
          body: JSON.stringify(input)
        });
      } catch (error) {
        const timedOut = error?.name === "AbortError";
        throw new ExperimentBackendError(
          timedOut ? "The backend request timed out." : "The backend request could not be sent.",
          {
            code: timedOut ? "request_timeout" : "network_error",
            details: String(error?.message || error),
            retryable: true
          }
        );
      } finally {
        window.clearTimeout(timeout);
      }

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new ExperimentBackendError(
          payload?.message || `Backend request returned HTTP ${response.status}.`,
          {
            status: response.status,
            code: payload?.code || "backend_http_error",
            details: payload?.details ?? payload,
            retryable: response.status === 408 || response.status === 429 || response.status >= 500
          }
        );
      }

      if (!payload || payload.api_contract_version !== API_CONTRACT_VERSION) {
        throw new ExperimentBackendError(
          "The backend returned an unsupported API contract version.",
          { code: "invalid_backend_response", retryable: false }
        );
      }
      return payload;
    }

    function startSession(input) {
      return request("/session/start", "POST", {
        ...input,
        api_contract_version: API_CONTRACT_VERSION
      });
    }

    function upsertRecord(input, options = {}) {
      const body = {
        ...input,
        api_contract_version: API_CONTRACT_VERSION
      };

      if (options.beacon === true) {
        assertConfigured();
        if (
          config.mode !== "backend_required"
          || typeof navigator.sendBeacon !== "function"
        ) {
          return false;
        }
        return navigator.sendBeacon(
          `${config.apiBaseUrl}/record`,
          new Blob([JSON.stringify(body)], { type: "application/json" })
        );
      }

      const method = Array.isArray(body.records) ? "POST" : "PUT";
      return request("/record", method, body);
    }

    function completeSession(input) {
      return request("/session/complete", "POST", {
        ...input,
        api_contract_version: API_CONTRACT_VERSION
      });
    }

    return Object.freeze({
      mode: config.mode,
      configured: config.mode === "local_only" || Boolean(config.apiBaseUrl),
      startSession,
      upsertRecord,
      completeSession
    });
  }

  window.ExperimentBackendError = ExperimentBackendError;
  window.createExperimentBackendClient = createExperimentBackendClient;
  window.EXPERIMENT_API_CONTRACT_VERSION = API_CONTRACT_VERSION;
})();
