(() => {
  "use strict";

  const CHECKPOINT_SCHEMA_VERSION = 1;
  const DEFAULT_CONFIG = Object.freeze({
    mode: "local_only",
    endpoint: "",
    beaconEndpoint: "",
    method: "PUT",
    headers: {},
    credentials: "omit",
    baseDelayMs: 1000,
    maxDelayMs: 30000
  });

  function normalizeConfig(value) {
    const candidate = value && typeof value === "object" ? value : {};
    const endpoint = String(candidate.endpoint || "").trim();
    const requestedMode = String(candidate.mode || "").trim().toLowerCase();
    const mode = endpoint && requestedMode !== "local_only" ? "backend_upsert" : "local_only";

    return {
      ...DEFAULT_CONFIG,
      ...candidate,
      endpoint,
      mode,
      headers: candidate.headers && typeof candidate.headers === "object" ? candidate.headers : {}
    };
  }

  function createExperimentPersistence(options) {
    const storageKey = String(options.storageKey);
    const sessionId = String(options.sessionId);
    const getSessionSnapshot = options.getSessionSnapshot;
    const config = normalizeConfig(options.backendConfig);
    let retryQueue = [];
    let acknowledgedKeys = new Set();
    let retryTimer = null;
    let flushing = false;
    let storageAvailable = true;

    function readCheckpoint() {
      if (!storageAvailable) {
        return null;
      }

      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
          return null;
        }

        const parsed = JSON.parse(raw);
        if (parsed.schemaVersion !== CHECKPOINT_SCHEMA_VERSION) {
          return null;
        }

        retryQueue = Array.isArray(parsed.retryQueue) ? parsed.retryQueue : [];
        acknowledgedKeys = new Set(
          Array.isArray(parsed.acknowledgedKeys) ? parsed.acknowledgedKeys : []
        );
        return parsed.session || null;
      } catch (error) {
        storageAvailable = false;
        console.warn("Local checkpoint restore failed.", error);
        return null;
      }
    }

    function checkpoint(reason) {
      if (!storageAvailable) {
        return false;
      }

      try {
        const payload = {
          schemaVersion: CHECKPOINT_SCHEMA_VERSION,
          savedAtIso: new Date().toISOString(),
          reason: String(reason || "state_update"),
          dataCollectionMode: config.mode,
          session: getSessionSnapshot(),
          retryQueue,
          acknowledgedKeys: Array.from(acknowledgedKeys)
        };
        window.localStorage.setItem(storageKey, JSON.stringify(payload));
        return true;
      } catch (error) {
        storageAvailable = false;
        console.warn("Local checkpoint save failed.", error);
        return false;
      }
    }

    function backoffDelay(attempts) {
      const exponent = Math.max(0, Number(attempts) - 1);
      return Math.min(config.baseDelayMs * (2 ** exponent), config.maxDelayMs);
    }

    function scheduleRetry(delayMs = 0) {
      if (config.mode !== "backend_upsert" || retryQueue.length === 0) {
        return;
      }

      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(() => {
        flushRetryQueue().catch((error) => {
          console.warn("Background backend retry failed.", error);
        });
      }, Math.max(0, delayMs));
    }

    function queueUpsert(idempotencyKey, record) {
      const key = String(idempotencyKey);
      if (config.mode === "local_only") {
        checkpoint("local_only_record");
        return {
          idempotencyKey: key,
          status: "local_only"
        };
      }

      acknowledgedKeys.delete(key);
      const existingIndex = retryQueue.findIndex((item) => item.idempotencyKey === key);
      const queued = {
        idempotencyKey: key,
        sessionId,
        record,
        attempts: 0,
        nextAttemptAt: Date.now(),
        queuedAtIso: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        retryQueue[existingIndex] = queued;
      } else {
        retryQueue.push(queued);
      }

      checkpoint("backend_record_queued");
      scheduleRetry(0);
      return {
        idempotencyKey: key,
        status: "pending"
      };
    }

    async function sendItem(item) {
      const response = await window.fetch(config.endpoint, {
        method: String(config.method || "PUT").toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          ...config.headers
        },
        credentials: config.credentials,
        body: JSON.stringify({
          idempotency_key: item.idempotencyKey,
          session_id: sessionId,
          record: item.record
        })
      });

      if (!response.ok) {
        throw new Error(`Backend upsert returned HTTP ${response.status}.`);
      }
    }

    async function flushRetryQueue(options = {}) {
      if (config.mode !== "backend_upsert") {
        return {
          mode: config.mode,
          acknowledged: 0,
          pending: 0
        };
      }
      if (flushing) {
        return {
          mode: config.mode,
          acknowledged: acknowledgedKeys.size,
          pending: retryQueue.length
        };
      }

      flushing = true;
      window.clearTimeout(retryTimer);
      retryTimer = null;

      try {
        const force = Boolean(options.force);
        const snapshot = [...retryQueue];
        for (const item of snapshot) {
          if (!force && item.nextAttemptAt > Date.now()) {
            continue;
          }

          try {
            await sendItem(item);
            retryQueue = retryQueue.filter(
              (queued) => queued.idempotencyKey !== item.idempotencyKey
            );
            acknowledgedKeys.add(item.idempotencyKey);
            checkpoint("backend_record_acknowledged");
          } catch (error) {
            const queued = retryQueue.find(
              (candidate) => candidate.idempotencyKey === item.idempotencyKey
            );
            if (queued) {
              queued.attempts += 1;
              queued.nextAttemptAt = Date.now() + backoffDelay(queued.attempts);
              queued.lastError = String(error.message || error);
              queued.lastAttemptAtIso = new Date().toISOString();
            }
            checkpoint("backend_record_retry_scheduled");
          }
        }
      } finally {
        flushing = false;
      }

      if (retryQueue.length > 0) {
        const nextAttemptAt = Math.min(...retryQueue.map((item) => item.nextAttemptAt));
        scheduleRetry(Math.max(0, nextAttemptAt - Date.now()));
      }

      return {
        mode: config.mode,
        acknowledged: acknowledgedKeys.size,
        pending: retryQueue.length
      };
    }

    function sendBeacon() {
      if (
        config.mode !== "backend_upsert"
        || retryQueue.length === 0
        || typeof navigator.sendBeacon !== "function"
      ) {
        return false;
      }

      const endpoint = String(config.beaconEndpoint || config.endpoint);
      const payload = new Blob([
        JSON.stringify({
          session_id: sessionId,
          records: retryQueue.map((item) => ({
            idempotency_key: item.idempotencyKey,
            record: item.record
          }))
        })
      ], { type: "application/json" });

      return navigator.sendBeacon(endpoint, payload);
    }

    function statusFor(idempotencyKey) {
      const key = String(idempotencyKey);
      if (config.mode === "local_only") {
        return "local_only";
      }
      if (acknowledgedKeys.has(key)) {
        return "acknowledged";
      }
      if (retryQueue.some((item) => item.idempotencyKey === key)) {
        return "pending";
      }
      return "not_queued";
    }

    function clear() {
      window.clearTimeout(retryTimer);
      retryTimer = null;
      retryQueue = [];
      acknowledgedKeys = new Set();
      if (!storageAvailable) {
        return false;
      }
      try {
        window.localStorage.removeItem(storageKey);
        return true;
      } catch (error) {
        console.warn("Local checkpoint cleanup failed.", error);
        return false;
      }
    }

    return {
      mode: config.mode,
      endpointConfigured: config.mode === "backend_upsert",
      restore: readCheckpoint,
      checkpoint,
      queueUpsert,
      flushRetryQueue,
      sendBeacon,
      statusFor,
      clear,
      pendingCount: () => retryQueue.length,
      allAcknowledged: () => config.mode === "backend_upsert" && retryQueue.length === 0
    };
  }

  window.createExperimentPersistence = createExperimentPersistence;
})();
