import * as THREE from "three";
import { buildRobot } from "../src/scene/robot";
import { createRobotPresentation } from "../src/scene/presentation";

/** Import through the local Vite server and save the returned WebP data URL
 * as public/robot-preview.webp at 1440×960, or robot-preview-mobile.webp
 * at 390×844, whenever the geometry or lighting changes. */
export function renderRobotPreview() {
  const anchor = document.querySelector<HTMLElement>(".hero-robot");
  if (!anchor)
    throw new Error("The hero must be mounted before rendering its portrait.");
  const rect = anchor.getBoundingClientRect();
  const width = window.innerWidth,
    height = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(2);
  renderer.setSize(width, height);
  const { scene, camera, environment } = createRobotPresentation(renderer);
  const robot = buildRobot();
  try {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    scene.add(robot.root);
    const scale = Math.min(rect.height / 6.6, rect.width / 4.6);
    const viewWidth = (8 * width) / height;
    robot.root.position.set(
      ((rect.left + rect.width / 2) / width - 0.5) * viewWidth,
      (0.5 - (rect.top + rect.height / 2) / height) * 8,
      0,
    );
    robot.root.scale.setScalar((scale * 8) / height);
    robot.root.rotation.set(0, -0.32, -0.08);
    for (let i = 0; i < 5; i++)
      robot.update({
        time: 0,
        delta: 0,
        pose: "hero",
        pointer: new THREE.Vector2(),
        walking: 0,
        reduced: true,
      });
    renderer.render(scene, camera);
    const output = document.createElement("canvas");
    output.width = 920;
    output.height = 1320;
    const context = output.getContext("2d");
    if (!context) throw new Error("Could not create the portrait canvas.");
    const cropWidth = scale * 4.6,
      cropHeight = scale * 6.6;
    context.drawImage(
      renderer.domElement,
      (rect.left + rect.width / 2 - cropWidth / 2) * 2,
      (rect.top + rect.height / 2 - cropHeight / 2) * 2,
      cropWidth * 2,
      cropHeight * 2,
      0,
      0,
      output.width,
      output.height,
    );
    return output.toDataURL("image/webp", 0.95);
  } finally {
    robot.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }
}
