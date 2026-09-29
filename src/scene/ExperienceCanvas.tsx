import { useEffect, useRef } from "react";
import * as THREE from "three";
import { readPalette } from "./palette";
import { detectQuality, pixelRatioSteps } from "./quality";
import { buildJellyfish } from "./jellyfish";

/**
 * CONTRACT — owned by the scene engine (src/scene/**).
 *
 * UI integration points (do not change without updating both sides):
 *  - Default export: a component that fills its parent element.
 *    The parent is responsible for positioning (fixed, inset-0, z-0,
 *    pointer-events-none). No required props.
 *  - `[data-scene]` sections drive the render loop's occlusion pause:
 *    a section whose own background is transparent reveals the fixed
 *    canvas, so the sim keeps animating while any of them is in view
 *    (hero, work). Opaque `bg-background` sections cover the
 *    canvas entirely — the loop pauses until a reveal scrolls back.
 *    `visibilitychange` handles tab-hide.
 *  - Palette is read live from CSS custom properties:
 *      --background, --foreground, --muted-foreground, --accent
 *    (HSL triplets, e.g. "16 78% 56%"). Re-read on `.dark` class changes;
 *    jelly colours/blending cross-fade so theme flips never snap.
 *  - prefers-reduced-motion: the swarm is warmed ~20s and rendered as a
 *    single static frame — no loop, no pointer tracking.
 *
 * The visual is three luminous jellyfish (see jellyfish.ts — all
 * look/feel constants live in `JELLIES` there): fresnel-glow bells that
 * pulse for propulsion, glowing cores + halos, and ribbons of waving
 * tentacles. A fine pointer adds gentle parallax.
 *
 * Architecture:
 *  palette.ts   — CSS-var → THREE.Color theme reads.
 *  quality.ts   — device tier + adaptive pixel-ratio ladder.
 *  jellyfish.ts — swarm build, shaders, motion sim, disposal.
 *  this file    — mount, renderer, camera, loop, lifecycle. Mutable
 *                 refs only; no React state touches the render loop.
 */

export default function ExperienceCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = () => mount.clientWidth || 1;
    const height = () => mount.clientHeight || 1;
    const quality = detectQuality();
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
      false;
    let palette = readPalette();

    /* ---------------- Renderer ---------------- */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // WebGL unavailable — the machine-fallback div stays behind.
    }
    const prSteps = pixelRatioSteps(quality.pixelRatioCap);
    let prIndex = 0;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, prSteps[prIndex]),
    );
    renderer.setSize(width(), height());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      32,
      width() / height(),
      0.1,
      40,
    );
    camera.position.set(0, 0.2, 9);
    camera.lookAt(0, 0, 0);

    /* ---------------- The swarm ---------------- */
    const jellyfish = buildJellyfish(scene, {
      palette,
      aspect: width() / height(),
    });

    /* ---------------- Theme ---------------- */
    const applyTheme = (immediate = false) => {
      palette = readPalette();
      jellyfish.setTheme(palette, immediate);
    };

    /* ---------------- Resize ---------------- */
    const applySize = () => {
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      renderer.setSize(width(), height());
      jellyfish.setAspect(width() / height());
    };

    function disposeAll() {
      jellyfish.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    }

    /* ================= Reduced motion =================
       One warmed static frame — the swarm is pre-rolled so the still
       shows a natural mid-drift pose. Re-rendered only when resize or
       theme shifts the underlying image. */
    if (reduced) {
      applyTheme(true);
      jellyfish.warm(20);
      const renderFrame = () => {
        applySize();
        jellyfish.update(0);
        renderer.render(scene, camera);
      };
      renderFrame();
      const staticObserver = new ResizeObserver(renderFrame);
      staticObserver.observe(mount);
      const staticThemeObserver = new MutationObserver(() => {
        applyTheme(true);
        renderFrame();
      });
      staticThemeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => {
        staticObserver.disconnect();
        staticThemeObserver.disconnect();
        disposeAll();
      };
    }

    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(mount);

    const themeObserver = new MutationObserver(() => applyTheme(false));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    /* ---------------- Pointer parallax ----------------
       Fine pointers only (quality tier) — touch devices never get the
       listener. Aspect-space coords, y up. */
    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const a = w / h;
      jellyfish.setPointerTarget(
        (e.clientX / w - 0.5) * a,
        0.5 - e.clientY / h,
      );
    };
    if (quality.pointerSteering) {
      window.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
    }

    /* ---------------- Render loop ----------------
       Runs while the tab is visible AND the scene can be seen — a
       frozen frame under an opaque section is invisible anyway, so
       that's the only time rendering is wasted work. */
    const clock = new THREE.Clock();
    let raf = 0;
    let sceneVisible = true;
    let tabVisible = true;
    let frameCount = 0;
    let emaMs = 16;
    let hotFrames = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, clock.getDelta());
      frameCount++;

      /* Adaptive quality — sustained >26ms frames drop pixelRatio a notch. */
      const ms = dt * 1000;
      emaMs += (ms - emaMs) * 0.05;
      if (emaMs > 26 && prIndex < prSteps.length - 1 && frameCount > 90) {
        hotFrames++;
        if (hotFrames > 60) {
          prIndex++;
          hotFrames = 0;
          emaMs = 16;
          renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, prSteps[prIndex]),
          );
          renderer.setSize(width(), height());
        }
      } else if (emaMs <= 24) {
        hotFrames = 0;
      }

      jellyfish.update(dt);
      renderer.render(scene, camera);
    };

    const startLoop = () => {
      cancelAnimationFrame(raf);
      clock.getDelta(); // discard away-time so nothing snaps on resume
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const syncLoop = () => {
      if (tabVisible && sceneVisible) startLoop();
      else stopLoop();
    };

    startLoop();

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* Occlusion pause — a `[data-scene]` section reveals the fixed
       canvas while its own background is transparent; opaque-painted
       sections cover it. Keep animating through every reveal and
       coast only when none are on screen. */
    const revealing = new Set<Element>();
    const reveals = (el: Element) => {
      const m = getComputedStyle(el).backgroundColor.match(/\((.*)\)/);
      if (!m) return true; /* no background → see-through */
      const parts = m[1].split(/[\s/,]+/).filter(Boolean);
      if (parts.length < 4) return false; /* rgb() → fully opaque */
      const raw = parts[3];
      const a = raw.endsWith("%")
        ? parseFloat(raw) / 100
        : parseFloat(raw);
      return a < 1;
    };
    const sceneObserver = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && reveals(e.target)) revealing.add(e.target);
        else revealing.delete(e.target);
      }
      sceneVisible = revealing.size > 0;
      syncLoop();
    });
    document
      .querySelectorAll("main [data-scene]")
      .forEach((el) => sceneObserver.observe(el));

    return () => {
      stopLoop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      sceneObserver.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      disposeAll();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="machine-fallback h-full w-full"
      aria-hidden="true"
    />
  );
}
