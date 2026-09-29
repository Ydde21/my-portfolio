/**
 * Device quality tier — decided once at mount. Coarse pointers and
 * small viewports get the lighter tier: fewer particles, smaller
 * shadow maps, a lower pixel-ratio cap. Pointer steering is only
 * offered to devices with a fine pointer.
 */

export interface QualityTier {
  isMobile: boolean;
  pointerSteering: boolean;
  pixelRatioCap: number;
  particleCount: number;
  shadowMapSize: number;
}

export function detectQuality(): QualityTier {
  const coarse =
    window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const small = Math.min(window.innerWidth, window.innerHeight) < 760;
  const lowDpr = (window.devicePixelRatio || 1) < 1.25;
  const isMobile = coarse || small;
  return {
    isMobile,
    pointerSteering: !coarse,
    pixelRatioCap: isMobile || lowDpr ? 1.5 : 1.75,
    particleCount: isMobile ? 60 : 150,
    shadowMapSize: isMobile ? 512 : 1024,
  };
}

/**
 * Descending pixel-ratio ladder for the adaptive step-down — when the
 * sustained frame time stays high, the renderer walks this list one
 * notch at a time and never climbs back up (stability over recovery).
 */
export function pixelRatioSteps(cap: number): number[] {
  const raw = [cap, cap - 0.25, cap - 0.5, 1];
  const steps = Array.from(
    new Set(raw.map((v) => Math.round(Math.max(1, v) * 100) / 100)),
  );
  return steps.sort((a, b) => b - a);
}
