import { useEffect, useRef, useState, type PointerEvent } from "react";
import { MoveUpRight, Rotate3D } from "lucide-react";

function rotate(amount: number) {
  window.dispatchEvent(new CustomEvent("robot-rotate", { detail: amount }));
}
export default function RobotInteraction() {
  const lastX = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const update = () =>
      setReady(document.documentElement.dataset.robotReady === "true");
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-robot-ready"],
    });
    update();
    return () => observer.disconnect();
  }, []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (lastX.current === null) return;
    rotate((event.clientX - lastX.current) * 0.012);
    lastX.current = event.clientX;
  };
  const release = () => {
    lastX.current = null;
    setDragging(false);
  };
  return (
    <div className="companion-space">
      <div
        className={`companion-touch ${dragging ? "is-dragging" : ""}`}
        role="group"
        aria-label="Interactive portfolio companion"
        tabIndex={ready ? 0 : -1}
        aria-disabled={!ready}
        onPointerDown={(event) => {
          if (!ready) return;
          lastX.current = event.clientX;
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={(event) => {
          if (!ready) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            rotate(event.key === "ArrowLeft" ? -0.3 : 0.3);
          }
        }}
      >
        <div
          data-robot-anchor
          data-robot-pose="hero"
          className="hero-robot"
          aria-hidden="true"
        >
          <picture className="robot-portrait">
            <source
              media="(max-width: 767px)"
              srcSet="/robot-preview-mobile.webp"
            />
            <img
              src="/robot-preview.webp"
              alt=""
              draggable={false}
              className="robot-fallback"
              width="920"
              height="1320"
              loading="eager"
            />
          </picture>
        </div>
      </div>
      <div className="companion-controls">
        <span>
          <MoveUpRight size={12} /> Drag to explore
        </span>
        <button
          disabled={!ready}
          onClick={() => window.dispatchEvent(new Event("robot-spin"))}
        >
          <Rotate3D size={15} />
          Take a spin
        </button>
      </div>
    </div>
  );
}
