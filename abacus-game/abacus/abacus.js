import { Rod } from "./rod.js";

export class Abacus {
  constructor(
    rootEl,
    { rods = 1, upperEnabled = true, lowerCount = 4 } = {}
  ) {
    this.rootEl = rootEl;
    this.rods = [];
    this.changeHandlers = new Set();
    this.suspendChange = false;
    this.config = { rods, upperEnabled, lowerCount };

    this.frame = document.createElement("div");
    this.frame.className = "abacus-frame";
    this.rootEl.appendChild(this.frame);

    this.buildRods();

    requestAnimationFrame(() => this.layoutAndZero());
    window.addEventListener("resize", () => this.layoutRods());
  }

  buildRods() {
    this.rods.forEach((rod) => rod.el.remove());
    this.rods = [];
    for (let i = 0; i < this.config.rods; i++) {
      const rod = new Rod(i, {
        onChange: () => this.handleRodChange(),
        upperEnabled: this.config.upperEnabled,
        lowerCount: this.config.lowerCount
      });
      this.rods.push(rod);
      this.rootEl.appendChild(rod.el);
    }
  }

  configure({ rods, upperEnabled, lowerCount } = {}) {
    this.suspendChange = true;
    this.config = {
      ...this.config,
      rods: rods ?? this.config.rods,
      upperEnabled: upperEnabled ?? this.config.upperEnabled,
      lowerCount: lowerCount ?? this.config.lowerCount
    };
    this.buildRods();
    requestAnimationFrame(() => this.layoutAndZero());
    this.suspendChange = false;
  }

  layoutAndZero() {
    this.layoutRods();
    // Snap everything to neutral after layout so anchor math is correct.
    this.setValue(0);
  }

  layoutRods() {
    this.rods.forEach((rod) => rod.layout());
  }

  onChange(callback) {
    this.changeHandlers.add(callback);
    return () => this.changeHandlers.delete(callback);
  }

  handleRodChange() {
    if (this.suspendChange) return;
    const value = this.getValue();
    this.changeHandlers.forEach((cb) => cb(value));
  }

  getValue() {
    return this.rods.reduce((acc, rod) => acc * 10 + rod.getValue(), 0);
  }

  setValue(number) {
    const positive = Math.max(0, Math.floor(Math.abs(number)));
    const digits = positive.toString().padStart(this.rods.length, "0");
    const usable = digits.slice(-this.rods.length).split("");
    this.suspendChange = true;
    usable.forEach((digit, index) => {
      this.rods[index].setValue(Number(digit));
    });
    this.suspendChange = false;
    this.handleRodChange();
  }

  reset() {
    this.suspendChange = true;
    this.rods.forEach((rod) => rod.reset());
    this.suspendChange = false;
    this.handleRodChange();
  }
}
