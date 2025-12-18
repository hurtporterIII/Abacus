const STORAGE_KEY = "abacus-progress-v1";

const defaultState = {
  currentMode: "training",
  currentTrack: "education",
  unlockedModes: new Set(["training"]),
  unlockedSpeedTiers: new Set(),
  currentSpeed: null,
  currentLessonId: null,
  completedLessons: new Set()
};

let state = hydrateState(defaultState);

export function getState() {
  return {
    ...state,
    currentTrack: state.currentTrack,
    unlockedModes: new Set(state.unlockedModes),
    unlockedSpeedTiers: new Set(state.unlockedSpeedTiers),
    completedLessons: new Set(state.completedLessons)
  };
}

export function setMode(mode) {
  if (!state.unlockedModes.has(mode)) {
    return false;
  }
  state = { ...state, currentMode: mode };
  return true;
}

export function setTrack(track) {
  if (typeof track !== "string") return false;
  state = { ...state, currentTrack: track };
  persistState();
  return true;
}

export function unlockMode(mode, { persist = true } = {}) {
  if (!state.unlockedModes.has(mode)) {
    state.unlockedModes.add(mode);
    if (persist) persistState();
  }
}

export function unlockSpeedTier(tier, { persist = true } = {}) {
  if (!state.unlockedSpeedTiers.has(tier)) {
    state.unlockedSpeedTiers.add(tier);
    if (!state.currentSpeed) {
      state = { ...state, currentSpeed: tier };
    }
    if (persist) persistState();
  }
}

export function setSpeed(tier) {
  if (!state.unlockedSpeedTiers.has(tier)) return false;
  state = { ...state, currentSpeed: tier };
  persistState();
  return true;
}

export function setLesson(id) {
  state = { ...state, currentLessonId: id };
  persistState();
}

export function markLessonComplete(id) {
  if (!id) return;
  state.completedLessons.add(id);
  persistState();
}

export function isLessonComplete(id) {
  return state.completedLessons.has(id);
}

export function resetState() {
  state = hydrateState(defaultState);
  persistState();
}

function persistState() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const payload = {
      unlockedModes: Array.from(state.unlockedModes),
      unlockedSpeedTiers: Array.from(state.unlockedSpeedTiers),
      completedLessons: Array.from(state.completedLessons),
      currentTrack: state.currentTrack
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("[state] persist failed; ignoring", err);
  }
}

function hydrateState(base) {
  const safeBase = {
    ...base,
    unlockedModes: new Set(base.unlockedModes),
    unlockedSpeedTiers: new Set(base.unlockedSpeedTiers),
    completedLessons: new Set(base.completedLessons)
  };

  if (typeof window === "undefined" || !window.localStorage) {
    return safeBase;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return safeBase;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return safeBase;

    const unlockedModes = mergeSet(
      safeBase.unlockedModes,
      Array.isArray(parsed.unlockedModes) ? parsed.unlockedModes : []
    );
    const unlockedSpeedTiers = mergeSet(
      safeBase.unlockedSpeedTiers,
      Array.isArray(parsed.unlockedSpeedTiers) ? parsed.unlockedSpeedTiers : []
    );
    const completedLessons = mergeSet(
      safeBase.completedLessons,
      Array.isArray(parsed.completedLessons) ? parsed.completedLessons : []
    );
    const currentTrack =
      typeof parsed.currentTrack === "string" ? parsed.currentTrack : safeBase.currentTrack;

    return {
      ...safeBase,
      unlockedModes,
      unlockedSpeedTiers,
      completedLessons,
      currentTrack
    };
  } catch (err) {
    console.warn("[state] hydrate failed; using defaults", err);
    return safeBase;
  }
}

function mergeSet(baseSet, incoming) {
  const next = new Set(baseSet);
  incoming.forEach((value) => {
    if (typeof value === "string") next.add(value);
  });
  return next;
}
