import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createRobotPresentation } from "./presentation";
import { buildRobot, type RobotPose } from "./robot";
import { detectQuality, pixelRatioSteps } from "./quality";

/** One transparent canvas, aligned to reserved HTML spaces. Each [data-robot-anchor]
 * reserves real layout space; data-robot-pose selects the character's gesture.
 * Scroll changes its position and turn, never the page's scrolling behavior.
 * Offscreen / hidden tabs stop rendering. Reduced motion gets static frames.
 * The hero's image remains visible until WebGL has successfully rendered.
 */
export default function ExperienceCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const quality = detectQuality();
    const ratios = pixelRatioSteps(quality.pixelRatioCap);
    let ratioIndex = 0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratios[0]));
    mount.appendChild(renderer.domElement);
    const { scene, camera, environment } = createRobotPresentation(renderer);
    const robot = buildRobot();
    scene.add(robot.root);
    // Match the baked portrait before the first live frame, without advancing
    // greeting time. The first animation can then grow out of this same pose.
    for (let i = 0; i < 5; i++)
      robot.update({
        time: 0,
        delta: 0,
        pose: "hero",
        pointer: new THREE.Vector2(),
        walking: 0,
        reduced: true,
      });

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let raf = 0,
      time = 0,
      lastTime = 0,
      frames = 0,
      slowFrames = 0;
    let dirty = true,
      visible = false,
      contextLost = false,
      hasRendered = false;
    let active: HTMLElement | null = null;
    let pose: RobotPose = "hero";
    let targetScale = 1,
      targetTurn = 0,
      entrance = 1,
      chapterProgress = 0.5;
    let viewportWidth = 1,
      viewportHeight = 1;
    const target = new THREE.Vector3();
    const pointer = new THREE.Vector2();
    let dragAngle = 0,
      spinStart = -10,
      spinBase = 0,
      flight = 0;
    let heroProgress = 0;
    const rotate = (event: Event) => {
      spinStart = -10;
      dragAngle += (event as CustomEvent<number>).detail;
      requestFrame();
    };
    const spin = () => {
      if (reduced) {
        dragAngle += Math.PI / 2;
        requestFrame();
        return;
      }
      if (time - spinStart < 2.6) return;
      spinBase = dragAngle;
      spinStart = time;
      requestFrame();
    };
    window.addEventListener("robot-rotate", rotate);
    window.addEventListener("robot-spin", spin);

    function measure() {
      dirty = false;
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>("[data-robot-anchor]"),
      );
      let best: HTMLElement | null = null;
      let bestRect: DOMRect | null = null;
      let bestScore = Infinity;
      for (const anchor of anchors) {
        const rect = anchor.getBoundingClientRect();
        if (
          !rect.width ||
          !rect.height ||
          rect.bottom < 110 ||
          rect.top > viewportHeight - 60
        )
          continue;
        const score = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
        if (score < bestScore) {
          best = anchor;
          bestRect = rect;
          bestScore = score;
        }
      }
      visible = Boolean(best && bestRect);
      if (!best || !bestRect) {
        mount!.style.opacity = "0";
        active = null;
        return;
      }
      const r = bestRect;
      const viewWidth = (8 * viewportWidth) / viewportHeight;
      target.set(
        ((r.left + r.width / 2) / viewportWidth - 0.5) * viewWidth,
        (0.5 - (r.top + r.height / 2) / viewportHeight) * 8,
        0,
      );
      targetScale = Math.min(
        ((r.height / viewportHeight) * 8) / 6.6,
        ((r.width / viewportWidth) * viewWidth) / 4.6,
      );
      pose = (best.dataset.robotPose || "quiet") as RobotPose;
      const home = document.getElementById("home")?.getBoundingClientRect();
      heroProgress =
        home &&
        viewportWidth >= 960 &&
        viewportHeight >= 650 &&
        home.height > viewportHeight + 10
          ? THREE.MathUtils.clamp(
              -home.top / (home.height - viewportHeight),
              0,
              1,
            )
          : 0;
      chapterProgress = 0.5;
      flight = 0;
      if (pose === "hero") {
        flight = reduced ? 0 : Math.sin(heroProgress * Math.PI);
        const travel = reduced
          ? 0
          : THREE.MathUtils.smoothstep(heroProgress, 0.3, 0.88);
        target.x -= travel * viewWidth * 0.12;
        target.y += reduced ? 0 : Math.sin(heroProgress * Math.PI) * 0.8;
        targetScale *=
          1 + (reduced ? 0 : Math.sin(heroProgress * Math.PI) * 0.14);
        targetTurn = reduced ? -0.18 : -0.32 + heroProgress * Math.PI * 2;
      } else if (pose === "present") {
        const work = document.getElementById("work");
        const wr = work?.getBoundingClientRect();
        const progress =
          wr && wr.height > viewportHeight + 10
            ? THREE.MathUtils.clamp(
                -wr.top / (wr.height - viewportHeight),
                0,
                1,
              )
            : 0;
        chapterProgress = reduced ? 0.5 : (progress * 4) % 1;
        mount!.dataset.project = work?.dataset.activeProject || "0";
        targetTurn = 0.25 + Math.sin(chapterProgress * Math.PI) * 0.4;
        flight = reduced
          ? 0
          : Math.pow(Math.sin(chapterProgress * Math.PI), 4) * 0.35;
      } else targetTurn = pose === "quiet" ? -0.25 : 0.18;
      if (best !== active) {
        active = best;
        entrance = reduced || !hasRendered ? 1 : 0;
        robot.root.position.copy(target);
        robot.root.scale.setScalar(targetScale);
        robot.root.rotation.y = targetTurn + (pose === "hero" ? dragAngle : 0);
        robot.root.rotation.z = reduced || pose !== "hero" ? 0 : -0.08;
      }
      mount!.dataset.pose = pose;
    }

    function tick(now: number) {
      raf = 0;
      if (contextLost || document.hidden) return;
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;
      if (dirty) measure();
      if (!visible) {
        lastTime = 0;
        return;
      }
      time += reduced ? 0 : delta;
      const distance = robot.root.position.distanceTo(target);
      robot.root.position.copy(target);
      robot.root.scale.setScalar(targetScale);
      const spinProgress = reduced
        ? 0
        : THREE.MathUtils.clamp((time - spinStart) / 2.6, 0, 1);
      const spinEnergy =
        spinProgress > 0 && spinProgress < 1
          ? Math.sin(spinProgress * Math.PI)
          : 0;
      if (spinEnergy > 0)
        dragAngle =
          spinBase +
          spinProgress * spinProgress * (3 - 2 * spinProgress) * Math.PI * 2;
      const rotation = targetTurn + (pose === "hero" ? dragAngle : 0);
      robot.root.rotation.y = reduced
        ? rotation
        : THREE.MathUtils.damp(robot.root.rotation.y, rotation, 7, delta);
      robot.root.rotation.z = reduced
        ? 0
        : THREE.MathUtils.damp(
            robot.root.rotation.z,
            pose === "hero"
              ? -0.08 - flight * 0.22 + spinEnergy * 0.3
              : Math.sin(time * 0.6) * 0.03,
            7,
            delta,
          );
      robot.root.position.y += spinEnergy * 0.45;
      robot.update({
        time,
        delta,
        pose,
        pointer,
        walking: Math.min(1, distance * 6),
        reduced,
        progress: reduced ? 0.5 : chapterProgress,
        flight,
        celebration: spinEnergy,
      });
      mount!.dataset.motion = reduced ? "static" : "animated";
      mount!.dataset.rotation = robot.root.rotation.y.toFixed(2);
      entrance = reduced ? 1 : Math.min(1, entrance + delta * 4);
      mount!.style.opacity = String(entrance);
      renderer.render(scene, camera);
      hasRendered = true;
      if (document.documentElement.dataset.robotReady !== "true") {
        document.documentElement.dataset.robotReady = "true";
      }
      if (!reduced) {
        frames++;
        slowFrames =
          delta > 0.029 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (frames > 120 && slowFrames > 75 && ratioIndex < ratios.length - 1) {
          renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, ratios[++ratioIndex]),
          );
          renderer.setSize(viewportWidth, viewportHeight);
          slowFrames = 0;
        }
        raf = requestAnimationFrame(tick);
      }
    }
    function requestFrame() {
      dirty = true;
      if (!raf && !contextLost && !document.hidden)
        raf = requestAnimationFrame(tick);
    }
    function resize() {
      viewportWidth = mount!.clientWidth || window.innerWidth || 1;
      viewportHeight = mount!.clientHeight || window.innerHeight || 1;
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewportWidth, viewportHeight);
      requestFrame();
    }
    function theme() {
      robot.setTheme(document.documentElement.classList.contains("dark"));
      requestFrame();
    }
    function motionChange() {
      reduced = media.matches;
      pointer.set(0, 0);
      lastTime = 0;
      requestFrame();
    }
    function pointerMove(event: PointerEvent) {
      if (reduced) return;
      pointer.set(
        THREE.MathUtils.clamp((event.clientX / viewportWidth) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(1 - (event.clientY / viewportHeight) * 2, -1, 1),
      );
    }
    function visibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastTime = 0;
      } else requestFrame();
    }
    function onContextLost(event: Event) {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
      raf = 0;
      mount!.style.opacity = "0";
      delete document.documentElement.dataset.robotReady;
    }
    function onContextRestored() {
      contextLost = false;
      lastTime = 0;
      requestFrame();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    const main = document.querySelector("main");
    if (main) resizeObserver.observe(main);
    const themeObserver = new MutationObserver(theme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", resize);
    if (quality.pointerSteering)
      window.addEventListener("pointermove", pointerMove, { passive: true });
    document.addEventListener("visibilitychange", visibilityChange);
    media.addEventListener("change", motionChange);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      onContextRestored,
    );
    theme();
    resize();
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("robot-rotate", rotate);
      window.removeEventListener("robot-spin", spin);
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("visibilitychange", visibilityChange);
      media.removeEventListener("change", motionChange);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      robot.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete document.documentElement.dataset.robotReady;
    };
  }, []);
  return <div ref={mountRef} className="machine-fallback absolute inset-0" />;
}
