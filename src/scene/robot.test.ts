import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { buildRobot, type RobotPose } from "./robot";

const poses: RobotPose[] = ["hero", "present", "quiet", "contact"];
describe("robot animation", () => {
  it("keeps the full model finite through greetings, blinks and section changes", () => {
    const robot = buildRobot();
    for (const pose of poses) {
      for (const time of [0, 0.016, 1.6, 3.2, 4.65, 4.76, 4.87, 5.1, 1000]) {
        robot.update({
          time,
          delta: 0.05,
          pose,
          pointer: new THREE.Vector2(-1, 1),
          walking: 1,
          progress: time % 1,
          reduced: false,
        });
        robot.root.updateMatrixWorld(true);
        robot.root.traverse((object) =>
          expect(object.matrixWorld.elements.every(Number.isFinite)).toBe(true),
        );
        const bounds = new THREE.Box3().setFromObject(robot.root);
        expect(bounds.max.y - bounds.min.y).toBeGreaterThan(5);
        expect(bounds.max.y - bounds.min.y).toBeLessThan(7);
      }
    }
    robot.dispose();
  });

  it("moves the whole body into a flight pose, including both legs", () => {
    const robot = buildRobot();
    const frame = (flight: number) =>
      robot.update({
        time: 10,
        delta: 0.05,
        pose: "hero",
        pointer: new THREE.Vector2(),
        walking: 0,
        reduced: false,
        flight,
      });
    for (let i = 0; i < 60; i++) frame(0);
    const restingKnee = robot.rig.leftLeg.knee.rotation.x;
    const restingArm = robot.rig.rightArm.shoulder.rotation.x;
    for (let i = 0; i < 60; i++) frame(1);
    expect(robot.rig.leftLeg.knee.rotation.x).toBeLessThan(restingKnee - 1);
    expect(robot.rig.rightLeg.knee.rotation.x).toBeLessThan(-0.8);
    expect(robot.rig.rightArm.shoulder.rotation.x).toBeLessThan(
      restingArm - 0.6,
    );
    robot.root.updateMatrixWorld(true);
    robot.root.traverse((object) =>
      expect(object.matrixWorld.elements.every(Number.isFinite)).toBe(true),
    );
    robot.dispose();
  });

  it("does not blink, sway or walk in reduced motion", () => {
    const robot = buildRobot();
    const frame = (time: number) =>
      robot.update({
        time,
        delta: 1,
        pose: "hero",
        pointer: new THREE.Vector2(1, -1),
        walking: 1,
        reduced: true,
      });
    // Let the fixed joint pose settle, then compare across animation timestamps.
    for (let i = 0; i < 5; i++) frame(i);
    robot.root.updateMatrixWorld(true);
    const matrices: number[][] = [];
    robot.root.traverse((object) =>
      matrices.push(object.matrixWorld.elements.slice()),
    );
    frame(4.76);
    robot.root.updateMatrixWorld(true);
    let index = 0;
    robot.root.traverse((object) => {
      object.matrixWorld.elements.forEach((value, component) =>
        expect(value).toBeCloseTo(matrices[index][component], 8),
      );
      index++;
    });
    expect(robot.rig.eyes.every((eye) => eye.scale.y === 1)).toBe(true);
    robot.dispose();
  });
});
