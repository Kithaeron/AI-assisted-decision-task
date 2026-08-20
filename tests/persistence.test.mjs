import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "experiment_persistence.js"), "utf8");
const values = new Map();
let fetchShouldFail = true;
let beaconPayload = null;

const window = {
  localStorage: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  },
  setTimeout: () => 1,
  clearTimeout: () => {},
  fetch: async () => {
    if (fetchShouldFail) throw new Error("simulated network failure");
    return { ok: true };
  }
};
const navigator = {
  sendBeacon: (endpoint, payload) => {
    beaconPayload = { endpoint, payload };
    return true;
  }
};
const sandbox = { window, navigator, console, Date, Blob, JSON, Set, Math, String, Array, Boolean, Number, Error };
vm.runInNewContext(source, sandbox, { filename: "experiment_persistence.js" });

const persistence = window.createExperimentPersistence({
  storageKey: "test-checkpoint",
  sessionId: "session-1",
  backendConfig: {
    mode: "backend_upsert",
    endpoint: "https://approved.example/upsert",
    beaconEndpoint: "https://approved.example/beacon",
    baseDelayMs: 1,
    maxDelayMs: 2
  },
  getSessionSnapshot: () => ({ currentTrialIndex: 7 })
});

assert.equal(persistence.restore(), null);
assert.equal(persistence.checkpoint("test"), true);
assert.equal(JSON.parse(values.get("test-checkpoint")).session.currentTrialIndex, 7);

persistence.queueUpsert("session-1:T008", { revision: 1 });
persistence.queueUpsert("session-1:T008", { revision: 2 });
assert.equal(persistence.pendingCount(), 1, "same idempotency key must replace, not duplicate");
await persistence.flushRetryQueue({ force: true });
assert.equal(persistence.pendingCount(), 1, "failed upsert remains queued");
assert.equal(persistence.statusFor("session-1:T008"), "pending");

fetchShouldFail = false;
await persistence.flushRetryQueue({ force: true });
assert.equal(persistence.pendingCount(), 0);
assert.equal(persistence.statusFor("session-1:T008"), "acknowledged");

persistence.queueUpsert("session-1:T009", { revision: 1 });
assert.equal(persistence.sendBeacon(), true);
assert.equal(beaconPayload.endpoint, "https://approved.example/beacon");
assert.equal(persistence.clear(), true);
assert.equal(values.has("test-checkpoint"), false);
assert.equal(persistence.pendingCount(), 0);

console.log("Persistence failure/retry/beacon validation: PASS");
