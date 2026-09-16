import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

/**
 * Interactive extruded "EC" monogram.
 * - Renders only while visible (parent gates it with IntersectionObserver).
 * - Pointer drag rotates; inertial spin settles back to a slow idle rotation.
 * - Respects prefers-reduced-motion via parent fallback; no autoplay here.
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = () => mount.clientWidth || 1;
    const height = () => mount.clientHeight || 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width(), height());
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width() / height(), 0.1, 100);
    camera.position.set(0, 0, 7.2);

    /* Material palette: ink letters on paper, warm rim light */
    const ink = new THREE.MeshStandardMaterial({
      color: new THREE.Color("hsl(24, 10%, 14%)"),
      roughness: 0.42,
      metalness: 0.15,
    });
    const ember = new THREE.MeshStandardMaterial({
      color: new THREE.Color("hsl(16, 75%, 52%)"),
      roughness: 0.35,
      metalness: 0.25,
    });

    /* Load the EC shapes from a typeface.json font, then build extrusions.
       FontLoader only parses typeface.json (not ttf/woff), so use the
       three.js example font. A procedural fallback covers offline/CDN failure. */
    let group: THREE.Group | null = null;
    const disposeFns: Array<() => void> = [];

    function buildFallback() {
      if (group) return;
      group = new THREE.Group();
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.85, 0.28, 140, 20),
        ink,
      );
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.07, 16, 90), ember);
      ring.rotation.x = Math.PI / 2.4;
      group.add(knot, ring);
      group.position.y = -0.1;
      scene.add(group);
      disposeFns.push(() => {
        knot.geometry.dispose();
        ring.geometry.dispose();
      });
    }

    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://unpkg.com/three@0.169.0/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const shapesE = font.generateShapes("E", 2.1);
        const shapesC = font.generateShapes("C", 2.1);

        const geoE = new THREE.ExtrudeGeometry(shapesE, {
          depth: 0.55,
          bevelEnabled: true,
          bevelThickness: 0.06,
          bevelSize: 0.05,
          bevelSegments: 3,
          curveSegments: 8,
        });
        geoE.center();

        const geoC = new THREE.ExtrudeGeometry(shapesC, {
          depth: 0.55,
          bevelEnabled: true,
          bevelThickness: 0.06,
          bevelSize: 0.05,
          bevelSegments: 3,
          curveSegments: 10,
        });
        geoC.center();

        const meshE = new THREE.Mesh(geoE, ink);
        const meshC = new THREE.Mesh(geoC, ember);
        meshE.position.x = -1.45;
        meshC.position.x = 1.45;

        group = new THREE.Group();
        group.add(meshE, meshC);
        group.position.y = -0.1;
        scene.add(group);

        disposeFns.push(() => {
          geoE.dispose();
          geoC.dispose();
        });
      },
      undefined,
      () => {
        /* Font CDN unreachable: render the procedural fallback instead of blank */
        buildFallback();
      },
    );

    /* Lighting: soft key + warm rim so the extrusion reads as 3D on paper */
    const hemi = new THREE.HemisphereLight(0xffffff, 0xd8cfc2, 1.1);
    hemi.position.set(0, 4, 6);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 5, 6);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xff8a5c, 0.7);
    rim.position.set(-5, -2, 4);
    scene.add(rim);

    /* Pointer drag -> rotation with inertia */
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0.0;
    let velocityY = 0.0;
    let rotationX = 0;
    let rotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      velocityY = (e.clientX - lastX) * 0.0045;
      velocityX = (e.clientY - lastY) * 0.0035;
      rotationY += velocityY;
      rotationX += velocityX;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };

    const el = renderer.domElement;
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    /* Render loop: idle spin + inertial decay.
       Paused when the tab is hidden OR the hero is scrolled out of view. */
    let raf = 0;
    let tabVisible = true;
    let inView = true;
    const IDLE = 0.0032;

    const tick = () => {
      if (!tabVisible || !inView) return;
      raf = requestAnimationFrame(tick);

      if (group) {
        if (!isDragging) {
          velocityX *= 0.94;
          velocityY *= 0.94;
          rotationY += IDLE + velocityY;
          rotationX += velocityX;
          rotationX = Math.max(-0.7, Math.min(0.7, rotationX));
          group.rotation.y = rotationY;
          group.rotation.x = rotationX;
        } else {
          group.rotation.y = rotationY;
          group.rotation.x = Math.min(0.7, Math.max(-0.7, rotationX));
        }
      }

      renderer.render(scene, camera);
    };
    tick();

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      if (tabVisible && inView) tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && tabVisible) tick();
      },
      { threshold: 0 },
    );
    viewObserver.observe(mount);

    const resize = () => {
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      renderer.setSize(width(), height());
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    return () => {
      tabVisible = false;
      inView = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      viewObserver.disconnect();
      resizeObserver.disconnect();
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      disposeFns.forEach((fn) => fn());
      ink.dispose();
      ember.dispose();
      hemi.dispose();
      key.dispose();
      rim.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
}
