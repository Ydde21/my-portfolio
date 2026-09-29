import * as THREE from "three";

/**
 * Theme palette — reads the site's HSL CSS custom properties
 * ("16 78% 56%") into THREE.Color instances. Re-read whenever the
 * `.dark` class flips so fog, dust and the accent material follow
 * the active theme.
 */

export function themeColor(
  name: string,
  fallback: [number, number, number],
): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const parts = raw.split(/\s+/).map((v) => parseFloat(v));
  const [h, s, l] =
    parts.length >= 3 && parts.every((v) => !Number.isNaN(v)) ? parts : fallback;
  return new THREE.Color().setHSL(h / 360, s / 100, l / 100);
}

export interface Palette {
  background: THREE.Color;
  foreground: THREE.Color;
  mutedForeground: THREE.Color;
  accent: THREE.Color;
}

export function readPalette(): Palette {
  return {
    background: themeColor("--background", [30, 8, 7]),
    foreground: themeColor("--foreground", [40, 18, 90]),
    mutedForeground: themeColor("--muted-foreground", [30, 7, 55]),
    accent: themeColor("--accent", [16, 78, 56]),
  };
}
