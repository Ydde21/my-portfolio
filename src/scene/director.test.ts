import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { createRobotDirector, type RobotAnchor } from "./director";
import { buildRobot } from "./robot";

const anchor = (heroProgress: number): RobotAnchor => ({
  pose: "hero",
  rect: { left: 660, top: 140, width: 560, height: 470 },
  viewport: { width: 1280, height: 720 },
  heroProgress,
  workProgress: 0,
  chapters: 4,
});

describe("robot director", () => {
  it("turns coarse wheel steps into continuous motion", () => {
    const robot = buildRobot();
    const director = createRobotDirector(robot);
    const pointer = new THREE.Vector2();
    director.setAnchor(anchor(0), true, false);
    director.step(1 / 60, pointer, false);
    let last = robot.root.rotation.y;
    let lastX = robot.root.position.x;
    for (let frame = 0; frame < 240; frame++) {
      // Six abrupt notches, one every half second.
      const progress = Math.min(1, Math.floor(frame / 30) / 6);
      director.setAnchor(anchor(progress), false, true);
      director.step(1 / 60, pointer, false);
      expect(Math.abs(robot.root.rotation.y - last)).toBeLessThan(0.06);
      expect(Math.abs(robot.root.position.x - lastX)).toBeLessThan(0.06);
      last = robot.root.rotation.y;
      lastX = robot.root.position.x;
    }
    robot.dispose();
  });

  it("finishes a spin exactly one turn later without a jump", () => {
    const robot = buildRobot();
    const director = createRobotDirector(robot);
    const pointer = new THREE.Vector2();
    director.setAnchor(anchor(0), true, false);
    for (let i = 0; i < 120; i++) director.step(1 / 60, pointer, false);
    const start = robot.root.rotation.y;
    director.spin(false);
    let last = start;
    for (let i = 0; i < 300; i++) {
      director.step(1 / 60, pointer, false);
      expect(Math.abs(robot.root.rotation.y - last)).toBeLessThan(0.25);
      last = robot.root.rotation.y;
    }
    expect(robot.root.rotation.y).toBeCloseTo(start + Math.PI * 2, 1);
    robot.dispose();
  });

  it("holds a static frame in reduced motion", () => {
    const robot = buildRobot();
    const director = createRobotDirector(robot);
    const pointer = new THREE.Vector2(1, 1);
    director.setAnchor(anchor(0.5), true, false);
    director.step(1 / 60, pointer, true);
    const position = robot.root.position.clone();
    const rotation = robot.root.rotation.y;
    for (let i = 0; i < 30; i++) director.step(1 / 60, pointer, true);
    expect(robot.root.position.distanceTo(position)).toBeLessThan(1e-9);
    expect(robot.root.rotation.y).toBe(rotation);
    robot.dispose();
  });
});
