const defaultState = {
  currentMode: "training",
  unlockedModes: new Set(["training"]),
  unlockedSpeedTiers: new Set(),
  currentSpeed: null,
  currentLessonId: null,
  completedLessons: new Set()
};

let state = {
  ...defaultState,
  unlockedModes: new Set(defaultState.unlockedModes),
  unlockedSpeedTiers: new Set(defaultState.unlockedSpeedTiers),
  completedLessons: new Set(defaultState.completedLessons)
};

function persistPlaceholder() {
  // Placeholder for future persistence (localStorage, IndexedDB, etc).
}

export function getState() {
  return {
    ...state,
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
  persistPlaceholder();
  return true;
}

export function unlockMode(mode) {
  if (!state.unlockedModes.has(mode)) {
    state.unlockedModes.add(mode);
    persistPlaceholder();
  }
}

export function unlockSpeedTier(tier) {
  if (!state.unlockedSpeedTiers.has(tier)) {
    state.unlockedSpeedTiers.add(tier);
    if (!state.currentSpeed) {
      state = { ...state, currentSpeed: tier };
    }
    persistPlaceholder();
  }
}

export function setSpeed(tier) {
  if (!state.unlockedSpeedTiers.has(tier)) return false;
  state = { ...state, currentSpeed: tier };
  persistPlaceholder();
  return true;
}

export function setLesson(id) {
  state = { ...state, currentLessonId: id };
  persistPlaceholder();
}

export function markLessonComplete(id) {
  if (!id) return;
  state.completedLessons.add(id);
  persistPlaceholder();
}

export function isLessonComplete(id) {
  return state.completedLessons.has(id);
}

export function resetState() {
  state = {
    ...defaultState,
    unlockedModes: new Set(defaultState.unlockedModes),
    unlockedSpeedTiers: new Set(defaultState.unlockedSpeedTiers),
    completedLessons: new Set(defaultState.completedLessons)
  };
  persistPlaceholder();
}
