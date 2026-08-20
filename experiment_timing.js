(() => {
  "use strict";

  function monotonicNow() {
    return typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();
  }

  function createTrialClock(options = {}) {
    const hasDeadline = options.deadlineMs !== null
      && options.deadlineMs !== undefined
      && options.deadlineMs !== ""
      && Number.isFinite(Number(options.deadlineMs));
    const deadlineMs = hasDeadline
      ? Math.max(0, Number(options.deadlineMs))
      : null;
    const onDeadline = typeof options.onDeadline === "function" ? options.onDeadline : () => {};
    const onTick = typeof options.onTick === "function" ? options.onTick : () => {};
    let started = false;
    let stopped = false;
    let deadlineExceeded = false;
    let startMonotonicMs = null;
    let startWallMs = null;
    let deadlineDetectedWallMs = null;
    let deadlineTimer = null;
    let tickTimer = null;
    let hiddenStartedMonotonicMs = null;
    const visibilityEvents = [];

    function elapsedMs() {
      if (!started) {
        return 0;
      }
      return Math.max(0, monotonicNow() - startMonotonicMs);
    }

    function deadlineTimestampIso() {
      if (deadlineMs === null || startWallMs === null) {
        return "";
      }
      return new Date(startWallMs + deadlineMs).toISOString();
    }

    function triggerDeadline(source) {
      if (stopped || deadlineExceeded || deadlineMs === null || elapsedMs() < deadlineMs) {
        return false;
      }
      deadlineExceeded = true;
      deadlineDetectedWallMs = Date.now();
      window.clearTimeout(deadlineTimer);
      deadlineTimer = null;
      window.clearInterval(tickTimer);
      tickTimer = null;
      onDeadline({
        source,
        elapsedMs: Math.round(elapsedMs()),
        deadlineMs,
        deadlineTimestampIso: deadlineTimestampIso(),
        detectedTimestampIso: new Date(deadlineDetectedWallMs).toISOString()
      });
      return true;
    }

    function checkDeadline(source = "clock_check") {
      if (deadlineMs === null || stopped || deadlineExceeded) {
        return false;
      }
      return triggerDeadline(source);
    }

    function visibilityHandler() {
      const now = monotonicNow();
      if (document.visibilityState === "hidden") {
        hiddenStartedMonotonicMs = now;
        visibilityEvents.push({ type: "hidden", elapsed_ms: Math.round(elapsedMs()) });
        checkDeadline("visibility_hidden");
        return;
      }
      const duration = hiddenStartedMonotonicMs === null
        ? null
        : Math.max(0, Math.round(now - hiddenStartedMonotonicMs));
      visibilityEvents.push({ type: "visible", elapsed_ms: Math.round(elapsedMs()), hidden_duration_ms: duration });
      hiddenStartedMonotonicMs = null;
      checkDeadline("visibility_visible");
    }

    function start() {
      if (started) {
        throw new Error("Trial clock can only be started once.");
      }
      started = true;
      startMonotonicMs = monotonicNow();
      startWallMs = Date.now();
      document.addEventListener("visibilitychange", visibilityHandler);
      if (deadlineMs !== null) {
        onTick({ remainingMs: deadlineMs, elapsedMs: 0, deadlineMs });
        deadlineTimer = window.setTimeout(() => triggerDeadline("deadline_timer"), deadlineMs);
        tickTimer = window.setInterval(() => {
          if (checkDeadline("tick_boundary")) {
            return;
          }
          onTick({
            remainingMs: Math.max(0, deadlineMs - elapsedMs()),
            elapsedMs: Math.round(elapsedMs()),
            deadlineMs
          });
        }, 100);
      }
      return {
        trialOnsetTimestampIso: new Date(startWallMs).toISOString(),
        deadlineTimestampIso: deadlineTimestampIso()
      };
    }

    function attemptOnTimeDecision() {
      if (!started || stopped) {
        return { accepted: false, reason: "clock_inactive", elapsedMs: Math.round(elapsedMs()) };
      }
      if (checkDeadline("decision_boundary")) {
        return { accepted: false, reason: "deadline_exceeded", elapsedMs: Math.round(elapsedMs()) };
      }
      if (deadlineExceeded) {
        return { accepted: false, reason: "deadline_exceeded", elapsedMs: Math.round(elapsedMs()) };
      }
      return { accepted: true, elapsedMs: Math.round(elapsedMs()) };
    }

    function stop() {
      if (stopped) {
        return snapshot();
      }
      stopped = true;
      window.clearTimeout(deadlineTimer);
      window.clearInterval(tickTimer);
      deadlineTimer = null;
      tickTimer = null;
      document.removeEventListener("visibilitychange", visibilityHandler);
      return snapshot();
    }

    function snapshot() {
      const total = Math.round(elapsedMs());
      const events = visibilityEvents.slice();
      if (hiddenStartedMonotonicMs !== null) {
        events.push({
          type: "hidden_active",
          elapsed_ms: total,
          hidden_duration_ms: Math.max(0, Math.round(monotonicNow() - hiddenStartedMonotonicMs))
        });
      }
      return {
        trialOnsetTimestampIso: startWallMs === null ? "" : new Date(startWallMs).toISOString(),
        deadlineTimestampIso: deadlineTimestampIso(),
        deadlineExceeded,
        deadlineExceededTimestampIso: deadlineExceeded ? deadlineTimestampIso() : "",
        deadlineDetectedTimestampIso: deadlineDetectedWallMs === null ? "" : new Date(deadlineDetectedWallMs).toISOString(),
        elapsedMs: total,
        overtimeMs: deadlineExceeded && deadlineMs !== null ? Math.max(0, total - deadlineMs) : 0,
        deadlineMs,
        visibilityEvents: events
      };
    }

    return Object.freeze({
      start,
      stop,
      snapshot,
      elapsedMs: () => Math.round(elapsedMs()),
      attemptOnTimeDecision,
      checkDeadline,
      hasExceededDeadline: () => deadlineExceeded
    });
  }

  window.createTrialClock = createTrialClock;
})();
