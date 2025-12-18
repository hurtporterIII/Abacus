const defaultState = {
  currentMode: "training",
  unlockedModes: new Set(["training"]),
  unlockedSpeedTiers: new Set(),
  currentSpeed: "slow",
  currentLessonId: null
};

let state = {
  ...defaultState,
  unlockedModes: new Set(defaultState.unlockedModes),
  unlockedSpeedTiers: new Set(defaultState.unlockedSpeedTiers)
};

function persistPlaceholder() {
  // Placeholder for future persistence (localStorage, IndexedDB, etc).
}

export function getState() {
  return {
    ...state,
    unlockedModes: new Set(state.unlockedModes),
    unlockedSpeedTiers: new Set(state.unlockedSpeedTiers)
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
  if (!state.unlockedSpeedTiers.has(tier) && state.unlockedSpeedTiers.size > 0) {
    return false;
  }
  state = { ...state, currentSpeed: tier };
  persistPlaceholder();
  return true;
}

export function setLesson(id) {
  state = { ...state, currentLessonId: id };
  persistPlaceholder();
}

export function resetState() {
  state = {
    ...defaultState,
    unlockedModes: new Set(defaultState.unlockedModes),
    unlockedSpeedTiers: new Set(defaultState.unlockedSpeedTiers)
  };
  persistPlaceholder();
}
