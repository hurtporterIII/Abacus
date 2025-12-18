function randomTarget(max) {
  return Math.floor(Math.random() * Math.min(10, max + 1));
}

export function createPracticeMode({ abacus, ui, baseAbacusConfig }) {
  let unsubscribe = null;
  let target = 0;

  function setNewTarget() {
    target = randomTarget(9);
    ui.setObjective(`Match: ${target}`);
    console.info(`[practice] new target -> ${target}`);
  }

  function handleChange(value) {
    console.info(`[practice] attempt: ${value}`);
    if (value === target) {
      console.info("[practice] correct - generating another");
      setNewTarget();
      abacus.reset();
    }
  }

  function start() {
    console.info("[practice] start");
    if (baseAbacusConfig) {
      abacus.configure(baseAbacusConfig);
    }
    abacus.setValue(0);
    setNewTarget();
    unsubscribe = abacus.onChange(handleChange);
  }

  function stop() {
    console.info("[practice] stop");
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  return { name: "practice", start, stop };
}
