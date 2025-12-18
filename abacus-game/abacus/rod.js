import { Bead } from "./bead.js";

export class Rod {
  constructor(index, { onChange, upperEnabled = true, lowerCount = 4 } = {}) {
    this.index = index;
    this.onChange = onChange;
    this.upperEnabled = upperEnabled;
    this.lowerCount = lowerCount;
    this.el = document.createElement("div");
    this.el.className = "rod";
    this.applyHeight();

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
    this.lowerBeads = Array.from({ length: this.lowerCount }, () => {
      return new Bead({
        value: 1,
        type: "lower",
        onChange: () => this.handleBeadChange()
      });
    });

    this.upperBead.attachTo(this.el);
    this.lowerBeads.forEach((bead) => bead.attachTo(this.el));

    if (!this.upperEnabled) {
      this.upperBead.el.style.pointerEvents = "none";
      this.upperBead.el.style.opacity = "0.25";
      this.upperBead.setActive(false);
    }
  }

  applyHeight() {
    const baseHeight = 200;
    const extraBeads = Math.max(0, this.lowerCount - 4);
    const extraHeight = extraBeads * 18; // compact spacing to keep rods visible with more beads
    this.el.style.height = `${baseHeight + extraHeight}px`;
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
    const lowerTop = lowerRect.top - rodOffsetTop;
    const lowerBottom = lowerRect.bottom - rodOffsetTop - beadHeight;
    const available = Math.max(lowerBottom - lowerTop, 1);
    const spacing =
      this.lowerBeads.length > 1 ? available / (this.lowerBeads.length - 1) : 0;
    let cursor = lowerBottom;
    this.lowerBeads.forEach((bead) => {
      bead.setAnchors({ active: lowerActive, inactive: cursor });
      cursor -= spacing;
    });
  }

  getValue() {
    let value = 0;
    if (this.upperEnabled && this.upperBead.isActive) value += this.upperBead.value;
    this.lowerBeads.forEach((bead) => {
      if (bead.isActive) value += bead.value;
    });
    return value;
  }

  getMaxValue() {
    const upper = this.upperEnabled ? this.upperBead.value : 0;
    return upper + this.lowerBeads.length;
  }

  setValue(value) {
    const maxValue = this.getMaxValue();
    const clamped = Math.max(0, Math.min(maxValue, Math.floor(value)));
    const useUpper = this.upperEnabled && clamped >= this.upperBead.value;
    this.suspendNotify = true;
    this.upperBead.setActive(useUpper);
    let remaining = clamped - (useUpper ? this.upperBead.value : 0);
    this.lowerBeads.forEach((bead) => {
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
