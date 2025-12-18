import { markLessonComplete, setLesson } from "../gameState.js";

const COUNTING_LESSON = {
  id: "training-counting-1",
  mode: "training",
  rods: 1,
  upperBeadDisabled: true,
  lowerBeads: 9,
  sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9]
};

export function createTrainingMode({
  abacus,
  ui,
  onLessonComplete = () => {},
  baseAbacusConfig
}) {
  let stepIndex = 0;
  let unsubscribe = null;

  function updateObjective() {
    const target = COUNTING_LESSON.sequence[stepIndex];
    if (typeof target === "number") {
      ui.setObjective(`Set the abacus to: ${target}`);
    }
  }

  function handleChange(value) {
    const target = COUNTING_LESSON.sequence[stepIndex];
    if (target === undefined) return;
    console.info(`[training-counting] move logged: value=${value}, expected=${target}`);
    if (value !== target) return;

    console.info(`[training-counting] target ${target} correct`);
    stepIndex += 1;
    if (stepIndex >= COUNTING_LESSON.sequence.length) {
      markLessonComplete(COUNTING_LESSON.id);
      ui.setObjective("Counting complete - Practice unlocked");
      onLessonComplete();
      return;
    }

    abacus.setValue(0); // reset between steps using setValue only for reset
    updateObjective();
  }

  function start() {
    console.info("[training-counting] start");
    setLesson(COUNTING_LESSON.id);
    stepIndex = 0;
    abacus.configure({
      rods: COUNTING_LESSON.rods,
      upperEnabled: !COUNTING_LESSON.upperBeadDisabled,
      lowerCount: COUNTING_LESSON.lowerBeads
    });
    abacus.setValue(0);
    ui.setModeLabel("Training: Counting");
    updateObjective();
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = abacus.onChange(handleChange);
  }

  function stop() {
    console.info("[training-counting] stop");
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    // Reset back to base abacus configuration for other modes.
    if (baseAbacusConfig) {
      abacus.configure(baseAbacusConfig);
      abacus.setValue(0);
    }
  }

  return {
    name: "training",
    displayName: "Training: Counting",
    start,
    stop
  };
}
