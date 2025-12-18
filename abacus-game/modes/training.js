export function createTrainingMode({ abacus, ui, onComplete = () => {} }) {
  const steps = [
    { id: "warmup-1", label: "Set 1 on the rod", target: 1 },
    { id: "warmup-5", label: "Set 5 using the upper bead", target: 5 },
    { id: "warmup-9", label: "Set 9 with all lower beads + upper", target: 9 }
  ];

  let stepIndex = 0;
  let unsubscribe = null;
  let completed = false;

  function updateObjective() {
    const step = steps[stepIndex];
    ui.setObjective(step ? step.label : "Complete");
  }

  function handleChange(value) {
    const step = steps[stepIndex];
    if (!step) return;
    console.info(`[training] move logged: value=${value}, expected=${step.target}`);
    if (value === step.target) {
      console.info(`[training] step ${step.id} complete`);
      stepIndex += 1;
      if (stepIndex >= steps.length) {
        ui.setObjective("Complete - ready for practice");
        if (!completed) {
          completed = true;
          onComplete();
        }
        return;
      }
      abacus.reset();
      updateObjective();
    } else {
      console.info("[training] input locked until target is reached");
    }
  }

  function start() {
    console.info("[training] start");
    stepIndex = 0;
    completed = false;
    abacus.reset();
    updateObjective();
    unsubscribe = abacus.onChange(handleChange);
  }

  function stop() {
    console.info("[training] stop");
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  return { name: "training", start, stop };
}
