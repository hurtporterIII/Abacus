import { Rod } from "./rod.js";

export class Abacus {
  constructor(rootEl, { rods = 1 } = {}) {
    this.rootEl = rootEl;
    this.rods = [];
    this.changeHandlers = new Set();
    this.suspendChange = false;

    this.frame = document.createElement("div");
    this.frame.className = "abacus-frame";
    this.rootEl.appendChild(this.frame);

    for (let i = 0; i < rods; i++) {
      const rod = new Rod(i, { onChange: () => this.handleRodChange() });
      this.rods.push(rod);
      this.rootEl.appendChild(rod.el);
    }

    requestAnimationFrame(() => this.layoutRods());
    window.addEventListener("resize", () => this.layoutRods());
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
