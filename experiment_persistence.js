(() => {
  "use strict";

  const CHECKPOINT_SCHEMA_VERSION = 2;
  const DEFAULT_CONFIG = Object.freeze({
    baseDelayMs: 1000,
    maxDelayMs: 30000
  });

  function createExperimentPersistence(options) {
    const storageKey = String(options.storageKey);
    const getSessionSnapshot = options.getSessionSnapshot;
    const getBackendSession = options.getBackendSession;
    const backendClient = options.backendClient;
    const config = {
      ...DEFAULT_CONFIG,
      ...(options.retryConfig || {})
    };
    const mode = backendClient?.mode === "backend_required" ? "backend_required" : "local_only";
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
        if (![1, CHECKPOINT_SCHEMA_VERSION].includes(parsed.schemaVersion)) {
          return null;
        }

        retryQueue = Array.isArray(parsed.retryQueue)
          ? parsed.retryQueue.map((item) => ({
              ...item,
              recordType: item.recordType || item.record?.record_type || "trial"
            }))
          : [];
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
          dataCollectionMode: mode,
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
      if (mode !== "backend_required" || retryQueue.length === 0) {
        return;
      }

      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(() => {
        flushRetryQueue().catch((error) => {
          console.warn("Background backend retry failed.", error);
        });
      }, Math.max(0, delayMs));
    }

    function queueUpsert(idempotencyKey, recordType, record) {
      const key = String(idempotencyKey);
      if (!key || !["trial", "questionnaire"].includes(recordType)) {
        throw new Error("A valid idempotency key and record type are required.");
      }
      if (mode === "local_only") {
        checkpoint("local_only_record");
        return { idempotencyKey: key, status: "local_only" };
      }

      acknowledgedKeys.delete(key);
      const existingIndex = retryQueue.findIndex((item) => item.idempotencyKey === key);
      const queued = {
        idempotencyKey: key,
        recordType,
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
      return { idempotencyKey: key, status: "pending" };
    }

    function requireBackendSession() {
      const session = getBackendSession();
      if (!session?.experimentSessionId || !session?.sessionWriteToken) {
        throw new Error("The authoritative backend session is not available.");
      }
      return session;
    }

    async function sendItem(item) {
      const session = requireBackendSession();
      await backendClient.upsertRecord({
        experiment_session_id: session.experimentSessionId,
        session_write_token: session.sessionWriteToken,
        idempotency_key: item.idempotencyKey,
        record_type: item.recordType,
        record: item.record
      });
    }

    async function flushRetryQueue(options = {}) {
      if (mode !== "backend_required") {
        return { mode, acknowledged: 0, pending: 0 };
      }
      if (flushing) {
        return { mode, acknowledged: acknowledgedKeys.size, pending: retryQueue.length };
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
              queued.lastErrorCode = String(error?.code || "backend_write_failed");
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

      return { mode, acknowledged: acknowledgedKeys.size, pending: retryQueue.length };
    }

    function sendBeacon() {
      if (mode !== "backend_required" || retryQueue.length === 0) {
        return false;
      }

      let session;
      try {
        session = requireBackendSession();
      } catch {
        return false;
      }

      return backendClient.upsertRecord({
        experiment_session_id: session.experimentSessionId,
        session_write_token: session.sessionWriteToken,
        records: retryQueue.map((item) => ({
          idempotency_key: item.idempotencyKey,
          record_type: item.recordType,
          record: item.record
        }))
      }, { beacon: true });
    }

    function statusFor(idempotencyKey) {
      const key = String(idempotencyKey);
      if (mode === "local_only") {
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

    return Object.freeze({
      mode,
      endpointConfigured: mode === "backend_required" && Boolean(backendClient?.configured),
      restore: readCheckpoint,
      checkpoint,
      queueUpsert,
      flushRetryQueue,
      sendBeacon,
      statusFor,
      pendingCount: () => retryQueue.length,
      allAcknowledged: () => mode === "backend_required" && retryQueue.length === 0
    });
  }

  window.createExperimentPersistence = createExperimentPersistence;
})();
