(() => {
  "use strict";

  const UI_VERSION = "experiment-ui-2026-08-20-v1";
  const TIMING_POLICY_VERSION = "pressure_v3_first10_30s_then50_15s_overtime_completion";
  const REPORT_SCHEMA_VERSION = "additional_ai_information_v3_no_ai_recommendation_option";
  const TOTAL_TRIALS = 60;
  const TRANSITION_HALF_MS = 250;
  const ENABLE_PHASE1_FEEDBACK = window.EXPERIMENT_UI_CONFIG?.enablePhase1Feedback !== false;
  const DATASET_VERSION = window.DATASET_VERSION;
  const MANIFEST_VERSION = window.STIMULUS_MANIFEST_VERSION;
  const MANIFEST_HASH = window.STIMULUS_MANIFEST_HASH;
  const FIXED_STIMULI = window.FIXED_STIMULI;
  const COUNTERBALANCE_LISTS = window.COUNTERBALANCE_LISTS;
  const app = document.getElementById("app");
  const transitionOverlay = document.getElementById("trialTransition");
  const modalRoot = document.getElementById("modalRoot");
  const params = new URLSearchParams(window.location.search);

  if (!Array.isArray(FIXED_STIMULI) || FIXED_STIMULI.length !== TOTAL_TRIALS) {
    throw new Error("The fixed 60-trial stimulus manifest failed to load.");
  }
  if (!COUNTERBALANCE_LISTS || Object.keys(COUNTERBALANCE_LISTS).length !== 6) {
    throw new Error("The six-list counterbalance manifest failed to load.");
  }

  const CONDITION_META = Object.freeze({
    no_ai: { trialType: "no_ai_baseline", trialPhase: "phase_1_no_ai", cueIds: [] },
    ai_only: { trialType: "ai_only_baseline", trialPhase: "phase_2_ai_only", cueIds: [] },
    W1_U1: { trialType: "ai_plus_cues", trialPhase: "phase_3_ai_plus_cues", cueIds: ["W1", "U1"] },
    W1_U2: { trialType: "ai_plus_cues", trialPhase: "phase_3_ai_plus_cues", cueIds: ["W1", "U2"] },
    W2_U1: { trialType: "ai_plus_cues", trialPhase: "phase_3_ai_plus_cues", cueIds: ["W2", "U1"] },
    W2_U2: { trialType: "ai_plus_cues", trialPhase: "phase_3_ai_plus_cues", cueIds: ["W2", "U2"] }
  });

  const BACKEND_CONFIG = window.EXPERIMENT_BACKEND_CONFIG || {
    mode: "local_only",
    apiBaseUrl: "",
    studyKey: "ai_assisted_loan_decision",
    consentVersion: "EVIDENCE_REQUIRED",
    consentGateSatisfied: false,
    allowUnapprovedConsentForSynthetic: false
  };
  const backendClient = window.createExperimentBackendClient(BACKEND_CONFIG);
  const backendRequired = backendClient.mode === "backend_required";
  const launchIdentity = resolveLaunchIdentity();
  const clientInstanceId = getOrCreateClientInstanceId(launchIdentity.sessionId);
  const initialConditionKey = normalizeTimingCondition(
    params.get("timing_condition") || params.get("condition") || params.get("time_pressure")
  );
  const initialCounterbalance = resolveCounterbalanceList(
    params.get("counterbalance_list") || params.get("list"),
    launchIdentity.participantId
  );

  const state = {
    participantId: launchIdentity.participantId,
    studyId: launchIdentity.studyId,
    sessionId: launchIdentity.sessionId,
    isProlificSession: launchIdentity.isProlificSession,
    clientInstanceId,
    experimentSessionId: "",
    sessionWriteToken: "",
    backendSessionStarted: false,
    backendSessionResumed: false,
    conditionKey: initialConditionKey,
    counterbalanceList: initialCounterbalance.list,
    counterbalanceListSource: initialCounterbalance.source,
    presentationSeed: params.get("seed") || launchIdentity.participantId,
    trialOrder: [],
    currentTrialIndex: 0,
    experimentStarted: false,
    responses: [],
    pendingResponse: null,
    activeTrialState: null,
    comprehensionAttempts: [],
    comprehensionPassedAtIso: "",
    preSurvey: null,
    postSurvey: null,
    phase1FeedbackShownAtIso: "",
    phase1FeedbackAcknowledgedAtIso: "",
    phase1PolicyMatchesN: null,
    phase2TransitionShownAtIso: "",
    phase2TransitionAcknowledgedAtIso: "",
    completionStarted: false,
    completionConfirmed: false,
    completionError: ""
  };

  let activeClock = null;
  let decisionLocked = false;
  let modalSubmissionLocked = false;
  let transitionInProgress = false;

  const persistence = window.createExperimentPersistence({
    storageKey: `ai-loan-experiment:v6:${launchIdentity.sessionId}`,
    backendClient,
    getBackendSession: () => ({
      experimentSessionId: state.experimentSessionId,
      sessionWriteToken: state.sessionWriteToken
    }),
    getSessionSnapshot: serializeSessionState,
    retryConfig: BACKEND_CONFIG.retry
  });
  const restoredSession = persistence.restore();

  function createUuid() {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return Array.from(bytes, (value, index) => {
      const hex = value.toString(16).padStart(2, "0");
      return [3, 5, 7, 9].includes(index) ? `-${hex}` : hex;
    }).join("");
  }

  function readJsonStorage(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Persistence provides the participant-safe fallback for storage failures.
    }
  }

  function resolveLaunchIdentity() {
    const prolificPid = String(params.get("PROLIFIC_PID") || "").trim();
    const studyId = String(params.get("STUDY_ID") || "").trim();
    const prolificSessionId = String(params.get("SESSION_ID") || "").trim();
    if (prolificPid) {
      const sessionId = prolificSessionId || `prolific-session-${hashString(`${prolificPid}:${studyId}`)}`;
      return {
        participantId: prolificPid,
        studyId,
        sessionId,
        isProlificSession: true
      };
    }

    const key = "ai-loan-experiment:development-identity:v3";
    if (params.get("researcher_restart") === "1") {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // A new in-memory identity is still generated below.
      }
    }
    const stored = readJsonStorage(key);
    if (stored?.participantId && stored?.sessionId) {
      return { ...stored, studyId: stored.studyId || "development-study", isProlificSession: false };
    }
    const identity = {
      participantId: createUuid(),
      studyId: "development-study",
      sessionId: createUuid(),
      isProlificSession: false
    };
    writeJsonStorage(key, identity);
    return identity;
  }

  function getOrCreateClientInstanceId(sessionId) {
    const key = `ai-loan-experiment:client-instance:${sessionId}`;
    const stored = String(window.localStorage.getItem(key) || "");
    if (/^[0-9a-f-]{36}$/i.test(stored)) {
      return stored;
    }
    const value = createUuid();
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // The generated value remains valid for this page lifecycle.
    }
    return value;
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < String(value).length; index += 1) {
      hash ^= String(value).charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    return function random() {
      let value = seed += 0x6d2b79f5;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(values, seedText) {
    const result = values.slice();
    const random = mulberry32(hashString(seedText));
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function normalizeTimingCondition(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (["no_pressure", "no_time_limit", "untimed"].includes(normalized)) {
      return "no_pressure";
    }
    return "pressure";
  }

  function conditionLabel() {
    return state.conditionKey === "no_pressure"
      ? "no_time_limit"
      : "pressure_30s_no_ai_15s_ai";
  }

  function resolveCounterbalanceList(requested, participantId) {
    const numeric = Number(requested);
    if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 6) {
      return { list: numeric, source: "url_parameter" };
    }
    return { list: (hashString(participantId) % 6) + 1, source: "participant_id_hash" };
  }

  function deadlineFor(trial) {
    if (state.conditionKey === "no_pressure") {
      return null;
    }
    return trial.trialType === "no_ai_baseline" ? 30000 : 15000;
  }

  function deadlinePolicyFor(trial) {
    if (state.conditionKey === "no_pressure") {
      return "no_deadline";
    }
    return trial.trialType === "no_ai_baseline"
      ? "pressure_phase_1_30000ms"
      : "pressure_phases_2_3_15000ms";
  }

  function materializeStimulus(profile) {
    const assignedCondition = COUNTERBALANCE_LISTS[String(state.counterbalanceList)][profile.counterbalanceBlock - 1];
    const meta = CONDITION_META[assignedCondition];
    if (!meta) {
      throw new Error(`Unknown assigned condition: ${assignedCondition}`);
    }
    const displayOrderSeed = `${state.presentationSeed}:${profile.trialId}:additional-ai-order`;
    const cues = meta.cueIds.map((cueId) => ({ ...profile.cueBank[cueId] }));
    const displayedCues = shuffled(cues, displayOrderSeed).map((cue, index) => ({
      ...cue,
      displayPosition: index + 1
    }));
    return {
      ...profile,
      assignedCondition,
      trialType: meta.trialType,
      trialPhase: meta.trialPhase,
      cues: displayedCues,
      cueDisplayOrderSeed: String(hashString(displayOrderSeed)),
      askRetrospectiveReport: meta.trialType === "ai_plus_cues"
    };
  }

  function buildTrialOrder() {
    const materialized = FIXED_STIMULI.map(materializeStimulus);
    const phaseOrder = ["phase_1_no_ai", "phase_2_ai_only", "phase_3_ai_plus_cues"];
    return phaseOrder.flatMap((phase) => shuffled(
      materialized.filter((trial) => trial.trialPhase === phase),
      `${state.presentationSeed}:${phase}:trial-order`
    ));
  }

  function serializeSessionState() {
    return JSON.parse(JSON.stringify({
      ...state,
      sessionWriteToken: state.sessionWriteToken,
      persistenceSchema: 6,
      savedAtIso: new Date().toISOString()
    }));
  }

  function checkpoint(reason) {
    persistence.checkpoint(reason);
  }

  function recordIdentity() {
    const authoritativeId = state.experimentSessionId || state.participantId;
    return {
      participant_id: authoritativeId,
      study_id: state.experimentSessionId ? String(BACKEND_CONFIG.studyKey || "ai_assisted_loan_decision") : state.studyId,
      session_id: state.experimentSessionId || state.sessionId,
      condition: conditionLabel(),
      condition_key: state.conditionKey,
      counterbalance_list: state.counterbalanceList,
      counterbalance_list_source: state.counterbalanceListSource,
      stimulus_set_version: MANIFEST_VERSION,
      dataset_version: DATASET_VERSION,
      stimulus_manifest_version: MANIFEST_VERSION,
      stimulus_manifest_hash: MANIFEST_HASH,
      timing_policy_version: TIMING_POLICY_VERSION,
      ui_version: UI_VERSION,
      data_collection_mode: persistence.mode
    };
  }

  function consentContext() {
    const external = window.EXPERIMENT_CONSENT_CONTEXT;
    if (external && typeof external === "object") {
      return { granted: external.granted === true, version: String(external.version || "") };
    }
    return {
      granted: BACKEND_CONFIG.consentGateSatisfied === true,
      version: String(BACKEND_CONFIG.consentVersion || "")
    };
  }

  async function ensureBackendSession() {
    if (!backendRequired || state.backendSessionStarted) {
      return;
    }
    const consent = consentContext();
    const syntheticConsentAllowed = !state.isProlificSession
      && BACKEND_CONFIG.allowUnapprovedConsentForSynthetic === true;
    if (!consent.granted || !consent.version || (consent.version === "EVIDENCE_REQUIRED" && !syntheticConsentAllowed)) {
      throw new Error("An approved data-collection configuration is not available.");
    }
    if (state.isProlificSession && (!launchIdentity.studyId || !params.get("SESSION_ID"))) {
      throw new Error("The study launch information is incomplete.");
    }

    const result = await backendClient.startSession({
      study_key: String(BACKEND_CONFIG.studyKey || "ai_assisted_loan_decision"),
      prolific_pid: state.isProlificSession ? state.participantId : `synthetic-${state.clientInstanceId}`,
      prolific_study_id: state.isProlificSession ? state.studyId : "synthetic-development-study",
      prolific_session_id: state.isProlificSession ? state.sessionId : `synthetic-session-${state.clientInstanceId}`,
      client_instance_id: state.clientInstanceId,
      stimulus_set_version: MANIFEST_VERSION,
      timing_policy_version: TIMING_POLICY_VERSION,
      consent_version: consent.version,
      client_build_version: UI_VERSION
    });
    if (
      result.stimulus_set_version !== MANIFEST_VERSION
      || result.timing_policy_version !== TIMING_POLICY_VERSION
      || !["pressure", "no_pressure"].includes(result.assignment?.condition_key)
      || !Number.isInteger(Number(result.assignment?.counterbalance_list))
    ) {
      throw new Error("The experiment assignment could not be verified.");
    }
    state.experimentSessionId = String(result.experiment_session_id || "");
    state.sessionWriteToken = String(result.session_write_token || "");
    state.backendSessionStarted = true;
    state.backendSessionResumed = result.resumed === true;
    state.conditionKey = result.assignment.condition_key;
    state.counterbalanceList = Number(result.assignment.counterbalance_list);
    state.counterbalanceListSource = "backend_assignment";
    state.participantId = state.experimentSessionId;
    state.sessionId = state.experimentSessionId;
    state.studyId = String(BACKEND_CONFIG.studyKey || "ai_assisted_loan_decision");
    checkpoint("backend_session_started");
  }

  function trialRecordKey(trialId) {
    return `${state.experimentSessionId || state.sessionId}:${trialId}`;
  }

  function questionnaireKey(stage) {
    return `${state.experimentSessionId || state.sessionId}:questionnaire:${stage}`;
  }

  function saveQuestionnaire(stage, payload) {
    const record = {
      record_type: "questionnaire",
      ...recordIdentity(),
      questionnaire_stage: stage,
      ...payload,
      saved_timestamp_iso: new Date().toISOString()
    };
    persistence.queueUpsert(questionnaireKey(stage), "questionnaire", record);
    checkpoint(`questionnaire_${stage}_saved`);
  }

  function upsertResponse(response, reason) {
    const index = state.responses.findIndex((item) => item.trial_id === response.trial_id);
    if (index >= 0) {
      state.responses[index] = response;
    } else {
      state.responses.push(response);
    }
    state.pendingResponse = response.record_status === "complete" ? null : response;
    checkpoint(reason);
    persistence.queueUpsert(response.backend_idempotency_key, "trial", response);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(Number(value));
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function actionButton(label, value, secondary = false) {
    const classes = secondary
      ? "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
      : "border-slate-950 bg-slate-950 text-white hover:bg-slate-800";
    return `<button type="button" data-decision="${escapeHtml(value)}" class="decision-button min-h-14 flex-1 rounded-md border px-5 py-3 text-base font-bold transition ${classes} focus:outline-none focus:ring-4 focus:ring-slate-300">${escapeHtml(label)}</button>`;
  }

  function renderPage(content, width = "max-w-4xl") {
    app.innerHTML = `<main class="mx-auto flex min-h-screen ${width} items-center px-5 py-10"><section class="w-full">${content}</section></main>`;
    window.scrollTo(0, 0);
  }

  function renderInterrupted() {
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-10 shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">Researcher assistance required</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">This session was interrupted.</h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-slate-700">Please ask the researcher for assistance. Keep this page open so the saved session information remains available.</p>
      </div>
    `);
  }

  function instructionFooter(step, onNextLabel = "Continue") {
    return `
      <div class="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
        <span class="text-sm font-semibold text-slate-500">Instructions ${step} of 3</span>
        <button id="instructionNext" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300">${escapeHtml(onNextLabel)}</button>
      </div>`;
  }

  function renderInstruction(step) {
    if (step === 1) {
      renderPage(`
        <div class="border-t-4 border-slate-900 bg-white px-6 py-8 shadow-sm sm:px-10">
          <p class="text-sm font-bold uppercase text-slate-500">Loan decision study</p>
          <h1 class="mt-3 text-3xl font-bold text-slate-950">Review 60 fictional applications</h1>
          <p class="mt-5 text-base leading-7 text-slate-700">The applicants, loans, AI recommendations and policy outcomes in this study are fictional. They do not represent real people, real loans or observed banking outcomes.</p>
          <p class="mt-4 text-base leading-7 text-slate-700">For each application, choose the decision that best matches a fixed fictional bank policy. The same policy is used throughout the task.</p>
          ${instructionFooter(1)}
        </div>`);
    } else if (step === 2) {
      renderPage(`
        <div class="border-t-4 border-slate-900 bg-white px-6 py-8 shadow-sm sm:px-10">
          <p class="text-sm font-bold uppercase text-slate-500">Task structure</p>
          <h1 class="mt-3 text-3xl font-bold text-slate-950">Three phases</h1>
          <ol class="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            <li class="grid grid-cols-[3rem_1fr] gap-3 py-4"><span class="font-bold text-slate-500">1</span><div><strong>10 applications without AI</strong><p class="mt-1 text-slate-600">Choose Approve or Reject.</p></div></li>
            <li class="grid grid-cols-[3rem_1fr] gap-3 py-4"><span class="font-bold text-slate-500">2</span><div><strong>10 applications with an AI recommendation</strong><p class="mt-1 text-slate-600">Choose Agree or Override. The AI can be wrong.</p></div></li>
            <li class="grid grid-cols-[3rem_1fr] gap-3 py-4"><span class="font-bold text-slate-500">3</span><div><strong>40 applications with Additional AI Information</strong><p class="mt-1 text-slate-600">The recommendation and two information items appear together with the application.</p></div></li>
          </ol>
          ${instructionFooter(2)}
        </div>`);
    } else {
      const timingCopy = state.conditionKey === "no_pressure"
        ? "There is no deadline. Work at a comfortable pace."
        : "Applications 1-10 allow 30 seconds each. Applications 11-60 allow 15 seconds each. If time expires, you must still complete the same application.";
      renderPage(`
        <div class="border-t-4 border-slate-900 bg-white px-6 py-8 shadow-sm sm:px-10">
          <p class="text-sm font-bold uppercase text-slate-500">Decision procedure</p>
          <h1 class="mt-3 text-3xl font-bold text-slate-950">Make one final decision per application</h1>
          <p class="mt-5 text-base leading-7 text-slate-700">${escapeHtml(timingCopy)}</p>
          <p class="mt-4 text-base leading-7 text-slate-700">Your decision time is recorded for research analysis but is never displayed. On some applications, a short question will ask which information directly contributed to your choice.</p>
          ${instructionFooter(3, "Check understanding")}
        </div>`);
    }
    document.getElementById("instructionNext").addEventListener("click", () => {
      if (step < 3) renderInstruction(step + 1);
      else renderComprehension();
    }, { once: true });
  }

  function selectQuestion(id, prompt, options) {
    return `
      <label class="block border-b border-slate-200 py-5 last:border-b-0">
        <span class="block font-semibold text-slate-900">${escapeHtml(prompt)}</span>
        <select id="${escapeHtml(id)}" class="mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300">
          <option value="">Select an answer</option>
          ${options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("")}
        </select>
      </label>`;
  }

  function renderComprehension(feedback = "") {
    const timingOptions = state.conditionKey === "no_pressure"
      ? [["correct", "There is no deadline"], ["wrong", "Every application has a 15-second deadline"], ["wrong2", "Only the first 10 applications have a deadline"]]
      : [["correct", "30 seconds for applications 1-10, then 15 seconds"], ["wrong", "15 seconds for every application"], ["wrong2", "30 seconds for every application"]];
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-8 shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">Understanding check</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">Before the task begins</h1>
        ${feedback ? `<div role="alert" class="mt-5 border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-6 text-amber-950">${escapeHtml(feedback)}</div>` : ""}
        <div class="mt-5 border-y border-slate-200">
          ${selectQuestion("checkMeaning", "On an AI trial, what does Override mean?", [["correct", "Choose the opposite final decision from the AI recommendation"], ["wrong", "Accept the AI recommendation"], ["wrong2", "Skip the application"]])}
          ${selectQuestion("checkAccuracy", "Can the AI recommendation be wrong?", [["correct", "Yes"], ["wrong", "No"]])}
          ${selectQuestion("checkTiming", "Which timing rule applies to you?", timingOptions)}
        </div>
        <div id="comprehensionError" class="mt-4 min-h-6 text-sm font-semibold text-red-700" aria-live="polite"></div>
        <div class="mt-5 flex justify-end"><button id="checkSubmit" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300">Submit answers</button></div>
      </div>`);
    document.getElementById("checkSubmit").addEventListener("click", () => {
      const answers = {
        agree_override_meaning: document.getElementById("checkMeaning").value,
        ai_can_be_wrong: document.getElementById("checkAccuracy").value,
        timing_rule: document.getElementById("checkTiming").value
      };
      if (Object.values(answers).some((value) => !value)) {
        document.getElementById("comprehensionError").textContent = "Please answer all three questions.";
        return;
      }
      const passed = Object.values(answers).every((value) => value === "correct");
      state.comprehensionAttempts.push({
        attempt_number: state.comprehensionAttempts.length + 1,
        answers,
        passed,
        timestamp_iso: new Date().toISOString()
      });
      checkpoint("comprehension_attempt_saved");
      if (!passed) {
        renderComprehension("Please review: Override means choosing the opposite of the AI recommendation; the AI can be wrong; and the timing rule shown in the instructions applies throughout each phase.");
        return;
      }
      state.comprehensionPassedAtIso = new Date().toISOString();
      checkpoint("comprehension_passed");
      renderPreSurvey();
    });
  }

  function likertQuestion(name, prompt, left, right) {
    return `
      <fieldset class="border-b border-slate-200 py-5 last:border-b-0">
        <legend class="font-semibold text-slate-900">${escapeHtml(prompt)}</legend>
        <div class="mt-3 grid grid-cols-5 gap-2">
          ${[1, 2, 3, 4, 5].map((value) => `<label class="flex min-h-12 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white text-sm font-bold has-[:checked]:border-slate-950 has-[:checked]:bg-slate-950 has-[:checked]:text-white"><input class="sr-only" type="radio" name="${escapeHtml(name)}" value="${value}">${value}</label>`).join("")}
        </div>
        <div class="mt-2 flex justify-between text-xs text-slate-500"><span>${escapeHtml(left)}</span><span>${escapeHtml(right)}</span></div>
      </fieldset>`;
  }

  function checkedRadio(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function renderPreSurvey() {
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-8 shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">Before the task</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">A few short questions</h1>
        <div class="mt-5 border-y border-slate-200">
          ${likertQuestion("pre_ai_familiarity", "How familiar are you with AI decision-support systems?", "Not at all", "Very familiar")}
          ${likertQuestion("pre_ai_literacy", "How confident are you in judging when an AI recommendation may be unreliable?", "Not confident", "Very confident")}
        </div>
        <div id="preError" class="mt-4 min-h-6 text-sm font-semibold text-red-700" aria-live="polite"></div>
        <div class="mt-5 flex justify-end"><button id="beginTask" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300">Begin task</button></div>
      </div>`);
    document.getElementById("beginTask").addEventListener("click", async () => {
      const survey = {
        pre_ai_familiarity: checkedRadio("pre_ai_familiarity"),
        pre_ai_literacy: checkedRadio("pre_ai_literacy")
      };
      if (Object.values(survey).some((value) => !value)) {
        document.getElementById("preError").textContent = "Please answer both questions.";
        return;
      }
      const button = document.getElementById("beginTask");
      button.disabled = true;
      try {
        await ensureBackendSession();
      } catch {
        renderCollectionUnavailable();
        return;
      }
      if (state.backendSessionResumed) {
        renderInterrupted();
        return;
      }
      state.preSurvey = { ...survey, completed_timestamp_iso: new Date().toISOString() };
      saveQuestionnaire("pre", {
        ...state.preSurvey,
        comprehension_attempts_json: JSON.stringify(state.comprehensionAttempts),
        comprehension_attempt_count: state.comprehensionAttempts.length,
        comprehension_final_passed: true,
        comprehension_passed_timestamp_iso: state.comprehensionPassedAtIso
      });
      state.trialOrder = buildTrialOrder();
      state.experimentStarted = true;
      state.currentTrialIndex = 0;
      checkpoint("experiment_started");
      await showTrialWithTransition();
    }, { once: true });
  }

  function currentTrial() {
    return state.trialOrder[state.currentTrialIndex] || null;
  }

  function trialDataItem(label, value, first = false) {
    return `<div class="${first ? "border-t" : ""} grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-slate-200 py-4"><dt class="text-sm font-semibold text-slate-600">${escapeHtml(label)}</dt><dd class="text-lg font-bold tabular-nums text-slate-950">${escapeHtml(value)}</dd></div>`;
  }

  function trialMarkup(trial) {
    const deadlineMs = deadlineFor(trial);
    const timer = deadlineMs === null ? "" : `
      <div id="countdownContainer" class="flex h-11 min-w-36 items-center justify-center border border-slate-300 bg-white px-4 text-sm font-bold tabular-nums text-slate-800" aria-live="off">
        <span id="countdownValue">${Math.ceil(deadlineMs / 1000)}</span><span class="ml-1">s remaining</span>
      </div>`;
    const aiPanel = trial.trialType === "no_ai_baseline" ? "" : `
      <section class="border border-slate-300 bg-slate-100 p-5" aria-label="AI recommendation">
        <p class="text-xs font-bold uppercase text-slate-500">AI recommendation</p>
        <p class="mt-2 text-2xl font-bold text-slate-950">${escapeHtml(trial.aiRecommendation)}</p>
      </section>`;
    const additional = trial.askRetrospectiveReport ? `
      <section class="mt-5" aria-label="Additional AI Information">
        <h2 class="text-sm font-bold text-slate-900">Additional AI Information</h2>
        <div class="mt-2 grid gap-3">
          ${trial.cues.map((cue) => `<div class="border-l-4 border-slate-400 bg-white px-4 py-3"><p class="text-xs font-bold uppercase text-slate-500">${escapeHtml(cue.type)}</p><p class="mt-1 text-sm leading-6 text-slate-800">${escapeHtml(cue.text)}</p></div>`).join("")}
        </div>
      </section>` : "";
    const actions = trial.trialType === "no_ai_baseline"
      ? `${actionButton("Approve", "approve")}${actionButton("Reject", "reject", true)}`
      : `${actionButton("Agree", "agree")}${actionButton("Override", "override", true)}`;

    return `
      <main class="mx-auto min-h-screen max-w-6xl px-5 py-6 sm:py-8">
        <header class="flex min-h-12 items-center justify-between gap-4 border-b border-slate-300 pb-4">
          <p class="text-sm font-bold text-slate-700">Application ${state.currentTrialIndex + 1} of ${TOTAL_TRIALS}</p>
          ${timer}
        </header>
        <div class="grid gap-8 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
          <section aria-labelledby="applicationHeading">
            <h1 id="applicationHeading" class="text-xl font-bold text-slate-950">Applicant information</h1>
            <dl class="mt-4">
              ${trialDataItem("Requested loan", formatCurrency(trial.loanAmount), true)}
              ${trialDataItem("Annual income", formatCurrency(trial.income))}
              ${trialDataItem("Repayment term", `${trial.repaymentTermYears} years`)}
              ${trialDataItem("Credit score", String(trial.creditScore))}
              ${trialDataItem("Savings", formatCurrency(trial.savings))}
            </dl>
            <p class="mt-4 text-sm leading-6 text-slate-600">Credit scores range from 0 to 1000, with higher scores indicating lower estimated credit risk.</p>
          </section>
          <section class="border-l-0 border-slate-300 lg:border-l lg:pl-8" aria-labelledby="decisionHeading">
            <h1 id="decisionHeading" class="text-xl font-bold text-slate-950">Your decision</h1>
            <div class="mt-4">${aiPanel}${additional}</div>
            <div class="mt-7 flex gap-3" id="decisionActions">${actions}</div>
          </section>
        </div>
      </main>`;
  }

  async function showTrialWithTransition() {
    if (transitionInProgress) return;
    const trial = currentTrial();
    if (!trial) {
      renderPostSurvey();
      return;
    }
    transitionInProgress = true;
    decisionLocked = true;
    app.inert = true;
    transitionOverlay.classList.add("is-dark");
    await wait(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : TRANSITION_HALF_MS);
    app.innerHTML = trialMarkup(trial);
    window.scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    transitionOverlay.classList.remove("is-dark");
    await wait(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : TRANSITION_HALF_MS);
    app.inert = false;
    transitionInProgress = false;
    decisionLocked = false;
    bindDecisionButtons();
    startActiveTrialClock(trial);
  }

  function startActiveTrialClock(trial) {
    const runtime = {
      trialId: trial.trialId,
      onsetTimestampIso: "",
      deadlineTimestampIso: "",
      deadlineExceededTimestampIso: "",
      deadlineDetectedTimestampIso: "",
      timeoutModalAckTimestampIso: "",
      timeoutModalAckElapsedMs: null
    };
    state.activeTrialState = runtime;
    activeClock = window.createTrialClock({
      deadlineMs: deadlineFor(trial),
      onTick: ({ remainingMs }) => {
        const value = document.getElementById("countdownValue");
        if (value) value.textContent = String(Math.max(0, Math.ceil(remainingMs / 1000)));
      },
      onDeadline: (details) => handleDeadlineExceeded(trial, details)
    });
    const onset = activeClock.start();
    runtime.onsetTimestampIso = onset.trialOnsetTimestampIso;
    runtime.deadlineTimestampIso = onset.deadlineTimestampIso;
    checkpoint("trial_started");
  }

  function bindDecisionButtons() {
    document.querySelectorAll("[data-decision]").forEach((button) => {
      button.addEventListener("click", () => handleDecision(button.dataset.decision), { once: true });
    });
  }

  function disableDecisionButtons() {
    document.querySelectorAll("[data-decision]").forEach((button) => {
      button.disabled = true;
    });
  }

  function baseTrialRecord(trial) {
    const cueJson = trial.cues.map((cue) => ({
      code: cue.code,
      type: cue.type,
      category: cue.category,
      text: cue.text,
      level: cue.level ?? "",
      display_position: cue.displayPosition
    }));
    return {
      record_type: "trial",
      ...recordIdentity(),
      trial_order: state.currentTrialIndex + 1,
      trial_id: trial.trialId,
      applicant_id: trial.applicantId,
      assigned_condition: trial.assignedCondition,
      trial_type: trial.trialType,
      trial_phase: trial.trialPhase,
      presentation_seed: state.presentationSeed,
      cue_display_order_seed: trial.cueDisplayOrderSeed,
      actual_cues_json: JSON.stringify(cueJson),
      cue_1_code: trial.cues[0]?.code || "",
      cue_1_type: trial.cues[0]?.type || "",
      cue_1_text: trial.cues[0]?.text || "",
      cue_2_code: trial.cues[1]?.code || "",
      cue_2_type: trial.cues[1]?.type || "",
      cue_2_text: trial.cues[1]?.text || "",
      ai_recommendation: trial.trialType === "no_ai_baseline" ? "" : trial.aiRecommendation.toLowerCase(),
      ai_matches_policy: trial.trialType === "no_ai_baseline" ? "" : Boolean(trial.aiMatchesPolicy),
      policy_ground_truth: trial.policyGroundTruth.toLowerCase(),
      ground_truth_status: trial.groundTruthStatus,
      observed_no_ai_approve_rate: "",
      stimulus_type: trial.stimulusType,
      difficulty_band: trial.difficultyBand,
      is_obvious_case: Boolean(trial.isObviousCase),
      intended_obvious_direction: trial.intendedObviousDirection.toLowerCase(),
      obvious_response_matches_direction: "",
      trial_deadline_ms: deadlineFor(trial),
      deadline_policy: deadlinePolicyFor(trial),
      trial_onset_timestamp_iso: state.activeTrialState?.onsetTimestampIso || "",
      deadline_timestamp_iso: state.activeTrialState?.deadlineTimestampIso || "",
      deadline_exceeded: false,
      timed_out: false,
      decision_completed: false,
      decision_completed_on_time: false,
      deadline_exceeded_timestamp_iso: "",
      deadline_detected_timestamp_iso: "",
      timeout_modal_ack_timestamp_iso: "",
      final_choice_timestamp_iso: "",
      decision_rt_total_ms: "",
      decision_rt_on_time_ms: "",
      decision_rt_untimed_ms: "",
      decision_rt_ms: "",
      overtime_ms: "",
      post_timeout_decision_ms: "",
      page_hidden_during_trial: false,
      page_hidden_total_ms: 0,
      visibility_events_json: "[]",
      user_choice: "",
      user_final_decision: "",
      final_decision: "",
      user_agreed_with_ai: "",
      agree_override: "",
      timeout_reason_codes: "",
      timeout_reason_other_text: "",
      timeout_reason_timestamp_iso: "",
      reported_applicant_information: "",
      reported_warranted_cue: "",
      reported_unwarranted_cue: "",
      reported_no_additional_ai_information: "",
      reported_other: "",
      reported_other_text: "",
      reported_ai_recommendation: "",
      retrospective_timestamp_iso: "",
      report_schema_version: REPORT_SCHEMA_VERSION,
      report_completed: false,
      record_status: "active",
      backend_idempotency_key: trialRecordKey(trial.trialId)
    };
  }

  function handleDeadlineExceeded(trial, details) {
    if (decisionLocked || state.pendingResponse?.decision_completed === true) {
      return;
    }
    decisionLocked = true;
    disableDecisionButtons();
    const countdown = document.getElementById("countdownContainer");
    if (countdown) countdown.remove();
    state.activeTrialState.deadlineExceededTimestampIso = details.deadlineTimestampIso;
    state.activeTrialState.deadlineDetectedTimestampIso = details.detectedTimestampIso;
    const visibility = visibilitySummary(activeClock.snapshot().visibilityEvents);
    const response = {
      ...baseTrialRecord(trial),
      deadline_exceeded: true,
      timed_out: true,
      deadline_exceeded_timestamp_iso: details.deadlineTimestampIso,
      deadline_detected_timestamp_iso: details.detectedTimestampIso,
      decision_completed: false,
      decision_completed_on_time: false,
      page_hidden_during_trial: visibility.wasHidden,
      page_hidden_total_ms: visibility.hiddenTotalMs,
      visibility_events_json: JSON.stringify(visibility.events),
      record_status: "deadline_exceeded_incomplete"
    };
    upsertResponse(response, "deadline_exceeded_saved");
    renderDeadlineModal();
  }

  function renderDeadlineModal() {
    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="presentation">
        <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="deadlineTitle">
          <p class="text-sm font-bold uppercase text-slate-500">Time limit reached</p>
          <h2 id="deadlineTitle" class="mt-2 text-2xl font-bold text-slate-950">Time is up for this application.</h2>
          <p class="mt-4 leading-7 text-slate-700">Your response has been marked as exceeding the deadline. You still need to complete the same decision.</p>
          <div class="mt-6 flex justify-end"><button id="deadlineAck" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-slate-300">Complete this decision</button></div>
        </section>
      </div>`;
    document.getElementById("deadlineAck").focus();
    document.getElementById("deadlineAck").addEventListener("click", () => {
      modalRoot.innerHTML = "";
      const now = new Date().toISOString();
      state.activeTrialState.timeoutModalAckTimestampIso = now;
      state.activeTrialState.timeoutModalAckElapsedMs = activeClock.elapsedMs();
      const pending = state.pendingResponse;
      pending.timeout_modal_ack_timestamp_iso = now;
      pending.record_status = "overtime_decision";
      upsertResponse(pending, "timeout_modal_acknowledged");
      document.querySelectorAll("[data-decision]").forEach((button) => {
        button.disabled = false;
        button.replaceWith(button.cloneNode(true));
      });
      decisionLocked = false;
      bindDecisionButtons();
      document.querySelector("[data-decision]")?.focus();
    }, { once: true });
  }

  function resolveChoice(trial, userChoice) {
    if (trial.trialType === "no_ai_baseline") {
      return {
        finalDecision: userChoice,
        agreed: "",
        agreeOverride: ""
      };
    }
    const aiDecision = trial.aiRecommendation.toLowerCase();
    const finalDecision = userChoice === "agree"
      ? aiDecision
      : aiDecision === "approve" ? "reject" : "approve";
    return {
      finalDecision,
      agreed: userChoice === "agree",
      agreeOverride: userChoice
    };
  }

  function visibilitySummary(events) {
    const normalized = Array.isArray(events) ? events : [];
    return {
      events: normalized,
      wasHidden: normalized.some((event) => event.type === "hidden" || event.type === "hidden_active"),
      hiddenTotalMs: normalized.reduce((sum, event) => sum + Math.max(0, Number(event.hidden_duration_ms) || 0), 0)
    };
  }

  function handleDecision(userChoice) {
    if (decisionLocked || transitionInProgress || !activeClock) return;
    const trial = currentTrial();
    const deadlineAttempt = activeClock.attemptOnTimeDecision();
    if (!deadlineAttempt.accepted && !activeClock.hasExceededDeadline()) {
      return;
    }
    if (!deadlineAttempt.accepted && state.pendingResponse?.record_status === "deadline_exceeded_incomplete") {
      return;
    }
    decisionLocked = true;
    disableDecisionButtons();
    const countdown = document.getElementById("countdownContainer");
    if (countdown) countdown.remove();
    const clock = activeClock.stop();
    const choice = resolveChoice(trial, userChoice);
    const deadlineExceeded = activeClock.hasExceededDeadline();
    const response = state.pendingResponse || baseTrialRecord(trial);
    const visibility = visibilitySummary(clock.visibilityEvents);
    const finalTimestamp = new Date().toISOString();
    const postTimeoutDecisionMs = deadlineExceeded
      ? Math.max(0, clock.elapsedMs - Number(state.activeTrialState.timeoutModalAckElapsedMs || clock.elapsedMs))
      : "";
    Object.assign(response, {
      trial_onset_timestamp_iso: clock.trialOnsetTimestampIso,
      deadline_timestamp_iso: clock.deadlineTimestampIso,
      deadline_exceeded: deadlineExceeded,
      timed_out: deadlineExceeded,
      decision_completed: true,
      decision_completed_on_time: !deadlineExceeded,
      deadline_exceeded_timestamp_iso: clock.deadlineExceededTimestampIso,
      deadline_detected_timestamp_iso: clock.deadlineDetectedTimestampIso,
      timeout_modal_ack_timestamp_iso: state.activeTrialState.timeoutModalAckTimestampIso,
      final_choice_timestamp_iso: finalTimestamp,
      decision_rt_total_ms: clock.elapsedMs,
      decision_rt_on_time_ms: !deadlineExceeded && deadlineFor(trial) !== null ? clock.elapsedMs : "",
      decision_rt_untimed_ms: deadlineFor(trial) === null ? clock.elapsedMs : "",
      decision_rt_ms: deadlineExceeded ? "" : clock.elapsedMs,
      overtime_ms: deadlineExceeded ? clock.overtimeMs : 0,
      post_timeout_decision_ms: postTimeoutDecisionMs,
      page_hidden_during_trial: visibility.wasHidden,
      page_hidden_total_ms: visibility.hiddenTotalMs,
      visibility_events_json: JSON.stringify(visibility.events),
      user_choice: userChoice,
      user_final_decision: choice.finalDecision,
      final_decision: choice.finalDecision,
      user_agreed_with_ai: choice.agreed,
      agree_override: choice.agreeOverride,
      obvious_response_matches_direction: trial.isObviousCase
        ? choice.finalDecision === trial.intendedObviousDirection.toLowerCase()
        : "",
      record_status: deadlineExceeded
        ? "decision_saved_reason_pending"
        : trial.askRetrospectiveReport ? "retrospective_pending" : "complete",
      report_completed: !deadlineExceeded && !trial.askRetrospectiveReport
    });
    upsertResponse(response, "decision_saved");
    if (deadlineExceeded) {
      renderTimeoutReason(trial);
    } else if (trial.askRetrospectiveReport) {
      renderRetrospective(trial);
    } else {
      advanceAfterCompletedTrial();
    }
  }

  function modalCheckbox(code, label) {
    return `<label class="checkbox-row"><input type="checkbox" value="${escapeHtml(code)}" class="h-5 w-5 shrink-0 rounded border-slate-400 text-slate-950 focus:ring-slate-400"><span>${escapeHtml(label)}</span></label>`;
  }

  function renderTimeoutReason(trial) {
    modalSubmissionLocked = false;
    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal-panel max-w-xl" role="dialog" aria-modal="true" aria-labelledby="timeoutReasonTitle">
          <p class="text-sm font-bold uppercase text-slate-500">Deadline follow-up</p>
          <h2 id="timeoutReasonTitle" class="mt-2 text-2xl font-bold text-slate-950">What contributed to needing more time?</h2>
          <p class="mt-3 text-sm leading-6 text-slate-600">Select all that apply.</p>
          <div id="timeoutReasons" class="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            ${modalCheckbox("review_applicant", "I needed more time to review the applicant information")}
            ${trial.trialType === "no_ai_baseline" ? "" : modalCheckbox("review_ai", "I needed more time to review the AI information")}
            ${modalCheckbox("away_or_distracted", "I was briefly away or distracted")}
            ${modalCheckbox("technical_or_display_problem", "I experienced a technical or display problem")}
            ${modalCheckbox("other", "Other")}
          </div>
          <div id="timeoutOtherWrap" class="mt-4 hidden"><label class="text-sm font-semibold text-slate-800" for="timeoutOther">Short explanation (do not include names)</label><textarea id="timeoutOther" maxlength="250" rows="3" class="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"></textarea></div>
          <div id="timeoutReasonError" class="mt-3 min-h-6 text-sm font-semibold text-red-700" aria-live="polite"></div>
          <div class="mt-5 flex justify-end"><button id="timeoutReasonSubmit" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-slate-300">Continue</button></div>
        </section>
      </div>`;
    const options = Array.from(document.querySelectorAll("#timeoutReasons input"));
    options.forEach((option) => option.addEventListener("change", () => {
      document.getElementById("timeoutOtherWrap").classList.toggle("hidden", !options.find((item) => item.value === "other").checked);
    }));
    document.getElementById("timeoutReasonSubmit").addEventListener("click", () => {
      if (modalSubmissionLocked) return;
      const selected = options.filter((item) => item.checked).map((item) => item.value);
      const otherText = document.getElementById("timeoutOther").value.trim();
      if (selected.length === 0) {
        document.getElementById("timeoutReasonError").textContent = "Please select at least one option.";
        return;
      }
      if (selected.includes("other") && !otherText) {
        document.getElementById("timeoutReasonError").textContent = "Please add a short explanation for Other.";
        return;
      }
      modalSubmissionLocked = true;
      document.getElementById("timeoutReasonSubmit").disabled = true;
      const response = state.pendingResponse;
      response.timeout_reason_codes = JSON.stringify(selected);
      response.timeout_reason_other_text = otherText;
      response.timeout_reason_timestamp_iso = new Date().toISOString();
      response.record_status = trial.askRetrospectiveReport ? "retrospective_pending" : "complete";
      response.report_completed = !trial.askRetrospectiveReport;
      upsertResponse(response, "timeout_reason_saved");
      modalRoot.innerHTML = "";
      if (trial.askRetrospectiveReport) renderRetrospective(trial);
      else advanceAfterCompletedTrial();
    });
  }

  function renderRetrospective(trial) {
    modalSubmissionLocked = false;
    const cueOptions = trial.cues.map((cue) => modalCheckbox(cue.code, cue.type)).join("");
    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal-panel max-w-2xl" role="dialog" aria-modal="true" aria-labelledby="reportTitle">
          <p class="text-sm font-bold uppercase text-slate-500">Decision follow-up</p>
          <h2 id="reportTitle" class="mt-2 text-xl font-bold leading-8 text-slate-950">Which information did you rely on when making your final decision?</h2>
          <p class="mt-3 text-sm leading-6 text-slate-600">Select all information that directly contributed to your choice. Do not select information that you noticed but did not use.</p>
          <div id="reportOptions" class="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            ${modalCheckbox("applicant_information", "Applicant financial information")}
            ${cueOptions}
            ${modalCheckbox("no_additional_ai_information", "I did not use any Additional AI Information")}
            ${modalCheckbox("other", "Other")}
          </div>
          <div id="reportOtherWrap" class="mt-4 hidden"><label class="text-sm font-semibold text-slate-800" for="reportOther">Short explanation</label><textarea id="reportOther" maxlength="250" rows="3" class="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"></textarea></div>
          <div id="reportError" class="mt-3 min-h-6 text-sm font-semibold text-red-700" aria-live="polite"></div>
          <div class="mt-5 flex justify-end"><button id="reportSubmit" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-slate-300">Continue</button></div>
        </section>
      </div>`;
    const options = Array.from(document.querySelectorAll("#reportOptions input"));
    const noneOption = options.find((item) => item.value === "no_additional_ai_information");
    options.forEach((option) => option.addEventListener("change", () => {
      if (option.value === "no_additional_ai_information" && option.checked) {
        options.filter((item) => ["W1", "W2", "U1", "U2"].includes(item.value)).forEach((item) => { item.checked = false; });
      }
      if (["W1", "W2", "U1", "U2"].includes(option.value) && option.checked) {
        noneOption.checked = false;
      }
      document.getElementById("reportOtherWrap").classList.toggle("hidden", !options.find((item) => item.value === "other").checked);
    }));
    document.getElementById("reportSubmit").addEventListener("click", () => {
      if (modalSubmissionLocked) return;
      const selected = options.filter((item) => item.checked).map((item) => item.value);
      const otherText = document.getElementById("reportOther").value.trim();
      if (selected.length === 0) {
        document.getElementById("reportError").textContent = "Please select at least one option.";
        return;
      }
      if (selected.includes("other") && !otherText) {
        document.getElementById("reportError").textContent = "Please add a short explanation for Other.";
        return;
      }
      modalSubmissionLocked = true;
      document.getElementById("reportSubmit").disabled = true;
      const response = state.pendingResponse;
      response.reported_applicant_information = selected.includes("applicant_information");
      response.reported_warranted_cue = selected.find((value) => ["W1", "W2"].includes(value)) || "";
      response.reported_unwarranted_cue = selected.find((value) => ["U1", "U2"].includes(value)) || "";
      response.reported_no_additional_ai_information = selected.includes("no_additional_ai_information");
      response.reported_other = selected.includes("other");
      response.reported_other_text = otherText;
      response.reported_ai_recommendation = "";
      response.retrospective_timestamp_iso = new Date().toISOString();
      response.report_completed = true;
      response.record_status = "complete";
      upsertResponse(response, "retrospective_saved");
      modalRoot.innerHTML = "";
      advanceAfterCompletedTrial();
    });
  }

  function advanceAfterCompletedTrial() {
    activeClock = null;
    state.activeTrialState = null;
    state.pendingResponse = null;
    state.currentTrialIndex += 1;
    checkpoint("trial_completed");
    if (state.currentTrialIndex === 10 && ENABLE_PHASE1_FEEDBACK && !state.phase1FeedbackAcknowledgedAtIso) {
      renderPhase1Feedback();
      return;
    }
    if (state.currentTrialIndex === 20 && !state.phase2TransitionAcknowledgedAtIso) {
      renderPhase2Transition();
      return;
    }
    if (state.currentTrialIndex >= TOTAL_TRIALS) {
      renderPostSurvey();
      return;
    }
    showTrialWithTransition();
  }

  function renderPhase1Feedback() {
    state.phase1FeedbackShownAtIso = new Date().toISOString();
    state.phase1PolicyMatchesN = state.responses.slice(0, 10).filter((response) => response.user_final_decision === response.policy_ground_truth).length;
    checkpoint("phase1_feedback_shown");
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-9 shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">Phase 1 complete</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">${state.phase1PolicyMatchesN} of 10 decisions matched the fictional policy</h1>
        <p class="mt-5 max-w-2xl leading-7 text-slate-700">This feedback refers only to the fixed fictional policy used in this study. It is not an assessment of real lending decisions.</p>
        <p class="mt-3 max-w-2xl leading-7 text-slate-700">The next phase includes an AI recommendation. The AI can be wrong, so continue to assess each application.</p>
        <div class="mt-7 flex justify-end"><button id="phase1Continue" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-slate-300">Continue</button></div>
      </div>`);
    document.getElementById("phase1Continue").addEventListener("click", () => {
      state.phase1FeedbackAcknowledgedAtIso = new Date().toISOString();
      checkpoint("phase1_feedback_acknowledged");
      showTrialWithTransition();
    }, { once: true });
  }

  function renderPhase2Transition() {
    state.phase2TransitionShownAtIso = new Date().toISOString();
    checkpoint("phase2_transition_shown");
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-9 shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">Final phase</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">Additional AI Information</h1>
        <p class="mt-5 max-w-2xl leading-7 text-slate-700">The remaining applications show two Additional AI Information items alongside the AI recommendation. Use whichever information you judge relevant.</p>
        <p class="mt-3 max-w-2xl leading-7 text-slate-700">After each decision, report only the information that directly contributed to your choice.</p>
        <div class="mt-7 flex justify-end"><button id="phase2Continue" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-slate-300">Continue</button></div>
      </div>`);
    document.getElementById("phase2Continue").addEventListener("click", () => {
      state.phase2TransitionAcknowledgedAtIso = new Date().toISOString();
      checkpoint("phase2_transition_acknowledged");
      showTrialWithTransition();
    }, { once: true });
  }

  function qualitySummary() {
    const obvious = state.responses.filter((response) => response.is_obvious_case === true);
    const errors = obvious.filter((response) => response.obvious_response_matches_direction === false).length;
    return {
      obvious_cases_seen_n: obvious.length,
      obvious_case_errors_n: errors,
      obvious_quality_flag: errors >= 3,
      obvious_quality_rule: "flag_if_3_or_more_errors_no_midstudy_ejection"
    };
  }

  function renderPostSurvey() {
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-8 shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">After the task</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">Final questions</h1>
        <div class="mt-5 border-y border-slate-200">
          ${likertQuestion("post_ai_trust", "How much did you trust the AI recommendations overall?", "Not at all", "Very much")}
          ${likertQuestion("post_time_pressure", "How much time pressure did you feel?", "None", "Very strong")}
          ${likertQuestion("post_task_difficulty", "How difficult was the decision task?", "Very easy", "Very difficult")}
        </div>
        <div id="postError" class="mt-4 min-h-6 text-sm font-semibold text-red-700" aria-live="polite"></div>
        <div class="mt-5 flex justify-end"><button id="finishTask" type="button" class="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-slate-300">Finish</button></div>
      </div>`);
    document.getElementById("finishTask").addEventListener("click", finishExperiment, { once: true });
  }

  async function finishExperiment() {
    const survey = {
      post_ai_trust: checkedRadio("post_ai_trust"),
      post_time_pressure: checkedRadio("post_time_pressure"),
      post_task_difficulty: checkedRadio("post_task_difficulty")
    };
    if (Object.values(survey).some((value) => !value)) {
      document.getElementById("postError").textContent = "Please answer all three questions.";
      return;
    }
    state.postSurvey = { ...survey, completed_timestamp_iso: new Date().toISOString() };
    const quality = qualitySummary();
    saveQuestionnaire("post", {
      ...state.postSurvey,
      ...quality,
      phase1_feedback_enabled: ENABLE_PHASE1_FEEDBACK,
      phase1_feedback_shown_timestamp_iso: state.phase1FeedbackShownAtIso,
      phase1_feedback_acknowledged_timestamp_iso: state.phase1FeedbackAcknowledgedAtIso,
      phase1_policy_matches_n: state.phase1PolicyMatchesN,
      phase2_transition_shown_timestamp_iso: state.phase2TransitionShownAtIso,
      phase2_transition_acknowledged_timestamp_iso: state.phase2TransitionAcknowledgedAtIso
    });
    state.completionStarted = true;
    checkpoint("completion_started");
    downloadCsvBackup();
    renderCompletionPending();

    if (!backendRequired) {
      state.completionConfirmed = true;
      checkpoint("local_completion_confirmed");
      persistence.clear();
      renderComplete();
      return;
    }

    try {
      await persistence.flushRetryQueue({ force: true });
      if (!persistence.allAcknowledged()) {
        throw new Error("Records are still awaiting confirmation.");
      }
      const result = await backendClient.completeSession({
        experiment_session_id: state.experimentSessionId,
        session_write_token: state.sessionWriteToken
      });
      if (result.completed !== true || !String(result.completion_url || "").startsWith("https://app.prolific.com/submissions/complete")) {
        throw new Error("Completion could not be confirmed.");
      }
      state.completionConfirmed = true;
      checkpoint("server_completion_confirmed");
      persistence.clear();
      renderComplete();
      window.setTimeout(() => window.location.assign(result.completion_url), 800);
    } catch {
      state.completionError = "collection_confirmation_failed";
      checkpoint("completion_confirmation_failed");
      renderCollectionUnavailable();
    }
  }

  function renderCompletionPending() {
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <h1 class="text-3xl font-bold text-slate-950">Finishing the session</h1>
        <p class="mt-4 text-base leading-7 text-slate-700">Please keep this page open while your responses are finalized.</p>
      </div>`);
  }

  function renderComplete() {
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">Session complete</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">Thank you for taking part.</h1>
        <p class="mt-4 text-base leading-7 text-slate-700">Your responses have been finalized. You may now close this page.</p>
      </div>`);
  }

  function renderCollectionUnavailable() {
    renderPage(`
      <div class="border-t-4 border-slate-900 bg-white px-6 py-10 shadow-sm sm:px-10">
        <p class="text-sm font-bold uppercase text-slate-500">Researcher assistance required</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-950">The session cannot continue.</h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-slate-700">Please keep this page open and ask the researcher for assistance.</p>
      </div>`);
  }

  function csvValue(value) {
    if (value === null || value === undefined) return "";
    return String(value);
  }

  function csvEscape(value) {
    const string = csvValue(value);
    return /[",\r\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
  }

  const CSV_FIELDS = [
    "participant_id", "study_id", "session_id", "condition", "condition_key", "counterbalance_list",
    "counterbalance_list_source", "trial_order", "trial_id", "applicant_id", "assigned_condition", "trial_type",
    "trial_phase", "dataset_version", "stimulus_manifest_version", "stimulus_manifest_hash", "timing_policy_version",
    "ui_version", "data_collection_mode", "presentation_seed", "cue_display_order_seed", "actual_cues_json", "cue_1_code",
    "cue_1_type", "cue_1_text", "cue_2_code", "cue_2_type", "cue_2_text", "ai_recommendation", "ai_matches_policy",
    "policy_ground_truth", "ground_truth_status", "observed_no_ai_approve_rate", "stimulus_type", "difficulty_band",
    "is_obvious_case", "intended_obvious_direction", "obvious_response_matches_direction", "trial_deadline_ms",
    "deadline_policy", "trial_onset_timestamp_iso", "deadline_timestamp_iso", "deadline_exceeded", "timed_out",
    "decision_completed", "decision_completed_on_time", "deadline_exceeded_timestamp_iso", "deadline_detected_timestamp_iso",
    "timeout_modal_ack_timestamp_iso", "final_choice_timestamp_iso", "decision_rt_total_ms", "decision_rt_on_time_ms",
    "decision_rt_untimed_ms", "decision_rt_ms", "overtime_ms", "post_timeout_decision_ms", "page_hidden_during_trial",
    "page_hidden_total_ms", "visibility_events_json", "user_choice",
    "user_final_decision", "final_decision", "user_agreed_with_ai", "agree_override", "timeout_reason_codes",
    "timeout_reason_other_text", "timeout_reason_timestamp_iso", "reported_applicant_information", "reported_warranted_cue",
    "reported_unwarranted_cue", "reported_no_additional_ai_information", "reported_other", "reported_other_text",
    "reported_ai_recommendation", "retrospective_timestamp_iso", "report_schema_version", "report_completed", "record_status",
    "pre_ai_familiarity", "pre_ai_literacy", "comprehension_attempt_count", "comprehension_final_passed",
    "comprehension_attempts_json", "post_ai_trust", "post_time_pressure", "post_task_difficulty",
    "phase1_feedback_enabled", "phase1_feedback_shown_timestamp_iso", "phase1_feedback_acknowledged_timestamp_iso",
    "phase1_policy_matches_n", "phase2_transition_shown_timestamp_iso", "phase2_transition_acknowledged_timestamp_iso",
    "obvious_cases_seen_n", "obvious_case_errors_n", "obvious_quality_flag", "obvious_quality_rule"
  ];

  function exportRows() {
    const quality = qualitySummary();
    return state.responses.map((response) => ({
      ...response,
      pre_ai_familiarity: state.preSurvey?.pre_ai_familiarity || "",
      pre_ai_literacy: state.preSurvey?.pre_ai_literacy || "",
      comprehension_attempt_count: state.comprehensionAttempts.length,
      comprehension_final_passed: Boolean(state.comprehensionPassedAtIso),
      comprehension_attempts_json: JSON.stringify(state.comprehensionAttempts),
      post_ai_trust: state.postSurvey?.post_ai_trust || "",
      post_time_pressure: state.postSurvey?.post_time_pressure || "",
      post_task_difficulty: state.postSurvey?.post_task_difficulty || "",
      phase1_feedback_enabled: ENABLE_PHASE1_FEEDBACK,
      phase1_feedback_shown_timestamp_iso: state.phase1FeedbackShownAtIso,
      phase1_feedback_acknowledged_timestamp_iso: state.phase1FeedbackAcknowledgedAtIso,
      phase1_policy_matches_n: state.phase1PolicyMatchesN ?? "",
      phase2_transition_shown_timestamp_iso: state.phase2TransitionShownAtIso,
      phase2_transition_acknowledged_timestamp_iso: state.phase2TransitionAcknowledgedAtIso,
      ...quality
    }));
  }

  function downloadCsvBackup() {
    const rows = exportRows();
    const csv = [
      CSV_FIELDS.map(csvEscape).join(","),
      ...rows.map((row) => CSV_FIELDS.map((field) => csvEscape(row[field])).join(","))
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = `ai-loan-decision-${state.clientInstanceId}-${new Date().toISOString().replaceAll(":", "-")}.csv`;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 1000);
  }

  async function initialize() {
    window.addEventListener("pagehide", () => {
      checkpoint("page_exit");
      persistence.sendBeacon();
    });
    window.addEventListener("beforeunload", () => {
      checkpoint("before_unload");
      persistence.sendBeacon();
    });

    if (restoredSession && restoredSession.completionConfirmed !== true) {
      Object.assign(state, restoredSession);
      renderInterrupted();
      return;
    }
    if (restoredSession?.completionConfirmed === true) {
      persistence.clear();
    }
    if (backendRequired) {
      renderPage(`
        <div class="border-t-4 border-slate-900 bg-white px-6 py-10 text-center sm:px-10">
          <h1 class="text-3xl font-bold text-slate-950">Preparing the session</h1>
          <p class="mt-4 text-base leading-7 text-slate-700">Please keep this page open.</p>
        </div>`);
      try {
        await ensureBackendSession();
      } catch {
        renderCollectionUnavailable();
        return;
      }
      if (state.backendSessionResumed) {
        renderInterrupted();
        return;
      }
    }
    renderInstruction(1);
  }

  window.__EXPERIMENT_TEST_API__ = Object.freeze({
    state,
    buildTrialOrder,
    conditionLabel,
    deadlineFor,
    exportRows,
    csvFields: CSV_FIELDS.slice(),
    manifestVersion: MANIFEST_VERSION,
    timingPolicyVersion: TIMING_POLICY_VERSION,
    reportSchemaVersion: REPORT_SCHEMA_VERSION
  });

  initialize().catch(() => renderCollectionUnavailable());
})();
