import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";

function loadClient(fetchImplementation) {
  const beacons = [];
  const context = {
    AbortController,
    Blob,
    navigator: {
      sendBeacon(url, body) {
        beacons.push({ url, body });
        return true;
      }
    },
    window: {
      fetch: fetchImplementation,
      setTimeout,
      clearTimeout
    }
  };
  vm.runInNewContext(fs.readFileSync("experiment_backend_client.js", "utf8"), context);
  return { context, beacons };
}

function response(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; }
  };
}

test("provider-neutral client uses the three API routes and explicit methods", async () => {
  const calls = [];
  const { context } = loadClient(async (url, options) => {
    calls.push({ url, options });
    return response(200, { api_contract_version: "v1", completed: true });
  });
  const client = context.window.createExperimentBackendClient({
    mode: "backend_required",
    apiBaseUrl: "https://example.test/experiment-api/"
  });
  await client.startSession({ value: 1 });
  await client.upsertRecord({ record_type: "trial" });
  await client.upsertRecord({ records: [{}] });
  await client.completeSession({ value: 2 });
  assert.deepEqual(calls.map((call) => [call.url, call.options.method]), [
    ["https://example.test/experiment-api/session/start", "POST"],
    ["https://example.test/experiment-api/record", "PUT"],
    ["https://example.test/experiment-api/record", "POST"],
    ["https://example.test/experiment-api/session/complete", "POST"]
  ]);
  calls.forEach((call) => assert.equal(JSON.parse(call.options.body).api_contract_version, "v1"));
});

test("backend-required mode fails closed when unconfigured", async () => {
  const { context } = loadClient(async () => response(200, {}));
  const client = context.window.createExperimentBackendClient({ mode: "backend_required" });
  await assert.rejects(
    client.startSession({}),
    (error) => error.code === "backend_not_configured" && error.retryable === false
  );
});

test("HTTP errors retain useful codes and retry classification", async () => {
  const { context } = loadClient(async () => response(409, {
    api_contract_version: "v1",
    code: "session_incomplete",
    message: "Missing records",
    details: { trial_count: 59 }
  }));
  const client = context.window.createExperimentBackendClient({
    mode: "backend_required",
    apiBaseUrl: "https://example.test"
  });
  await assert.rejects(
    client.completeSession({}),
    (error) => error.code === "session_incomplete"
      && error.details.trial_count === 59
      && error.retryable === false
  );
});

test("beacon batches use the same logical record operation", () => {
  const { context, beacons } = loadClient(async () => response(200, {}));
  const client = context.window.createExperimentBackendClient({
    mode: "backend_required",
    apiBaseUrl: "https://example.test/experiment-api"
  });
  assert.equal(client.upsertRecord({ records: [{ record_type: "trial" }] }, { beacon: true }), true);
  assert.equal(beacons[0].url, "https://example.test/experiment-api/record");
});
