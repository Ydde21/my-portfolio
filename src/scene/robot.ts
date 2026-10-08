import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type RobotPose = "hero" | "present" | "quiet" | "contact";
export interface RobotMotion {
  time: number;
  delta: number;
  pose: RobotPose;
  pointer: THREE.Vector2;
  walking: number;
  progress?: number;
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

  let lastPose: RobotPose = "hero";
  let poseTime = 0;
  let greetingFinished = false;
  const damp = (current: number, target: number, dt: number) =>
    THREE.MathUtils.damp(current, target, 9, dt);

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
      flight = 0,
      celebration = 0,
    }: RobotMotion) {
      if (pose !== lastPose) {
        poseTime = 0;
        lastPose = pose;
      }
      poseTime += delta;
      const t = reduced ? 0 : time;
      const dt = reduced ? 1 : delta;
      const greet = !reduced && pose === "hero" && !greetingFinished;
      const wave = greet ? Math.sin(Math.PI * Math.min(1, poseTime / 3.5)) : 0;
      if (greet && poseTime > 3.5) greetingFinished = true;
      const flying = reduced ? 0 : Math.max(flight, celebration);
      const present =
        pose === "present"
          ? 0.8 + Math.sin(progress * Math.PI) * 0.55
          : pose === "contact"
            ? 0.65
            : 0;
      const hover = reduced ? 0 : Math.sin(t * 1.6);
      const stride = Math.sin(t * 8) * Math.min(1, walking);
      body.position.y = -0.66 + hover * 0.13 + flying * 0.16;
      body.rotation.x = damp(body.rotation.x, -flying * 0.22, dt);
      torso.rotation.z = reduced ? 0 : Math.sin(t * 0.8) * 0.055;
      head.rotation.y = damp(
        head.rotation.y,
        present * 0.2 + (reduced ? 0 : pointer.x * 0.24),
        dt,
      );
      head.rotation.x = damp(
        head.rotation.x,
        -flying * 0.16 + (reduced ? 0 : -pointer.y * 0.11),
        dt,
      );
      head.rotation.z = damp(
        head.rotation.z,
        -present * 0.06 + (reduced ? 0 : Math.sin(t * 0.8) * 0.06),
        dt,
      );
      const blinkTime = t % 4.9;
      const blink =
        !reduced && blinkTime > 4.48 && blinkTime < 4.82
          ? 1 - Math.sin(((blinkTime - 4.48) / 0.34) * Math.PI) * 0.95
          : 1;
      eyes.forEach((eye) => {
        eye.scale.y = blink;
      });
      pupils.forEach((eye) => {
        eye.position.x = 0.08 + (reduced ? 0 : pointer.x * 0.105);
        eye.position.y = 0.1 + (reduced ? 0 : pointer.y * 0.075);
      });
      leftArm.shoulder.rotation.z = damp(
        leftArm.shoulder.rotation.z,
        0.34 + present * 0.9 + wave * 1.5 + flying * 0.6,
        dt,
      );
      leftArm.shoulder.rotation.x = damp(
        leftArm.shoulder.rotation.x,
        -0.22 - flying * 0.8,
        dt,
      );
      leftArm.elbow.rotation.z = damp(
        leftArm.elbow.rotation.z,
        0.12 + present * 0.45 + wave * (0.8 + Math.sin(t * 9) * 0.3),
        dt,
      );
      leftArm.elbow.rotation.x = damp(
        leftArm.elbow.rotation.x,
        -0.35 - flying * 0.7,
        dt,
      );
      leftArm.wrist.rotation.z = wave * Math.sin(t * 9) * 0.3;
      leftArm.hand.rotation.y = -present * 0.3;
      rightArm.shoulder.rotation.z = damp(
        rightArm.shoulder.rotation.z,
        -0.3 - flying * 0.65 + (reduced ? 0 : Math.sin(t * 1.6) * 0.06),
        dt,
      );
      rightArm.shoulder.rotation.x = damp(
        rightArm.shoulder.rotation.x,
        -0.2 - flying * 0.8 - stride * 0.2,
        dt,
      );
      rightArm.elbow.rotation.x = damp(
        rightArm.elbow.rotation.x,
        -0.4 - flying * 0.55,
        dt,
      );
      leftLeg.hip.rotation.x = damp(
        leftLeg.hip.rotation.x,
        0.16 + flying * 0.8 + stride * 0.2,
        dt,
      );
      rightLeg.hip.rotation.x = damp(
        rightLeg.hip.rotation.x,
        -0.16 + flying * 0.4 - stride * 0.2,
        dt,
      );
      leftLeg.knee.rotation.x = damp(
        leftLeg.knee.rotation.x,
        -0.25 - flying * 1.2,
        dt,
      );
      rightLeg.knee.rotation.x = damp(
        rightLeg.knee.rotation.x,
        -0.16 - flying * 0.85,
        dt,
      );
      leftLeg.hip.rotation.z = -0.1;
      rightLeg.hip.rotation.z = 0.14;
      shadow.visible = pose !== "hero" && !flying;
      cyan.emissiveIntensity = reduced
        ? 1.4
        : 1.5 + flying * 0.8 + Math.sin(t * 1.5) * 0.12;
      thrusters.forEach((jet) => (jet.scale.y = 1 + flying * 4));
    },
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((surface) => surface.dispose());
      root.removeFromParent();
    },
  };
}
