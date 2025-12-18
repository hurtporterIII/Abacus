import { Abacus } from "./abacus/abacus.js";
import {
  getState,
  setMode,
  unlockMode,
  unlockSpeedTier,
  setSpeed
} from "./gameState.js";
import { createTrainingMode } from "./modes/training.js";
import { createPracticeMode } from "./modes/practice.js";
import { createChallengeMode } from "./modes/challenge.js";

const modeLabel = document.getElementById("current-mode");
const objectiveLabel = document.getElementById("current-objective");
const overlayEl = document.getElementById("play-overlay");
const speedSelect = document.getElementById("speed");
const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

const abacus = new Abacus(document.getElementById("abacus-root"), { rods: 1 });

const ui = {
  setModeLabel: (label) => (modeLabel.textContent = label),
  setObjective: (text) => (objectiveLabel.textContent = text),
  setOverlayMessage: (message) => {
    overlayEl.textContent = message || "";
  },
  clearOverlay: () => {
    overlayEl.textContent = "";
  }
};

function handleTrainingComplete() {
  unlockMode("practice");
  unlockMode("challenge");
  unlockSpeedTier("slow");
  updateUIState();
}

const modes = {
  training: createTrainingMode({ abacus, ui, onComplete: handleTrainingComplete }),
  practice: createPracticeMode({ abacus, ui }),
  challenge: createChallengeMode({ ui })
};

let activeMode = null;

function init() {
  wireControls();
  updateUIState();
  startMode(getState().currentMode);
}

function wireControls() {
  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchMode(btn.dataset.mode));
  });
  speedSelect.addEventListener("change", (event) => {
    const tier = event.target.value;
    setSpeed(tier);
  });
}

function switchMode(modeName) {
  const state = getState();
  if (!state.unlockedModes.has(modeName)) {
    return;
  }
  if (!setMode(modeName)) return;
  if (activeMode?.stop) activeMode.stop();
  activeMode = modes[modeName];
  activeMode?.start?.();
  ui.setModeLabel(capitalize(modeName));
  updateUIState();
}

function startMode(modeName) {
  activeMode = modes[modeName];
  activeMode?.start?.();
  ui.setModeLabel(capitalize(modeName));
  updateUIState();
}

function updateUIState() {
  const state = getState();
  modeButtons.forEach((btn) => {
    const modeName = btn.dataset.mode;
    const unlocked = state.unlockedModes.has(modeName);
    btn.disabled = !unlocked;
    btn.classList.toggle("active", state.currentMode === modeName);
  });
  speedSelect.disabled = state.unlockedSpeedTiers.size === 0;
  if (state.currentSpeed) {
    speedSelect.value = state.currentSpeed;
  }
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Dev helpers to unlock other modes or speeds via the console.
window.abacusApp = {
  unlockAll: () => {
    unlockMode("practice");
    unlockMode("challenge");
    unlockSpeedTier("slow");
    updateUIState();
  },
  abacus,
  state: getState
};

init();
