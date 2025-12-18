# Abacus Educational Game Frame

Vanilla HTML/CSS/JS scaffold for a soroban training game. The abacus is the sole controller and the project is intentionally minimal so new mechanics can be layered on later (guided lessons, structured practice, arcade challenge).

## Project Structure
- `index.html` – basic UI shell with mode bar, play area, abacus container, and controls.
- `style.css` – simple layout styles; low-fi visuals to keep focus on logic.
- `app.js` – bootstraps the page, wires UI controls, loads the abacus, and swaps modes.
- `gameState.js` – central state container with helper setters/getters and optional localStorage placeholder.
- `abacus/abacus.js` – Abacus class to manage rods, sync values, and expose `getValue`, `setValue`, `reset`.
- `abacus/rod.js` – Rod class with one upper bead (5) and four lower beads (1) plus layout helpers.
- `abacus/bead.js` – Bead class handling DOM, drag gestures, and snapping.
- `modes/training.js` – stub for step-based guided interactions (locks input until correct moves).
- `modes/practice.js` – stub for simple randomized problems with console feedback.
- `modes/challenge.js` – stub for a future arcade/falling-number loop.
- `assets/abacus-frame.png`, `assets/bead.png` – placeholder art files (swap with real assets later).

## Running
Open `index.html` in a modern browser. No build steps or servers required.

## Extension Notes
- Add lesson data and friend enforcement rules in the mode modules; Abacus methods are intentionally small so additional validation layers can sit above them.
- Swap the placeholder assets when you have real art; CSS references `assets/bead.png` for bead visuals.
- Challenge mode is designed so a canvas or Phaser scene can plug into the play area without replacing the abacus DOM if you want a hybrid approach.
- Persist state in `gameState.js` once unlocks and user progress matter; right now storage is a noop placeholder.
