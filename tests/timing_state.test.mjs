import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";

function timingHarness(deadlineMs = 1000) {
  let now = 0;
  let nextTimer = 1;
  const timeouts = new Map();
  const listeners = new Map();
  const deadlineEvents = [];
  const context = {
    performance: { now: () => now },
    Date,
    document: {
      visibilityState: "visible",
      addEventListener: (name, callback) => listeners.set(name, callback),
      removeEventListener: (name) => listeners.delete(name)
    },
    window: {
      setTimeout: (callback, delay) => {
        const id = nextTimer++;
        timeouts.set(id, { callback, due: now + delay });
        return id;
      },
      clearTimeout: (id) => timeouts.delete(id),
      setInterval: () => nextTimer++,
      clearInterval: () => {}
    }
  };
  vm.runInNewContext(fs.readFileSync("experiment_timing.js", "utf8"), context);
  const clock = context.window.createTrialClock({
    deadlineMs,
    onDeadline: (event) => deadlineEvents.push(event)
  });
  clock.start();
  return {
    clock,
    deadlineEvents,
    setNow(value) { now = value; },
    fireDue() {
      [...timeouts.entries()].filter(([, timer]) => timer.due <= now).forEach(([id, timer]) => {
        timeouts.delete(id);
        timer.callback();
      });
    }
  };
}

test("a choice before the deadline is accepted with exact monotonic elapsed time", () => {
  const harness = timingHarness();
  harness.setNow(999);
  const decision = harness.clock.attemptOnTimeDecision();
  assert.equal(decision.accepted, true);
  assert.equal(decision.elapsedMs, 999);
  assert.equal(harness.clock.stop().elapsedMs, 999);
  assert.equal(harness.deadlineEvents.length, 0);
});

test("the deadline wins atomically when a click occurs at the exact boundary", () => {
  const harness = timingHarness();
  harness.setNow(1000);
  const result = harness.clock.attemptOnTimeDecision();
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "deadline_exceeded");
  assert.equal(harness.deadlineEvents.length, 1);
});

test("the clock continues through overtime and reports overtime separately", () => {
  const harness = timingHarness();
  harness.setNow(1000);
  harness.fireDue();
  harness.setNow(1425);
  const result = harness.clock.stop();
  assert.equal(result.deadlineExceeded, true);
  assert.equal(result.elapsedMs, 1425);
  assert.equal(result.overtimeMs, 425);
});

test("a null deadline remains genuinely untimed", () => {
  const harness = timingHarness(null);
  harness.setNow(120000);
  harness.fireDue();
  assert.equal(harness.clock.attemptOnTimeDecision().accepted, true);
  const result = harness.clock.stop();
  assert.equal(result.deadlineMs, null);
  assert.equal(result.deadlineExceeded, false);
  assert.equal(result.elapsedMs, 120000);
});
