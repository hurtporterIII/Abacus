import { isLessonComplete } from "../gameState.js";
import { getEducationLessons } from "../lessons.js";

function buildLessonName(lesson) {
  if (!lesson) return "Lesson";
  if (lesson.name) return lesson.name;
  const slug = lesson.id || "lesson";
  const label = slug.replace(/^training-/, "").replace(/-/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function pickPracticeLesson() {
  const lessons = getEducationLessons({ activeOnly: true });
  const eligible = lessons.filter(
    (lesson) =>
      lesson.track === "education" &&
      lesson.mode === "training" &&
      isLessonComplete(lesson.id)
  );
  if (eligible.length > 0) return eligible[0];
  return null;
}

function uniqueTargets(sequence = []) {
  const numbers = sequence.filter((value) => typeof value === "number");
  return Array.from(new Set(numbers));
}

function randomFromList(list) {
  if (!list.length) return 0;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function createPracticeMode({ abacus, ui, baseAbacusConfig }) {
  let unsubscribe = null;
  let target = 0;
  let lesson = null;
  let targets = [];

  function setNewTarget() {
    target = randomFromList(targets);
    const lessonName = buildLessonName(lesson);
    ui.setObjective(`${lessonName} — Match: ${target}`);
    console.info(`[practice:${lesson?.id}] new target -> ${target}`);
  }

  function handleChange(value) {
    console.info(`[practice:${lesson?.id}] attempt: ${value}`);
    if (value === target) {
      console.info("[practice] correct - generating another");
      setNewTarget();
    }
  }

  function start() {
    lesson = pickPracticeLesson();
    if (!lesson) {
      console.warn("[practice] no completed lessons available; locking practice session");
      if (baseAbacusConfig) {
        abacus.configure(baseAbacusConfig);
        abacus.setValue(0);
      }
      ui.setObjective("Complete a training lesson to unlock practice");
      return;
    }

    targets = uniqueTargets(lesson.sequence);
    if (targets.length === 0) {
      console.warn(`[practice:${lesson.id}] lesson has no numeric targets; locking session`);
      if (baseAbacusConfig) {
        abacus.configure(baseAbacusConfig);
        abacus.setValue(0);
      }
      ui.setObjective("Practice unavailable for this lesson");
      return;
    }

    console.info(`[practice:${lesson.id}] start`);
    abacus.configure({
      rods: lesson.rods,
      upperEnabled: !lesson.upperBeadDisabled,
      lowerCount: lesson.lowerBeads
    });
    abacus.setValue(0);
    setNewTarget();
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = abacus.onChange(handleChange);
  }

  function stop() {
    console.info("[practice] stop");
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    if (baseAbacusConfig) {
      abacus.configure(baseAbacusConfig);
      abacus.setValue(0);
    }
  }

  return { name: "practice", displayName: "Practice Mode", start, stop };
}
