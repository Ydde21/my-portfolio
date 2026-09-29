import * as THREE from "three";
import type { Palette } from "./palette";

/**
 * Medusae — three luminous jellyfish drifting behind the hero.
 *
 * Each jelly is built in unit space (bell radius = 1) and scaled by the
 * group:
 *  - Bell: a hemisphere dome whose vertices pulse (contract → flare →
 *    ruffle the rim) and whose fragment shades a fresnel rim glow with
 *    a bright apex — the classic translucent-bell look.
 *  - Core: a small emissive-bright sphere inside the dome, plus a
 *    radial-gradient sprite halo for bloom.
 *  - Tentacles: thin ribbons hanging from the rim, displaced in the
 *    vertex shader by traveling sine waves whose amplitude grows toward
 *    the tip; alpha fades out along the length.
 *
 * Motion: a proper medusa swim cycle — a sharp power-stroke squeeze
 * followed by a long relaxed glide. Contraction fires a thrust impulse
 * into a velocity integrator (drag + a soft spring back to a slowly
 * wandering anchor), so the bells visibly swim, coast and settle; the
 * body leans into its own velocity and tentacle tips trail behind it
 * inertially. The swarm eases toward the pointer for parallax.
 *
 * Theme: luminous + additive on the dark page; slate + normal blending
 * in light mode so the silhouettes stay visible on off-white.
 *
 * Everything visual lives in `JELLIES` below — tweak, hot-reload.
 */

/* ============================ TWEAKABLES ============================ */

export const JELLIES = {
  /* -- The swarm — base world-space layout (landscape framing).
        pos is the bell's centre; scale multiplies unit-space size.  -- */
  LAYOUT: [
    { pos: [2.5, 1.75, -0.9], scale: 0.95, pulseHz: 0.24, phase: 0.0 },
    { pos: [-0.95, 0.1, 0.4], scale: 0.7, pulseHz: 0.29, phase: 2.1 },
    { pos: [1.5, -2.0, -0.3], scale: 0.58, pulseHz: 0.34, phase: 4.0 },
  ] as const,

  /* -- Swim cycle -----------------------------------------------------
     Asymmetric pulse: fraction of each stroke spent contracting, then
     a long recovery. Higher ATTACK = jerkier pumping. */
  ATTACK: 0.22,
  /** Bell contraction depth (0 = rigid dome). */
  PULSE_STRENGTH: 0.22,
  /** Stretch of the dome height while contracted. */
  PULSE_SQUASH: 0.2,
  /** Skirt flare as the bell recoils open. */
  FLARE: 0.07,
  /** Rim ruffle frequency (lobes around the bell edge). */
  RIM_LOBES: 8.0,
  RIM_RUFFLE: 0.06,

  /* -- Propulsion — velocity-integrated flight -------------------------
     Thrust fires along the bell's up-axis while the pulse contracts,
     water drag bleeds it off, and a soft spring keeps each jelly
     near a slowly wandering home point. */
  /** Impulse per unit contraction-rate — how hard a stroke kicks. */
  THRUST: 1.15,
  /** Speed cap (world units/s) — keeps strokes from compounding. */
  VMAX: 1.1,
  /** Water drag (1/s) — higher = shorter glides. */
  DRAG: 1.7,
  /** Spring back toward the home anchor (1/s²). */
  ANCHOR_K: 1.5,
  /** Fraction of thrust sent along the heading (forward swim). */
  FORWARD: 0.3,
  /** Home-anchor wander amplitude (x,y,z world units). */
  WANDER: [0.6, 0.42, 0.45],
  /** Wander angular rates (rad/s). */
  WANDER_W: [0.055, 0.042, 0.05],
  /** Lean into velocity (rad per unit speed) + cap. */
  LEAN: 0.55,
  LEAN_MAX: 0.55,
  /** Heading turn rate toward travel direction (1/s) + idle sway. */
  TURN: 1.6,
  HEADING_SWAY: 0.1,
  /** Seconds for the load-in rise/fade. */
  INTRO: 2.4,

  /* -- Tentacles -------------------------------------------------------- */
  /** Whip tentacles around the rim, per jelly. */
  TENTACLES: 11,
  /** Broader oral arms hanging from the centre, per jelly. */
  ORAL_ARMS: 3,
  /** Tentacle length × bell radius. */
  TENTACLE_LEN: 3.1,
  ORAL_LEN: 2.3,
  /** Sideways wave amplitude at the tip × bell radius. */
  TENTACLE_WAVE: 0.5,
  /** Wave frequency along the length (higher = tighter curls). */
  TENTACLE_FREQ: 6.5,
  TENTACLE_SPEED: 1.35,

  /* -- Look ------------------------------------------------------------ */
  COLORS: {
    dark: { rim: "#AFDDFF", core: "#EFF8FF", tentacle: "#BFE4FF" },
    light: { rim: "#55677A", core: "#8FA3B6", tentacle: "#5B6B7C" },
  } as const,
  /** Master opacity multipliers. */
  BELL_ALPHA: 0.75,
  TENTACLE_ALPHA: 0.7,
  /** Halo sprite scale × bell radius, and its opacity. */
  HALO_SCALE: 3.4,
  HALO_ALPHA_DARK: 0.5,
  HALO_ALPHA_LIGHT: 0.16,

  /* -- Interaction ------------------------------------------------------ */
  /** Swarm parallax toward the pointer (world units). */
  POINTER_PARALLAX: 0.4,
  POINTER_TILT: 0.07,
} as const;

/* =========================== END TWEAKABLES ========================== */

const BELL_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uPulse;
  uniform float uLobes;
  uniform float uRuffle;
  uniform float uSquash;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vRim;   /* 0 at apex → 1 at rim */
  varying float vAng;   /* azimuth — drives the petal striations */

  void main() {
    vec3 p = position;
    float ang = atan(p.x, p.z);
    /* uv.y is 1 at the apex and 0 at the rim for SphereGeometry caps */
    float rim = 1.0 - uv.y;

    /* Contraction squeezes the diameter and lengthens the dome —
       jellyfish jet propulsion. */
    float pulse = uPulse * ${JELLIES.PULSE_STRENGTH.toFixed(3)};
    p.xz *= 1.0 - pulse * 0.9;
    p.y *= 1.0 + uSquash * uPulse;

    float edge = smoothstep(0.55, 1.0, rim);
    /* Skirt recoils outward as the bell relaxes open. */
    p.xz *= 1.0 + (1.0 - uPulse) * ${JELLIES.FLARE.toFixed(3)} * edge;

    /* Traveling ripple + ruffled rim — energy peaks with the stroke. */
    float energy = 0.5 + uPulse * 1.2;
    p.xz *= 1.0 + sin(ang * 6.0 - uTime * 2.4 + uPhase) * 0.03 * rim * energy;
    p.y += sin(ang * uLobes + uTime * 2.2 + uPhase) * uRuffle * edge * energy;
    p.xz *= 1.0 + sin(ang * uLobes - uTime * 2.6 + uPhase) * 0.035 * edge * energy;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = -mv.xyz;
    vRim = rim;
    vAng = ang;
    gl_Position = projectionMatrix * mv;
  }
`;

const BELL_FRAGMENT = /* glsl */ `
  uniform vec3 uRim;
  uniform vec3 uCore;
  uniform float uAlpha;
  uniform float uPulse;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vRim;
  varying float vAng;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    /* Fresnel — bright silhouette edge, translucent face. */
    float fres = pow(1.0 - abs(dot(n, v)), 2.6);
    /* Interior brightness toward the apex where the core sits. */
    float apex = smoothstep(0.85, 0.0, vRim) * (0.75 + uPulse * 0.5);
    /* Radial ribs — the petal-like striations of a real bell. */
    float ribs = 0.7 + 0.45 * sin(vAng * 20.0) + 0.15 * sin(vAng * 7.0);
    vec3 col =
      uRim * fres * ribs * 1.6 + uCore * apex * 0.35 + uRim * 0.03;
    float a =
      clamp(fres * ribs * 0.7 + apex * 0.2 + 0.015, 0.0, 1.0) * uAlpha;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

const TENTACLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uSpeed;
  uniform float uFreq;
  uniform float uAmp;
  uniform float uPulse;
  /* Body velocity in jelly-local space — the tips trail it inertially. */
  uniform vec3 uVel;
  varying vec2 vUv;

  void main() {
    vec3 p = position;
    /* uv.y = 1 at the bell attachment, 0 at the tip */
    float t = 1.0 - uv.y;
    float grow = t * t;

    /* Inertial trail: rising jets drag the strands straight down,
       sinking lets them slacken and billow. */
    float lag = clamp(uVel.y * 0.55, -0.45, 1.2);
    float billow = 1.0 - clamp(lag, 0.0, 1.0) * 0.4
                   + clamp(-lag, 0.0, 0.6) * 0.5;
    p.xz -= uVel.xz * 1.1 * grow;
    p.y -= lag * 0.28 * grow;

    /* Traveling wave — kicked by each stroke, calmer while streamed. */
    float lively = (0.55 + uPulse * 0.85) * billow;
    p.x += sin(uTime * uSpeed + t * uFreq + uPhase) * uAmp * grow * lively;
    p.z += cos(uTime * uSpeed * 0.83 + t * uFreq * 0.9 + uPhase * 1.7) *
           uAmp * 0.85 * grow * lively;
    /* Whole-strand slow sway, felt most near the tip. */
    p.x += sin(uTime * 0.4 + uPhase) * uAmp * 0.4 * t * billow;
    /* Contraction fans the skirt outward. */
    p.xz *= 1.0 + uPulse * 0.35 * grow;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const TENTACLE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying vec2 vUv;

  void main() {
    float edge = sin(3.14159 * vUv.x);          /* soften ribbon edges */
    float a = pow(vUv.y, 1.6) * edge * uAlpha;  /* fade toward the tip */
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

function makeHaloTexture(): THREE.CanvasTexture {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,0.85)");
  g.addColorStop(0.35, "rgba(200,230,255,0.28)");
  g.addColorStop(1, "rgba(200,230,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface JellyfishHandles {
  update(dt: number): void;
  /** Pre-roll the sim so a reduced-motion still shows a mature pose. */
  warm(seconds: number): void;
  setPointerTarget(x: number, y: number): void;
  setTheme(palette: Palette, immediate?: boolean): void;
  setAspect(aspect: number): void;
  dispose(): void;
}

interface JellyRef {
  group: THREE.Group;
  base: THREE.Vector3;
  pulseHz: number;
  phase: number;
  heading: number;
  bellMat: THREE.ShaderMaterial;
  coreMat: THREE.SpriteMaterial;
  core: THREE.Sprite;
  haloMat: THREE.SpriteMaterial;
  tentacleMats: THREE.ShaderMaterial[];
  /* Swim sim state — integrated, never snapped. */
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  prevPulse: number;
}

export function buildJellyfish(
  scene: THREE.Scene,
  options: { palette: Palette; aspect: number },
): JellyfishHandles {
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(r: T): T => {
    disposables.push(r);
    return r;
  };

  const hsl = { h: 0, s: 0, l: 0 };
  const isDark = (p: Palette) => p.background.getHSL(hsl).l < 0.5;

  const swarm = new THREE.Group();
  scene.add(swarm);

  /* Theme state — colours ease toward targets every frame. */
  let darkTarget = isDark(options.palette) ? 1 : 0;
  let dark = darkTarget;
  const cRim = new THREE.Color(JELLIES.COLORS.dark.rim);
  const cCore = new THREE.Color(JELLIES.COLORS.dark.core);
  const cTent = new THREE.Color(JELLIES.COLORS.dark.tentacle);
  const cRimT = cRim.clone();
  const cCoreT = cCore.clone();
  const cTentT = cTent.clone();
  const blendMats: THREE.Material[] = []; // swapped additive ↔ normal
  const haloTex = track(makeHaloTexture());
  const jellies: JellyRef[] = [];

  /* Deterministic pseudo-random — identical swarm every visit. */
  let seed = 41;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (const cfg of JELLIES.LAYOUT) {
    const group = new THREE.Group();
    group.position.fromArray(cfg.pos);
    group.scale.setScalar(cfg.scale);
    swarm.add(group);

    /* ---- Bell ---- */
    const bellMat = track(
      new THREE.ShaderMaterial({
        vertexShader: BELL_VERTEX,
        fragmentShader: BELL_FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uPhase: { value: cfg.phase },
          uPulse: { value: 0 },
          uLobes: { value: JELLIES.RIM_LOBES },
          uRuffle: { value: JELLIES.RIM_RUFFLE },
          uSquash: { value: JELLIES.PULSE_SQUASH },
          uRim: { value: cRim.clone() },
          uCore: { value: cCore.clone() },
          uAlpha: { value: JELLIES.BELL_ALPHA },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    blendMats.push(bellMat);
    const bellGeo = track(
      new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.72),
    );
    const bell = new THREE.Mesh(bellGeo, bellMat);
    bell.scale.y = 0.8; // flatter skirt, less balloon
    bell.frustumCulled = false;
    group.add(bell);

    /* ---- Core — a soft luminous heart (sprite, not a hard sphere) ---- */
    const coreMat = track(
      new THREE.SpriteMaterial({
        map: haloTex,
        color: cCore.clone(),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    blendMats.push(coreMat);
    const core = new THREE.Sprite(coreMat);
    core.scale.set(0.85, 0.6, 1);
    core.position.y = 0.42;
    group.add(core);

    /* ---- Halo — soft bloom behind the whole bell ---- */
    const haloMat = track(
      new THREE.SpriteMaterial({
        map: haloTex,
        color: cRim.clone(),
        transparent: true,
        opacity: JELLIES.HALO_ALPHA_DARK,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    blendMats.push(haloMat);
    const halo = new THREE.Sprite(haloMat);
    halo.scale.setScalar(JELLIES.HALO_SCALE);
    halo.position.y = 0.35;
    group.add(halo);

    /* ---- Tentacles ---- */
    const tentacleMats: THREE.ShaderMaterial[] = [];
    const ribbons = JELLIES.TENTACLES + JELLIES.ORAL_ARMS;
    for (let i = 0; i < ribbons; i++) {
      const isArm = i >= JELLIES.TENTACLES;
      const len = isArm ? JELLIES.ORAL_LEN : JELLIES.TENTACLE_LEN;
      const width = isArm ? 0.055 : 0.016;
      const geo = track(new THREE.PlaneGeometry(width, len, 1, 48));
      geo.translate(0, -len / 2, 0); // hang downward from the attach point
      const mat = track(
        new THREE.ShaderMaterial({
          vertexShader: TENTACLE_VERTEX,
          fragmentShader: TENTACLE_FRAGMENT,
          uniforms: {
            uTime: { value: 0 },
            uPhase: { value: rand() * Math.PI * 2 },
            uSpeed: {
              value: JELLIES.TENTACLE_SPEED * (0.85 + rand() * 0.4),
            },
            uFreq: {
              value: JELLIES.TENTACLE_FREQ * (0.9 + rand() * 0.3),
            },
            uAmp: {
              value: JELLIES.TENTACLE_WAVE * (isArm ? 0.55 : 1),
            },
            uPulse: { value: 0 },
            uVel: { value: new THREE.Vector3() },
            uColor: { value: cTent.clone() },
            uAlpha: {
              value: JELLIES.TENTACLE_ALPHA * (isArm ? 1.3 : 1),
            },
          },
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        }),
      );
      mat.userData.baseAlpha = mat.uniforms.uAlpha.value as number;
      blendMats.push(mat);
      tentacleMats.push(mat);
      const ribbon = new THREE.Mesh(geo, mat);
      ribbon.frustumCulled = false;
      if (isArm) {
        ribbon.position.set((rand() - 0.5) * 0.2, -0.05, (rand() - 0.5) * 0.2);
      } else {
        const a = (i / JELLIES.TENTACLES) * Math.PI * 2 + rand() * 0.4;
        const r = 0.55 + rand() * 0.3;
        ribbon.position.set(Math.cos(a) * r, -0.05, Math.sin(a) * r);
        ribbon.rotation.y = rand() * Math.PI;
      }
      group.add(ribbon);
    }

    jellies.push({
      group,
      base: new THREE.Vector3().fromArray(cfg.pos),
      pulseHz: cfg.pulseHz,
      phase: cfg.phase,
      heading: rand() * Math.PI * 2,
      bellMat,
      coreMat,
      core,
      haloMat,
      tentacleMats,
      pos: new THREE.Vector3().fromArray(cfg.pos),
      vel: new THREE.Vector3(),
      prevPulse: 0,
    });
  }

  /* ---------------- Sim state ---------------- */
  let simTime = 0;
  let intro = 0;
  let portraitLift = 0;
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  let pointerLive = false;

  /* Scratch objects — the hot loop allocates nothing. */
  const anchor = new THREE.Vector3();
  const swimDir = new THREE.Vector3();
  const localVel = new THREE.Vector3();
  const tiltAxis = new THREE.Vector3();
  const qYaw = new THREE.Quaternion();
  const qTilt = new THREE.Quaternion();
  const qRoll = new THREE.Quaternion();
  const invQ = new THREE.Quaternion();
  const UP = new THREE.Vector3(0, 1, 0);
  const FWD = new THREE.Vector3(0, 0, 1);

  const smooth01 = (v: number) => {
    const c = Math.min(1, Math.max(0, v));
    return c * c * (3 - 2 * c);
  };

  /* Asymmetric stroke: fast contraction (~ATTACK of the cycle), then a
     long eased recovery — the pulse shape real medusae swim with. */
  const stroke = (u: number) => {
    const a = JELLIES.ATTACK;
    if (u < a) {
      const x = u / a;
      return 1 - (1 - x) * (1 - x) * (1 - x); // ease-out cubic
    }
    return 1 - smooth01(Math.min(1, (u - a) / (1 - a)));
  };

  const applyBlending = () => {
    const blending =
      dark > 0.5 ? THREE.AdditiveBlending : THREE.NormalBlending;
    for (const m of blendMats) {
      if (m.blending !== blending) {
        m.blending = blending;
        m.needsUpdate = true;
      }
    }
  };

  const update = (dt: number) => {
    simTime += dt;
    intro += dt;
    const t = simTime;

    /* Theme easing. */
    const tk = 1 - Math.exp(-3.5 * dt);
    dark += (darkTarget - dark) * tk;
    cRim.lerp(cRimT, tk);
    cCore.lerp(cCoreT, tk);
    cTent.lerp(cTentT, tk);
    applyBlending();
    const haloA =
      JELLIES.HALO_ALPHA_DARK +
      (JELLIES.HALO_ALPHA_LIGHT - JELLIES.HALO_ALPHA_DARK) * (1 - dark);

    /* Pointer parallax — eased, never snapping. */
    if (pointerLive) {
      const pk = 1 - Math.exp(-2.5 * dt);
      pointer.x += (pointer.tx - pointer.x) * pk;
      pointer.y += (pointer.ty - pointer.y) * pk;
    }
    swarm.position.set(
      pointer.x * JELLIES.POINTER_PARALLAX,
      pointer.y * JELLIES.POINTER_PARALLAX * 0.6 + portraitLift,
      0,
    );
    swarm.rotation.y = pointer.x * JELLIES.POINTER_TILT;
    swarm.rotation.x = -pointer.y * JELLIES.POINTER_TILT * 0.5;

    /* Load-in — the swarm rises and fades in over INTRO seconds. */
    const introE = smooth01(Math.min(1, intro / JELLIES.INTRO));

    for (const j of jellies) {
      /* Stroke phase 0→1 per cycle; contraction rate drives thrust. */
      const cyc =
        ((t * j.pulseHz + j.phase / (Math.PI * 2)) % 1 + 1) % 1;
      const pulse = stroke(cyc);
      const dPulse = dt > 0 ? (pulse - j.prevPulse) / dt : 0;
      j.prevPulse = pulse;

      /* Thrust along the bell's tilted up-axis (plus a little along
         its forward) — only while squeezing. The bell's own lean
         feeds the direction, so successive strokes trace arcs. */
      swimDir
        .copy(UP)
        .applyQuaternion(j.group.quaternion)
        .multiplyScalar(1 - JELLIES.FORWARD);
      tiltAxis
        .copy(FWD)
        .applyQuaternion(j.group.quaternion)
        .multiplyScalar(JELLIES.FORWARD);
      j.vel.addScaledVector(
        swimDir.add(tiltAxis).normalize(),
        Math.max(0, dPulse) * JELLIES.THRUST * dt,
      );

      /* Home anchor wanders on a slow lissajous; spring+drag integrate. */
      anchor.set(
        j.base.x +
          Math.sin(t * JELLIES.WANDER_W[0] + j.phase) * JELLIES.WANDER[0],
        j.base.y +
          Math.sin(t * JELLIES.WANDER_W[1] + j.phase * 1.3) *
            JELLIES.WANDER[1],
        j.base.z +
          Math.cos(t * JELLIES.WANDER_W[2] + j.phase * 0.7) *
            JELLIES.WANDER[2],
      );
      j.vel.addScaledVector(anchor.sub(j.pos), JELLIES.ANCHOR_K * dt);
      j.vel.multiplyScalar(Math.exp(-JELLIES.DRAG * dt));
      j.vel.clampLength(0, JELLIES.VMAX);
      j.pos.addScaledVector(j.vel, dt);

      /* Heading drifts toward the direction of travel. */
      const hv = Math.hypot(j.vel.x, j.vel.z);
      if (hv > 0.02) {
        let d = Math.atan2(j.vel.x, j.vel.z) - j.heading;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        j.heading += d * Math.min(1, JELLIES.TURN * dt);
      }
      j.heading += Math.sin(t * 0.09 + j.phase * 2) * JELLIES.HEADING_SWAY * dt;

      /* Orientation: lean the up-axis toward world-space velocity
         (capped by clamping the lean vector), yawed by heading, with
         a small stroke-synced roll on top. */
      swimDir
        .copy(j.vel)
        .setY(0)
        .multiplyScalar(JELLIES.LEAN)
        .clampLength(0, Math.tan(JELLIES.LEAN_MAX));
      tiltAxis.copy(UP).add(swimDir).normalize();
      qTilt.setFromUnitVectors(UP, tiltAxis);
      qYaw.setFromAxisAngle(UP, j.heading * 0.35);
      qRoll.setFromAxisAngle(
        FWD,
        Math.sin(t * 0.7 + j.phase) * 0.04 + pulse * 0.05,
      );
      j.group.quaternion
        .copy(qTilt)
        .multiply(qYaw)
        .multiply(qRoll);

      /* Intro rise — jellies ascend into place on load. */
      j.group.position.copy(j.pos);
      j.group.position.y -= (1 - introE) * 1.4;

      /* Shader uniforms. */
      j.bellMat.uniforms.uTime.value = t;
      j.bellMat.uniforms.uPulse.value = pulse;
      j.bellMat.uniforms.uRim.value.copy(cRim);
      j.bellMat.uniforms.uCore.value.copy(cCore);
      j.bellMat.uniforms.uAlpha.value = JELLIES.BELL_ALPHA * introE;
      localVel
        .copy(j.vel)
        .applyQuaternion(invQ.copy(j.group.quaternion).invert());
      for (const m of j.tentacleMats) {
        m.uniforms.uTime.value = t;
        m.uniforms.uPulse.value = pulse;
        (m.uniforms.uVel.value as THREE.Vector3).copy(localVel);
        m.uniforms.uColor.value.copy(cTent);
        m.uniforms.uAlpha.value =
          (m.userData.baseAlpha as number) * introE;
      }

      /* Halo follows theme opacity; core breathes with the stroke. */
      j.haloMat.opacity = haloA * (0.75 + pulse * 0.5) * introE;
      j.coreMat.opacity = 0.9 * introE;
      j.core.scale.set(
        0.85 * (1 + pulse * 0.28),
        0.6 * (1 + pulse * 0.18),
        1,
      );
    }
  };

  const frameSwarm = (a: number) => {
    /* Portrait: shrink and lift the swarm so it clears the type. */
    swarm.scale.setScalar(Math.min(1, Math.max(0.55, a * 1.05)));
    portraitLift = a < 0.9 ? 0.5 : 0;
  };
  frameSwarm(options.aspect);

  return {
    update,

    warm(seconds) {
      const step = 1 / 15;
      for (let i = 0; i < seconds / step; i++) update(step);
    },

    setPointerTarget(x, y) {
      pointer.tx = x;
      pointer.ty = y;
      if (!pointerLive) {
        pointerLive = true;
        pointer.x = x;
        pointer.y = y;
      }
    },

    setTheme(palette, immediate = false) {
      darkTarget = isDark(palette) ? 1 : 0;
      const key = darkTarget > 0.5 ? JELLIES.COLORS.dark : JELLIES.COLORS.light;
      cRimT.set(key.rim);
      cCoreT.set(key.core);
      cTentT.set(key.tentacle);
      if (immediate) {
        dark = darkTarget;
        cRim.copy(cRimT);
        cCore.copy(cCoreT);
        cTent.copy(cTentT);
        applyBlending();
      }
    },

    setAspect(a) {
      frameSwarm(a);
    },

    dispose() {
      disposables.forEach((d) => d.dispose());
      scene.remove(swarm);
    },
  };
}
