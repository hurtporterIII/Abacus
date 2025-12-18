import { Bead } from "./bead.js";

export class Rod {
  constructor(index, { onChange } = {}) {
    this.index = index;
    this.onChange = onChange;
    this.el = document.createElement("div");
    this.el.className = "rod";

    this.upperZone = document.createElement("div");
    this.upperZone.className = "upper-zone";
    this.beam = document.createElement("div");
    this.beam.className = "beam";
    this.lowerZone = document.createElement("div");
    this.lowerZone.className = "lower-zone";

    this.el.append(this.upperZone, this.beam, this.lowerZone);
    this.suspendNotify = false;

    this.upperBead = new Bead({
      value: 5,
      type: "upper",
      onChange: () => this.handleBeadChange()
    });
    this.lowerBeads = Array.from({ length: 4 }, () => {
      return new Bead({
        value: 1,
        type: "lower",
        onChange: () => this.handleBeadChange()
      });
    });

    this.upperBead.attachTo(this.el);
    this.lowerBeads.forEach((bead) => bead.attachTo(this.el));
  }

  layout() {
    // Compute anchors relative to the rod element so dragging stays within each zone.
    const rodRect = this.el.getBoundingClientRect();
    const beamRect = this.beam.getBoundingClientRect();
    const upperRect = this.upperZone.getBoundingClientRect();
    const lowerRect = this.lowerZone.getBoundingClientRect();
    const beadHeight = this.upperBead.el.offsetHeight || 24;

    const rodOffsetTop = rodRect.top;

    const upperActive = beamRect.top - rodOffsetTop - beadHeight / 2;
    const upperInactive = upperRect.top - rodOffsetTop + 6;
    this.upperBead.setAnchors({ active: upperActive, inactive: upperInactive });

    const lowerActive = beamRect.bottom - rodOffsetTop - beadHeight / 2;
    const spacing = beadHeight + 6;
    let cursor = lowerRect.bottom - rodOffsetTop - beadHeight;
    this.lowerBeads.forEach((bead) => {
      bead.setAnchors({ active: lowerActive, inactive: cursor });
      cursor -= spacing;
    });
  }

  getValue() {
    let value = 0;
    if (this.upperBead.isActive) value += this.upperBead.value;
    this.lowerBeads.forEach((bead) => {
      if (bead.isActive) value += bead.value;
    });
    return value;
  }

  setValue(value) {
    const clamped = Math.max(0, Math.min(9, Math.floor(value)));
    const useUpper = clamped >= 5;
    this.suspendNotify = true;
    this.upperBead.setActive(useUpper);
    let remaining = clamped - (useUpper ? 5 : 0);
    this.lowerBeads.forEach((bead, index) => {
      const activate = remaining > 0;
      bead.setActive(activate);
      if (remaining > 0) remaining -= 1;
    });
    this.suspendNotify = false;
    this.handleBeadChange();
  }

  reset() {
    this.suspendNotify = true;
    this.upperBead.setActive(false);
    this.lowerBeads.forEach((bead) => bead.setActive(false));
    this.suspendNotify = false;
    this.handleBeadChange();
  }

  handleBeadChange() {
    if (this.suspendNotify) return;
    if (typeof this.onChange === "function") {
      this.onChange(this);
    }
  }
}
