import { isLessonComplete, markLessonComplete, setLesson } from "../gameState.js";
import { trainingLessons } from "../lessons.js";

export function createTrainingMode({
  abacus,
  ui,
  onLessonComplete = () => {},
  baseAbacusConfig
}) {
  let stepIndex = 0;
  let unsubscribe = null;
  let lesson = null;

  function pickLesson() {
    const next = trainingLessons.find((entry) => !isLessonComplete(entry.id));
    return next || trainingLessons[0];
  }

  function updateObjective() {
    if (!lesson) return;
    const target = lesson.sequence[stepIndex];
    if (typeof target === "number") {
      ui.setObjective(`Set the abacus to: ${target}`);
    }
  }

  function handleChange(value) {
    if (!lesson) return;
    const target = lesson.sequence[stepIndex];
    if (target === undefined) return;
    console.info(`[training:${lesson.id}] move logged: value=${value}, expected=${target}`);
    if (value !== target) return;

    console.info(`[training:${lesson.id}] target ${target} correct`);
    stepIndex += 1;
    const finished = stepIndex >= lesson.sequence.length;
    if (lesson.resetAfterStep || finished) {
      abacus.setValue(0);
    }
    if (finished) {
      markLessonComplete(lesson.id);
      ui.setObjective("Counting complete - Practice unlocked");
      onLessonComplete(lesson);
      return;
    }

    updateObjective();
  }

  function start() {
    lesson = pickLesson();
    if (!lesson) {
      console.warn("[training] no lessons available; locking training mode");
      if (baseAbacusConfig) {
        abacus.configure(baseAbacusConfig);
        abacus.setValue(0);
      }
      ui.setObjective("Training unavailable");
      return;
    }
    console.info(`[training:${lesson?.id}] start`);
    setLesson(lesson.id);
    stepIndex = 0;
    abacus.configure({
      rods: lesson.rods,
      upperEnabled: !lesson.upperBeadDisabled,
      lowerCount: lesson.lowerBeads
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
    console.info("[training] stop");
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
