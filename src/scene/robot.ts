import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Spring, drift, random, smooth } from "./springs";

export type RobotPose = "hero" | "present" | "quiet" | "contact";
export interface RobotMotion {
  time: number;
  delta: number;
  pose: RobotPose;
  pointer: THREE.Vector2;
  /** Travel speed, 0-1. The legs trail and the body leans; nothing walks. */
  walking: number;
  /** Progress through the current featured chapter, 0-1. */
  progress?: number;
  /** Featured chapter index. A new chapter restarts the presenting gesture. */
  chapter?: number;
  flight?: number;
  celebration?: number;
  reduced: boolean;
}

/** A jointed model: every limb pivots at its anatomical joint. No image planes. */
export function buildRobot() {
  const root = new THREE.Group();
  root.name = "Portfolio robot";
  const body = new THREE.Group();
  body.position.y = -0.66;
  root.add(body);
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const material = <T extends THREE.Material>(value: T): T => {
    materials.add(value);
    return value;
  };
  const ceramic = material(
    new THREE.MeshPhysicalMaterial({
      color: 0xeef4f8,
      metalness: 0.12,
      roughness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.16,
    }),
  );
  const inset = material(
    new THREE.MeshStandardMaterial({
      color: 0xbdced9,
      metalness: 0.45,
      roughness: 0.32,
    }),
  );
  const graphite = material(
    new THREE.MeshStandardMaterial({
      color: 0x14212d,
      metalness: 0.65,
      roughness: 0.38,
    }),
  );
  const visor = material(
    new THREE.MeshPhysicalMaterial({
      color: 0x020912,
      metalness: 0.18,
      roughness: 0.23,
      clearcoat: 0.3,
    }),
  );
  const cyan = material(
    new THREE.MeshStandardMaterial({
      color: 0x004b94,
      emissive: 0x0088ff,
      emissiveIntensity: 1.3,
      roughness: 0.25,
      toneMapped: false,
    }),
  );
  const whiteLight = material(
    new THREE.MeshBasicMaterial({ color: 0xe9fbff, toneMapped: false }),
  );
  const blush = material(
    new THREE.MeshBasicMaterial({ color: 0xffbdc8, toneMapped: false }),
  );
  const pupil = material(new THREE.MeshBasicMaterial({ color: 0x010812 }));

  function mesh(
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, surface);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  }
  function rounded(
    parent: THREE.Object3D,
    size: [number, number, number],
    radius: number,
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    // Thin panels need a round silhouette independent of their depth.
    // RoundedBoxGeometry clamps its radius to the shallowest dimension.
    if (size[2] < 0.3 && size[0] > 1) {
      const [w, h, depth] = size;
      const r = Math.min(radius, w / 2, h / 2);
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSize: 0.018,
        bevelThickness: 0.018,
        bevelSegments: 3,
        curveSegments: 16,
      });
      geometry.translate(0, 0, -depth / 2);
      return mesh(parent, geometry, surface, x, y, z);
    }
    return mesh(
      parent,
      new RoundedBoxGeometry(...size, 4, radius),
      surface,
      x,
      y,
      z,
    );
  }
  function sphere(
    parent: THREE.Object3D,
    size: [number, number, number],
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const object = mesh(
      parent,
      new THREE.SphereGeometry(1, 24, 16),
      surface,
      x,
      y,
      z,
    );
    object.scale.set(...size);
    return object;
  }
  function ring(
    parent: THREE.Object3D,
    radius: number,
    thickness: number,
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    return mesh(
      parent,
      new THREE.TorusGeometry(radius, thickness, 8, 40),
      surface,
      x,
      y,
      z,
    );
  }
  function joint(
    parent: THREE.Object3D,
    name: string,
    x: number,
    y: number,
    z = 0,
  ) {
    const pivot = new THREE.Group();
    pivot.name = name;
    pivot.position.set(x, y, z);
    parent.add(pivot);
    return pivot;
  }

  const torso = joint(body, "Torso", 0, 0);
  sphere(torso, [0.93, 0.86, 0.56], ceramic, 0, 0.57);
  sphere(torso, [0.64, 0.26, 0.45], graphite, 0, -0.23);
  sphere(torso, [0.61, 0.23, 0.43], ceramic, 0, -0.15, 0.07);
  for (const side of [-1, 1]) {
    sphere(torso, [0.045, 0.045, 0.025], inset, side * 0.59, 1.05, 0.39);
  }
  // The reference's chest emblem is geometry, including its emissive face.
  const bolt = new THREE.Shape();
  bolt.moveTo(0.12, 0.33);
  bolt.lineTo(-0.2, -0.04);
  bolt.lineTo(-0.015, -0.04);
  bolt.lineTo(-0.12, -0.34);
  bolt.lineTo(0.23, 0.08);
  bolt.lineTo(0.025, 0.08);
  bolt.closePath();
  const boltGeometry = new THREE.ExtrudeGeometry(bolt, {
    depth: 0.012,
    bevelEnabled: false,
  });
  const boltVertices = boltGeometry.getAttribute("position");
  for (let i = 0; i < boltVertices.count; i++) {
    const x = boltVertices.getX(i),
      y = boltVertices.getY(i) + 0.64;
    const shellZ =
      0.56 *
      Math.sqrt(Math.max(0, 1 - (x / 0.93) ** 2 - ((y - 0.57) / 0.86) ** 2));
    boltVertices.setZ(i, shellZ + 0.006 + boltVertices.getZ(i));
  }
  boltGeometry.computeVertexNormals();
  mesh(
    torso,
    boltGeometry,
    material(
      new THREE.MeshBasicMaterial({ color: 0x60d9ff, toneMapped: false }),
    ),
    0,
    0.64,
    0,
  );

  mesh(
    torso,
    new THREE.CylinderGeometry(0.27, 0.3, 0.24, 32),
    graphite,
    0,
    1.42,
  );
  const neckRing = ring(torso, 0.28, 0.035, cyan, 0, 1.48);
  neckRing.rotation.x = Math.PI / 2;

  const head = joint(torso, "Head", 0, 2.0);
  // Blend a set of volumes into one rounded cloud, then retain only the
  // generated surface. The heavy scalar field is discarded after construction.
  const field = new MarchingCubes(64, ceramic, false, false, 40000);
  field.reset();
  const lobes = [
    [-0.73, -0.07, 0, 0.37],
    [-0.52, 0.38, 0, 0.36],
    [0, 0.6, 0, 0.45],
    [0.52, 0.38, 0, 0.36],
    [0.73, -0.07, 0, 0.37],
    [0, -0.25, 0, 0.62],
  ];
  const resolution = field.resolution;
  for (let z = 0; z < resolution; z++)
    for (let y = 0; y < resolution; y++)
      for (let x = 0; x < resolution; x++) {
        const px = ((x / resolution) * 2 - 1) * 1.25,
          py = ((y / resolution) * 2 - 1) * 1.25,
          pz = ((z / resolution) * 2 - 1) * 1.25;
        let distance = 10;
        for (const [cx, cy, cz, radius] of lobes) {
          const next = Math.hypot(px - cx, py - cy, pz - cz) - radius;
          const blend = Math.max(0.08 - Math.abs(distance - next), 0) / 0.08;
          distance =
            Math.min(distance, next) - (blend * blend * blend * 0.08) / 6;
        }
        field.field[z * resolution * resolution + y * resolution + x] =
          field.isolation - distance * 100;
      }
  field.update();
  const cloudGeometry = new THREE.BufferGeometry();
  for (const attribute of ["position", "normal"]) {
    const source = field.geometry.getAttribute(attribute);
    cloudGeometry.setAttribute(
      attribute,
      new THREE.BufferAttribute(
        new Float32Array(source.array.slice(0, field.count * 3)),
        3,
      ),
    );
  }
  field.geometry.dispose();
  cloudGeometry.computeBoundingBox();
  const size = cloudGeometry.boundingBox!.getSize(new THREE.Vector3());
  const center = cloudGeometry.boundingBox!.getCenter(new THREE.Vector3());
  cloudGeometry.translate(-center.x, -center.y, -center.z);
  cloudGeometry.scale(3.45 / size.x, 2.6 / size.y, 1.95 / size.z);
  mesh(head, cloudGeometry, ceramic, 0, 0.3, -0.12);
  const face = joint(head, "Face", 0, 0, 0.35);
  rounded(face, [2.32, 1.5, 0.25], 0.58, ceramic, 0, 0.05, 0.45);
  rounded(face, [2.19, 1.36, 0.2], 0.52, graphite, 0, 0.05, 0.53);
  rounded(face, [2.06, 1.23, 0.13], 0.48, visor, 0, 0.05, 0.65);
  const eyes: THREE.Group[] = [];
  const pupils: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const eye = joint(
      face,
      side < 0 ? "Right eye" : "Left eye",
      side * 0.44,
      0.08,
      0.72,
    );
    eyes.push(eye);
    sphere(eye, [0.29, 0.31, 0.07], pupil);
    ring(eye, 0.27, 0.037, cyan, 0, 0, 0.045);
    ring(eye, 0.27, 0.007, whiteLight, 0, 0, 0.074);
    for (let i = 1; i <= 4; i++) {
      const glow = material(
        new THREE.MeshBasicMaterial({
          color: 0x13bfff,
          transparent: true,
          opacity: 0.1 / i,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      ring(eye, 0.27, 0.045 + i * 0.025, glow, 0, 0, 0.028);
    }
    const look = joint(eye, "Eye highlight", 0.1, 0.1, 0.087);
    pupils.push(look);
    sphere(look, [0.072, 0.083, 0.032], whiteLight);
    sphere(face, [0.115, 0.082, 0.028], blush, side * 0.77, -0.25, 0.715);
  }
  rounded(torso, [0.95, 0.95, 0.32], 0.15, inset, 0, 0.55, -0.47);
  rounded(torso, [0.72, 0.72, 0.28], 0.13, ceramic, 0, 0.6, -0.65);
  const thrusters: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const jet = mesh(
      torso,
      new THREE.CylinderGeometry(0.12, 0.2, 0.12, 24),
      cyan,
      side * 0.3,
      0.15,
      -0.65,
    );
    jet.rotation.x = 0.2;
    thrusters.push(jet);
  }

  function makeArm(side: number) {
    const shoulder = joint(
      torso,
      side > 0 ? "Left shoulder" : "Right shoulder",
      side * 1.0,
      0.97,
    );
    sphere(shoulder, [0.23, 0.23, 0.25], graphite);
    const shoulderLight = ring(shoulder, 0.232, 0.027, cyan, side * 0.1);
    shoulderLight.rotation.y = Math.PI / 2;
    sphere(shoulder, [0.36, 0.36, 0.35], ceramic, side * 0.09, -0.14);
    sphere(shoulder, [0.26, 0.36, 0.27], ceramic, 0, -0.36);
    const elbow = joint(shoulder, "Elbow", 0, -0.69);
    sphere(elbow, [0.185, 0.19, 0.2], graphite);
    rounded(elbow, [0.54, 0.56, 0.52], 0.24, ceramic, 0, -0.32);
    const wrist = joint(elbow, "Wrist", 0, -0.65, 0.025);
    sphere(wrist, [0.155, 0.15, 0.16], graphite);
    const wristLight = ring(wrist, 0.158, 0.023, cyan);
    wristLight.rotation.x = Math.PI / 2;
    const hand = joint(wrist, "Hand", 0, -0.2, 0.04);
    sphere(hand, [0.23, 0.2, 0.15], ceramic);
    sphere(hand, [0.19, 0.16, 0.07], graphite, 0, -0.02, -0.1);
    for (let i = 0; i < 4; i++) {
      const finger = joint(hand, "Finger", (i - 1.5) * 0.105, -0.16, 0.01);
      rounded(finger, [0.096, 0.16, 0.13], 0.047, graphite, 0, -0.05);
      sphere(
        finger,
        [0.054, 0.1 + (i === 1 || i === 2 ? 0.02 : 0), 0.065],
        ceramic,
        0,
        -0.18,
        0.018,
      );
    }
    const thumb = sphere(
      hand,
      [0.085, 0.13, 0.085],
      ceramic,
      -side * 0.26,
      -0.04,
      0.08,
    );
    thumb.rotation.z = -side * 0.48;
    return { shoulder, elbow, wrist, hand };
  }
  const leftArm = makeArm(1);
  const rightArm = makeArm(-1);

  function makeLeg(side: number) {
    const hip = joint(
      body,
      side > 0 ? "Left hip" : "Right hip",
      side * 0.47,
      -0.37,
    );
    sphere(hip, [0.225, 0.23, 0.24], graphite);
    sphere(hip, [0.3, 0.37, 0.3], ceramic, 0, -0.35);
    const knee = joint(hip, "Knee", 0, -0.78);
    sphere(knee, [0.22, 0.21, 0.235], graphite);
    sphere(knee, [0.24, 0.23, 0.1], ceramic, 0, 0, 0.18);
    ring(knee, 0.205, 0.018, cyan, 0, 0, 0.27);
    sphere(knee, [0.3, 0.34, 0.29], ceramic, 0, -0.34);
    const ankle = joint(knee, "Ankle", 0, -0.75);
    sphere(ankle, [0.19, 0.16, 0.21], graphite);
    const ankleLight = ring(ankle, 0.192, 0.025, cyan);
    ankleLight.rotation.x = Math.PI / 2;
    rounded(ankle, [0.88, 0.24, 1.16], 0.115, graphite, 0, -0.29, 0.22);
    rounded(ankle, [0.88, 0.07, 1.16], 0.035, inset, 0, -0.195, 0.22);
    sphere(ankle, [0.43, 0.28, 0.57], ceramic, 0, -0.12, 0.22);
    return { hip, knee, ankle };
  }
  const leftLeg = makeLeg(1);
  const rightLeg = makeLeg(-1);

  const shadowMaterial = material(
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uOpacity: { value: 0.26 } },
      vertexShader:
        "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
      fragmentShader:
        "varying vec2 vUv; uniform float uOpacity; void main(){float d=length((vUv-.5)*2.0);gl_FragColor=vec4(0.01,0.025,0.035,(1.0-smoothstep(.05,1.0,d))*uOpacity);}",
    }),
  );
  const shadow = mesh(
    root,
    new THREE.PlaneGeometry(3.6, 0.75),
    shadowMaterial,
    0,
    -2.85,
    -0.8,
  );
  shadow.rotation.x = -0.4;

  // Motion system: each joint is a spring with its own weight, so the head
  // leads, the torso follows, and arms and legs settle a beat later.
  const S = (value: number, frequency: number, damping = 1) =>
    new Spring(value, frequency, damping);
  const springs = {
    headYaw: S(0, 1.1, 0.9),
    headPitch: S(0, 1.1, 0.9),
    headRoll: S(0, 0.8),
    eyeX: S(0.08, 3.6, 0.8),
    eyeY: S(0.1, 3.6, 0.8),
    torsoYaw: S(0, 0.6),
    torsoRoll: S(0, 0.6),
    bodyPitch: S(0, 0.9),
    leftShoulderZ: S(0.34, 1.25, 0.72),
    leftShoulderX: S(-0.22, 1.1, 0.9),
    leftElbowZ: S(0.12, 1.6, 0.68),
    leftElbowX: S(-0.35, 1.3, 0.9),
    leftWristZ: S(0, 2.3, 0.6),
    leftHandY: S(0, 1.4),
    rightShoulderZ: S(-0.3, 1.25, 0.72),
    rightShoulderX: S(-0.2, 1.1, 0.9),
    rightElbowX: S(-0.4, 1.3, 0.9),
    leftHipX: S(0.16, 1, 0.8),
    rightHipX: S(-0.16, 1, 0.8),
    leftKneeX: S(-0.25, 1.15, 0.75),
    rightKneeX: S(-0.16, 1.15, 0.75),
    present: S(0, 0.85, 0.62),
    glow: S(0, 1),
  };
  type Joint = keyof typeof springs;
  const next = random(7);
  let lastPose: RobotPose = "hero";
  let poseTime = 0;
  let greetingFinished = false;
  let nextBlink = 2.2;
  let blinkStart = -10;
  let doubleBlink = false;
  let nextGlance = 3.4;
  let pointerIdle = 10;
  let lastChapter = -1;
  let chapterTime = 10;
  const glance = new THREE.Vector2();
  const lastPointer = new THREE.Vector2();
  const gaze = new THREE.Vector2();
  // Eyelids close quickly and open slowly, like a real blink.
  const lid = (elapsed: number) =>
    elapsed < 0 || elapsed > 0.24
      ? 1
      : elapsed < 0.07
        ? 1 - smooth(0, 0.07, elapsed) * 0.92
        : 0.08 + smooth(0.07, 0.24, elapsed) * 0.92;

  return {
    root,
    rig: {
      body,
      torso,
      head,
      eyes,
      pupils,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
    },
    setTheme(dark: boolean) {
      shadowMaterial.uniforms.uOpacity.value = dark ? 0.34 : 0.16;
    },
    update({
      time,
      delta,
      pose,
      pointer,
      walking,
      reduced,
      progress = 0.5,
      chapter = 0,
      flight = 0,
      celebration = 0,
    }: RobotMotion) {
      if (pose !== lastPose) {
        poseTime = 0;
        lastPose = pose;
      }
      poseTime += delta;
      const t = reduced ? 0 : time;
      const drive = (joint: Joint, target: number) =>
        reduced
          ? springs[joint].snap(target)
          : springs[joint].step(target, delta);

      // Gaze: follow the visitor's pointer; when it rests, glance around
      // naturally and come back. Larger glances bring a blink with them.
      if (!reduced) {
        if (pointer.distanceToSquared(lastPointer) > 1e-6) {
          pointerIdle = 0;
          lastPointer.copy(pointer);
        } else pointerIdle += delta;
        if (t >= nextGlance) {
          const previous = glance.clone();
          if (next() < 0.5) glance.set(0, 0);
          else glance.set((next() - 0.5) * 1.3, (next() - 0.6) * 0.6);
          nextGlance = t + 2.2 + next() * 3.2;
          if (previous.distanceTo(glance) > 0.45 && t - blinkStart > 1)
            blinkStart = t;
        }
        if (t >= nextBlink) {
          blinkStart = t;
          doubleBlink = next() < 0.18;
          nextBlink = t + 2.4 + next() * 3.4;
        }
      }
      if (pose === "present") {
        if (chapter !== lastChapter) {
          lastChapter = chapter;
          chapterTime = 0;
        }
        chapterTime += delta;
      } else lastChapter = -1;
      if (reduced) gaze.set(0, 0);
      else if (pointerIdle < 2.5) gaze.copy(pointer);
      else gaze.copy(glance);

      // A single, relaxed greeting: a small anticipation dip, an easy raise,
      // two unhurried waves with the wrist trailing, then the arm settles.
      const greeting =
        !reduced && pose === "hero" && !greetingFinished ? poseTime - 0.6 : -1;
      if (greeting > 3.2) greetingFinished = true;
      const greetOn = greeting >= -0.35 && !greetingFinished;
      const anticipation = greetOn
        ? smooth(-0.35, 0, greeting) * (1 - smooth(0, 0.3, greeting))
        : 0;
      const raise = greetOn
        ? smooth(0, 0.55, greeting) * (1 - smooth(2.3, 2.95, greeting))
        : 0;
      const waving = greetOn
        ? smooth(0.5, 0.85, greeting) * (1 - smooth(1.9, 2.4, greeting))
        : 0;
      const wavePhase = (greeting - 0.5) * Math.PI * 2 * 1.5;

      // Presenting: the open hand rises when a chapter settles, lowers
      // between chapters, and overshoots slightly like a real gesture.
      const edge = Math.min(
        smooth(0.03, 0.15, progress),
        1 - smooth(0.85, 0.97, progress),
      );
      const presentTarget =
        pose === "present"
          ? (reduced ? 1 : smooth(0.15, 0.5, chapterTime)) * edge
          : pose === "contact"
            ? 0.55
            : 0;
      const present = drive("present", presentTarget);
      if (pose === "present" && !reduced && pointerIdle >= 2.5)
        gaze.lerp(new THREE.Vector2(0.75, 0.05), present * 0.6);

      const flying = reduced ? 0 : Math.max(flight, celebration);
      const trail = reduced ? 0 : Math.min(1, walking);
      // Slow breathing (about 3.6 s) with a drifting layer on top.
      const breathPhase = t * Math.PI * 2 * 0.28;
      const breath = reduced ? 0 : Math.sin(breathPhase);
      const hover = reduced ? 0 : breath * 0.055 + drift(t * 0.6, 1) * 0.025;
      const follow = (lag: number) =>
        reduced ? 0 : Math.sin(breathPhase - lag);

      body.position.y = -0.66 + hover + flying * 0.12 - anticipation * 0.03;
      body.rotation.x = drive("bodyPitch", -flying * 0.2 - trail * 0.06);
      const headYaw = gaze.x * 0.4 + present * 0.1;
      torso.rotation.y = drive("torsoYaw", headYaw * 0.3);
      torso.rotation.z = drive(
        "torsoRoll",
        reduced ? 0 : drift(t * 0.45, 2) * 0.022,
      );
      torso.rotation.x = -breath * 0.015;
      head.rotation.y = drive("headYaw", headYaw);
      head.rotation.x = drive("headPitch", -gaze.y * 0.18 - flying * 0.14);
      head.rotation.z = drive(
        "headRoll",
        -present * 0.06 -
          raise * 0.08 +
          (reduced ? 0 : drift(t * 0.5, 3) * 0.035),
      );
      const blink = reduced
        ? 1
        : Math.min(
            lid(t - blinkStart),
            doubleBlink ? lid(t - blinkStart - 0.3) : 1,
          );
      eyes.forEach((eye) => {
        eye.scale.y = blink;
      });
      const eyeX = drive("eyeX", 0.08 + gaze.x * 0.105);
      const eyeY = drive("eyeY", 0.1 + gaze.y * 0.075);
      pupils.forEach((eye) => {
        eye.position.x = eyeX;
        eye.position.y = eyeY;
      });

      leftArm.shoulder.rotation.z = drive(
        "leftShoulderZ",
        0.34 +
          present * 0.95 +
          raise * 1.9 -
          anticipation * 0.12 +
          flying * 0.5 +
          follow(0.7) * 0.03,
      );
      leftArm.shoulder.rotation.x = drive(
        "leftShoulderX",
        -0.22 - flying * 0.75 - present * 0.15,
      );
      leftArm.elbow.rotation.z = drive(
        "leftElbowZ",
        0.12 +
          present * 0.5 +
          raise * 0.7 +
          waving * Math.sin(wavePhase) * 0.32,
      );
      leftArm.elbow.rotation.x = drive("leftElbowX", -0.35 - flying * 0.6);
      leftArm.wrist.rotation.z = drive(
        "leftWristZ",
        waving * Math.sin(wavePhase - 0.9) * 0.38 + present * 0.15,
      );
      leftArm.hand.rotation.y = drive("leftHandY", -present * 0.35);
      rightArm.shoulder.rotation.z = drive(
        "rightShoulderZ",
        -0.3 - flying * 0.55 - follow(0.7) * 0.03,
      );
      rightArm.shoulder.rotation.x = drive(
        "rightShoulderX",
        -0.2 - flying * 0.75,
      );
      rightArm.elbow.rotation.x = drive("rightElbowX", -0.4 - flying * 0.5);
      leftLeg.hip.rotation.x = drive(
        "leftHipX",
        0.16 + flying * 0.75 + trail * 0.25 + follow(1.1) * 0.03,
      );
      rightLeg.hip.rotation.x = drive(
        "rightHipX",
        -0.16 + flying * 0.4 + trail * 0.18 + follow(1.3) * 0.03,
      );
      leftLeg.knee.rotation.x = drive(
        "leftKneeX",
        -0.25 - flying * 1.25 - trail * 0.2,
      );
      rightLeg.knee.rotation.x = drive(
        "rightKneeX",
        -0.16 - flying * 0.95 - trail * 0.15,
      );
      leftLeg.hip.rotation.z = -0.1;
      rightLeg.hip.rotation.z = 0.14;
      shadow.visible = pose !== "hero" && flying < 0.05;
      const glow = drive("glow", flying * 0.7);
      cyan.emissiveIntensity = reduced
        ? 1.4
        : 1.45 + glow + Math.sin(t * Math.PI * 2 * 0.25) * 0.1;
      thrusters.forEach((jet) => (jet.scale.y = 1 + glow * 1.1));
    },
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((surface) => surface.dispose());
      root.removeFromParent();
    },
  };
}
