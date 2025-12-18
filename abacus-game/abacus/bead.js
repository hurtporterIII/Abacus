let activeBead = null;

function installGlobalGuards() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const cancelActive = () => {
    if (activeBead) {
      activeBead.finishDrag({ cancelled: true });
    }
  };
  window.addEventListener("blur", cancelActive);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      cancelActive();
    }
  });
}

installGlobalGuards();

export class Bead {
  constructor({ value, type, onChange }) {
    this.value = value;
    this.type = type; // "upper" | "lower"
    this.onChange = onChange;
    this.isActive = false;
    this.anchors = { active: 0, inactive: 0 };
    this.el = document.createElement("div");
    this.el.className = "bead";
    this._pointerMove = this.handlePointerMove.bind(this);
    this._pointerUp = this.handlePointerUp.bind(this);
    this._pointerCancel = this.handlePointerCancel.bind(this);
    this.el.addEventListener("pointerdown", (e) => this.handlePointerDown(e));
    this.el.addEventListener("pointercancel", this._pointerCancel);
  }

  attachTo(parent) {
    parent.appendChild(this.el);
  }

  setAnchors({ active, inactive }) {
    this.anchors = { active, inactive };
    this.snap(false);
  }

  setActive(isActive) {
    this.isActive = isActive;
    this.snap(false);
    if (typeof this.onChange === "function") {
      this.onChange(this);
    }
  }

  handlePointerDown(event) {
    event.preventDefault();
    this.startY = event.clientY;
    this.startTop = parseFloat(this.el.style.top || "0");
    this.startPointerId = event.pointerId;
    this.el.setPointerCapture(event.pointerId);
    document.addEventListener("pointermove", this._pointerMove);
    document.addEventListener("pointerup", this._pointerUp);
    document.addEventListener("pointercancel", this._pointerCancel);
    activeBead = this;
  }

  handlePointerMove(event) {
    if (this.startY === undefined) return;
    const deltaY = event.clientY - this.startY;
    const nextTop = this.startTop + deltaY;
    const min = Math.min(this.anchors.active, this.anchors.inactive) - 12;
    const max = Math.max(this.anchors.active, this.anchors.inactive) + 12;
    const clamped = Math.max(min, Math.min(max, nextTop));
    this.el.style.top = `${clamped}px`;
  }

  handlePointerUp(event) {
    this.finishDrag({ pointerId: event.pointerId });
  }

  handlePointerCancel(event) {
    this.finishDrag({ pointerId: event.pointerId, cancelled: true });
  }

  finishDrag({ pointerId, cancelled = false } = {}) {
    try {
      if (this.startPointerId !== undefined) {
        this.el.releasePointerCapture(this.startPointerId);
      } else if (pointerId !== undefined) {
        this.el.releasePointerCapture(pointerId);
      }
    } catch (_err) {
      // Ignore capture release errors; safe fallback below.
    }
    document.removeEventListener("pointermove", this._pointerMove);
    document.removeEventListener("pointerup", this._pointerUp);
    document.removeEventListener("pointercancel", this._pointerCancel);
    const currentTop = parseFloat(this.el.style.top || "0");
    const distActive = Math.abs(currentTop - this.anchors.active);
    const distInactive = Math.abs(currentTop - this.anchors.inactive);
    const nextActive = distActive <= distInactive;
    const changed = nextActive !== this.isActive;
    this.isActive = nextActive;
    this.snap(false);
    if (changed && typeof this.onChange === "function" && !cancelled) {
      this.onChange(this);
    } else if (cancelled) {
      // On cancellation, still notify if state changed to keep abacus value correct.
      if (changed && typeof this.onChange === "function") {
        this.onChange(this);
      }
    }
    this.startY = undefined;
    this.startTop = undefined;
    this.startPointerId = undefined;
    if (activeBead === this) {
      activeBead = null;
    }
  }

  snap(emitChange = false) {
    const target = this.isActive ? this.anchors.active : this.anchors.inactive;
    this.el.style.top = `${target}px`;
    if (emitChange && typeof this.onChange === "function") {
      this.onChange(this);
    }
  }
}
