/**
 * Motion primitives for the companion. Springs replace per-frame snapping so
 * every movement carries weight, settles naturally, and never jumps when the
 * page scroll arrives in coarse wheel steps.
 */

/** A damped spring. `frequency` is in hertz; `damping` 1 is critically damped,
 * below 1 overshoots and settles. Substeps keep it stable at any frame rate. */
export class Spring {
  value: number;
  velocity = 0;
  constructor(
    value = 0,
    public frequency = 1.2,
    public damping = 1,
  ) {
    this.value = value;
  }
  step(target: number, delta: number) {
    if (delta <= 0) return this.value;
    const omega = this.frequency * Math.PI * 2;
    const steps = Math.max(1, Math.ceil(delta / (1 / 120)));
    const dt = delta / steps;
    for (let i = 0; i < steps; i++) {
      const acceleration =
        -omega * omega * (this.value - target) -
        2 * this.damping * omega * this.velocity;
      this.velocity += acceleration * dt;
      this.value += this.velocity * dt;
    }
    return this.value;
  }
  snap(value: number) {
    this.value = value;
    this.velocity = 0;
    return value;
  }
}

/** Smooth, non-repeating drift in roughly [-1, 1], built from incommensurate
 * sines. Cheap, deterministic, and free of the metronome look of one sine. */
export function drift(t: number, seed = 0) {
  return (
    (Math.sin(t + seed * 1.7) +
      Math.sin(t * 1.618 + 1.3 + seed) * 0.6 +
      Math.sin(t * 2.718 + 2.1 + seed * 0.4) * 0.3) /
    1.9
  );
}

/** Deterministic pseudo-random sequence, so tests and renders are repeatable. */
export function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const smooth = (edge0: number, edge1: number, value: number) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};
export const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
