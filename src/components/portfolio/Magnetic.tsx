import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Magnetic — a thin wrapper that lets a control lean toward the pointer.
 *
 * - The wrapper (never the child) is transformed, so link/button semantics,
 *   copy, and handlers are untouched.
 * - The pull is a fraction of the pointer's distance from the element center
 *   and the CSS transition does the smoothing, giving a weighted glide back.
 * - Mouse-only and disabled under reduced-motion; keyboard focus never moves.
 */
export default function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduceMotion = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${(dx * strength).toFixed(2)}px, ${(dy * strength).toFixed(2)}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <span
      ref={ref}
      className={cn("magnetic inline-block", className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onBlur={handleLeave}
    >
      {children}
    </span>
  );
}
