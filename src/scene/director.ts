import * as THREE from "three";
import type { RobotPose, buildRobot } from "./robot";
import { Spring, easeInOutCubic, smooth } from "./springs";

type Robot = ReturnType<typeof buildRobot>;

export interface RobotAnchor {
  pose: RobotPose;
  /** The reserved layout box, in viewport pixels. */
  rect: { left: number; top: number; width: number; height: number };
  viewport: { width: number; height: number };
  /** Progress through the pinned hero, 0-1 (0 when the hero is not pinned). */
  heroProgress: number;
  /** Progress through the pinned featured work section, 0-1. */
  workProgress: number;
  /** Number of featured chapters. */
  chapters: number;
}

const SPIN_SECONDS = 2.4;

/**
 * Choreography for the companion: where it is, how it turns, and how it
 * travels. All motion runs through springs, so wheel steps, anchor changes
 * and drags become one continuous, weighted movement. Shared by the live
 * canvas and the motion render harness.
 */
export function createRobotDirector(robot: Robot) {
  const x = new Spring(0, 2.2);
  const y = new Spring(0, 2.2);
  const scale = new Spring(1, 1.6, 0.8);
  const turn = new Spring(-0.32, 0.9, 0.85);
  const roll = new Spring(-0.08, 1);
  const hero = new Spring(0, 1.1);
  const drag = new Spring(0, 3);
  let anchor: RobotAnchor | null = null;
  let time = 0;
  let entrance = 1;
  let dragTarget = 0;
  let dragVelocity = 0;
  let pendingDrag = 0;
  let lastDrag = -10;
  let spinStart = -10;
  let spinBase = 0;
  let spinAngle = 0;
  let poseState: RobotPose = "hero";

  function targets(reduced: boolean) {
    const a = anchor!;
    const { width: vw, height: vh } = a.viewport;
    const viewWidth = (8 * vw) / vh;
    const r = a.rect;
    let tx = ((r.left + r.width / 2) / vw - 0.5) * viewWidth;
    let ty = (0.5 - (r.top + r.height / 2) / vh) * 8;
    let ts = Math.min(
      ((r.height / vh) * 8) / 6.6,
      ((r.width / vw) * viewWidth) / 4.6,
    );
    let tturn = a.pose === "quiet" ? -0.25 : 0.18;
    let troll = 0;
    let flight = 0;
    let progress = 0.5;
    let chapter = 0;
    if (a.pose === "hero") {
      // A cinematic glide instead of a full spin: the companion turns toward
      // the headline and leans into a glide, then turns back to the visitor.
      const p = reduced ? 0 : hero.value;
      const arc = Math.sin(p * Math.PI);
      flight = reduced ? 0 : 0.5 * Math.pow(arc, 1.4);
      tx -= smooth(0.25, 0.9, p) * viewWidth * 0.1;
      ty += arc * 0.45;
      ts *= 1 + arc * 0.07;
      tturn = reduced
        ? -0.18
        : -0.32 - 0.9 * smooth(0.08, 0.55, p) + 1.05 * smooth(0.55, 0.98, p);
      troll = -0.08 - flight * 0.12;
    } else if (a.pose === "present") {
      const chapters = Math.max(1, a.chapters);
      const scaled = a.workProgress * chapters;
      chapter = Math.min(chapters - 1, Math.floor(scaled));
      progress = reduced ? 0.5 : scaled - Math.floor(scaled);
      if (a.workProgress >= 1) progress = 1;
      const settle = Math.min(
        smooth(0.03, 0.15, progress),
        1 - smooth(0.85, 0.97, progress),
      );
      // Turn to the project while presenting; glance back between chapters.
      tturn = 0.15 + settle * 0.27;
      flight = reduced ? 0 : (1 - settle) * 0.22;
    }
    return { tx, ty, ts, tturn, troll, flight, progress, chapter };
  }

  return {
    /** Point the companion at a reserved space. `changed` means a different
     * section took over; it then materializes there instead of flying across. */
    setAnchor(next: RobotAnchor | null, changed: boolean, animate: boolean) {
      anchor = next;
      if (!next) return;
      if (!changed) return;
      poseState = next.pose;
      hero.snap(next.heroProgress);
      const target = targets(!animate);
      x.snap(target.tx);
      y.snap(target.ty);
      scale.snap(animate ? target.ts * 0.92 : target.ts);
      turn.snap(animate ? target.tturn - 0.22 : target.tturn);
      roll.snap(target.troll);
      entrance = animate ? 0 : 1;
    },
    /** Drag input in radians. Momentum carries on after release. */
    rotate(amount: number) {
      if (spinStart > -10) {
        // Grabbing mid-spin keeps the current angle instead of snapping back.
        dragTarget += spinAngle;
        drag.value += spinAngle;
        spinAngle = 0;
        spinStart = -10;
      }
      pendingDrag += amount;
    },
    spin(reduced: boolean) {
      if (reduced) {
        dragTarget += Math.PI / 2;
        drag.snap(dragTarget);
        return;
      }
      if (time - spinStart < SPIN_SECONDS) return;
      spinBase = dragTarget;
      spinStart = time;
      dragVelocity = 0;
    },
    get pose() {
      return poseState;
    },
    step(delta: number, pointer: THREE.Vector2, reduced: boolean) {
      if (!anchor) return { opacity: 0, rotation: robot.root.rotation.y };
      time += reduced ? 0 : delta;
      const isHero = anchor.pose === "hero";
      if (reduced) hero.snap(anchor.heroProgress);
      else hero.step(anchor.heroProgress, delta);

      // Drag with momentum: a flick keeps turning and eases to a stop.
      if (pendingDrag !== 0) {
        if (!reduced && delta > 0)
          dragVelocity = THREE.MathUtils.clamp(
            THREE.MathUtils.lerp(dragVelocity, pendingDrag / delta, 0.6),
            -8,
            8,
          );
        dragTarget += pendingDrag;
        pendingDrag = 0;
        lastDrag = time;
      } else if (!reduced && time - lastDrag > 0.06 && dragVelocity !== 0) {
        dragTarget += dragVelocity * delta;
        dragVelocity *= Math.exp(-3.2 * delta);
        if (Math.abs(dragVelocity) < 0.01) dragVelocity = 0;
      }

      // "Take a spin": wind up, one smooth turn with a lift, then settle.
      const u = reduced ? 1 : (time - spinStart) / SPIN_SECONDS;
      spinAngle = 0;
      let celebration = 0;
      let crouch = 0;
      if (u >= 0 && u < 1) {
        const windUp = smooth(0, 0.18, u);
        spinAngle =
          u < 0.18
            ? -0.35 * windUp
            : -0.35 + (Math.PI * 2 + 0.35) * easeInOutCubic((u - 0.18) / 0.64);
        if (u > 0.82) spinAngle = Math.PI * 2;
        crouch = windUp * (1 - smooth(0.18, 0.3, u));
        celebration = Math.sin(Math.PI * smooth(0.15, 0.95, u)) * 0.45;
      } else if (spinStart > -10 && u >= 1) {
        // Fold the finished turn into the drag angle without a visible jump.
        dragTarget = spinBase + Math.PI * 2;
        drag.value += Math.PI * 2;
        spinStart = -10;
      }

      const target = targets(reduced);
      const step = (spring: Spring, value: number) =>
        reduced ? spring.snap(value) : spring.step(value, delta);
      const px = step(x, target.tx);
      const py = step(y, target.ty);
      const s = step(scale, target.ts);
      const dragAngle = isHero ? step(drag, dragTarget) : drag.value;
      const rotation = step(turn, target.tturn) + (isHero ? dragAngle : 0);
      // Bank into horizontal travel and lean with speed, like a drone.
      const speed = Math.hypot(x.velocity, y.velocity);
      const bank = reduced
        ? 0
        : THREE.MathUtils.clamp(-x.velocity * 0.05, -0.18, 0.18);
      const tilt = step(
        roll,
        target.troll + bank + (isHero ? celebration * 0.12 : 0),
      );

      robot.root.position.set(px, py + celebration * 0.5 - crouch * 0.08, 0);
      robot.root.scale.setScalar(s * (1 - crouch * 0.025));
      robot.root.rotation.y = rotation + (isHero ? spinAngle : 0);
      robot.root.rotation.z = reduced ? 0 : tilt;
      robot.update({
        time,
        delta: reduced ? 1 : delta,
        pose: anchor.pose,
        pointer,
        walking: reduced ? 0 : Math.min(1, speed * 0.6),
        reduced,
        progress: target.progress,
        chapter: target.chapter,
        flight: target.flight,
        celebration: isHero ? celebration : 0,
      });
      entrance = reduced ? 1 : Math.min(1, entrance + delta * 2.2);
      return {
        opacity: reduced ? 1 : easeInOutCubic(entrance),
        rotation: robot.root.rotation.y,
      };
    },
  };
}
