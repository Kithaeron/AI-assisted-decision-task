import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

function loadPersistence({ backendClient, storage, snapshot, backendSession }) {
  const context = {
    Blob,
    navigator: { sendBeacon: () => true },
    console,
    window: { localStorage: storage, setTimeout: () => 1, clearTimeout: () => {} }
  };
  vm.runInNewContext(fs.readFileSync("experiment_persistence.js", "utf8"), context);
  return context.window.createExperimentPersistence({
    storageKey: "test-checkpoint",
    backendClient,
    getSessionSnapshot: () => snapshot,
    getBackendSession: () => backendSession,
    retryConfig: { baseDelayMs: 1, maxDelayMs: 2 }
  });
}

test("temporary write failure remains queued and a retry acknowledges the same key", async () => {
  let attempts = 0;
  const backendClient = {
    mode: "backend_required",
    configured: true,
    async upsertRecord(input) {
      attempts += 1;
      assert.equal(input.record_type, "trial");
      if (attempts === 1) throw Object.assign(new Error("temporary"), { code: "network_error" });
      return { api_contract_version: "v1" };
    }
  };
  const storage = createStorage();
  const persistence = loadPersistence({
    backendClient,
    storage,
    snapshot: { position: 1 },
    backendSession: { experimentSessionId: "session", sessionWriteToken: "token" }
  });
  persistence.queueUpsert("session:T001", "trial", { record_type: "trial" });
  await persistence.flushRetryQueue({ force: true });
  assert.equal(persistence.pendingCount(), 1);
  await persistence.flushRetryQueue({ force: true });
  assert.equal(persistence.pendingCount(), 0);
  assert.equal(persistence.statusFor("session:T001"), "acknowledged");
});

test("later trial version replaces the pending record under one idempotency key", async () => {
  const sent = [];
  const backendClient = {
    mode: "backend_required",
    configured: true,
    async upsertRecord(input) { sent.push(input); }
  };
  const persistence = loadPersistence({
    backendClient,
    storage: createStorage(),
    snapshot: {},
    backendSession: { experimentSessionId: "session", sessionWriteToken: "token" }
  });
  persistence.queueUpsert("session:T001", "trial", { record_type: "trial", report_completed: "false" });
  persistence.queueUpsert("session:T001", "trial", { record_type: "trial", report_completed: "true" });
  assert.equal(persistence.pendingCount(), 1);
  await persistence.flushRetryQueue({ force: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].record.report_completed, "true");
});

test("checkpoint restore preserves retry queue and session snapshot", () => {
  const storage = createStorage();
  const backendClient = { mode: "backend_required", configured: true, upsertRecord: async () => ({}) };
  const first = loadPersistence({
    backendClient,
    storage,
    snapshot: { trialOrderIds: ["T003", "T001"], currentTrialIndex: 1 },
    backendSession: { experimentSessionId: "session", sessionWriteToken: "token" }
  });
  first.queueUpsert("session:T001", "trial", { record_type: "trial" });
  first.checkpoint("refresh");
  const second = loadPersistence({
    backendClient,
    storage,
    snapshot: {},
    backendSession: { experimentSessionId: "session", sessionWriteToken: "token" }
  });
  assert.deepEqual(Array.from(second.restore().trialOrderIds), ["T003", "T001"]);
  assert.equal(second.pendingCount(), 1);
});
