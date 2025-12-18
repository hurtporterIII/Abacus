export function createChallengeMode({ ui, abacus, baseAbacusConfig }) {
  let rafId = null;
  let frame = 0;

  function loop(timestamp) {
    if (frame % 60 === 0) {
      console.info(`[challenge] tick @ ${Math.floor(timestamp)}ms`);
    }
    frame += 1;
    rafId = window.requestAnimationFrame(loop);
  }

  function start() {
    console.info("[challenge] start");
    if (baseAbacusConfig && abacus) {
      abacus.configure(baseAbacusConfig);
      abacus.setValue(0);
    }
    frame = 0;
    ui.setObjective("Survive incoming numbers (placeholder)");
    ui.setOverlayMessage("Challenge loop placeholder — falling numbers will live here.");
    rafId = window.requestAnimationFrame(loop);
  }

  function stop() {
    console.info("[challenge] stop");
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    ui.clearOverlay();
  }

  return { name: "challenge", start, stop };
}
