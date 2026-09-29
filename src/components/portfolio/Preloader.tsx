import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const WIPE_EASE = [0.76, 0, 0.24, 1] as const;

const MIN_HOLD_MS = 900; // title card is never faster than a beat
const HARD_CAP_MS = 2500; // content is never gated longer than ~2.5s

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const windowLoaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((resolve) =>
        window.addEventListener("load", () => resolve(), { once: true }),
      );

/**
 * Preloader — a minimal title card with a real readiness gate.
 *
 * The panel stays up until fonts are loaded, the window has finished
 * loading, and a ~900ms minimum hold has elapsed — whichever resolves
 * last. A hard cap of ~2.5s guarantees the page is never held hostage.
 * A thin accent hairline + a mono counter report progress honestly:
 * they ease toward ~90% while waiting and snap to 100% on release,
 * then the whole card wipes upward to hand off to the hero.
 *
 * - Skipped entirely under prefers-reduced-motion.
 * - Scroll is locked only while the card is on screen.
 * - aria-hidden: it is presentation, the real content is in the DOM.
 */
export default function Preloader() {
  const reduceMotion = useReducedMotion() ?? false;
  const [visible, setVisible] = useState(() => !prefersReduced());
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false);

  /* Honest progress: eases toward 88% while the gate is open, then
     snaps to 100 the moment readiness resolves. */
  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) =>
    String(Math.round(v)).padStart(3, "0"),
  );
  const hairline = useTransform(progress, (v) => v / 100);

  /* The gate: fonts + window load + minimum hold, with a hard cap. */
  useEffect(() => {
    if (!visible || reduceMotion) return;
    let alive = true;
    const fonts =
      typeof document.fonts?.ready?.then === "function"
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve();
    const minHold = new Promise<void>((r) => setTimeout(r, MIN_HOLD_MS));

    Promise.all([fonts, windowLoaded(), minHold]).then(() => {
      if (alive) setReady(true);
    });
    const cap = window.setTimeout(() => {
      if (alive) setReady(true);
    }, HARD_CAP_MS);
    return () => {
      alive = false;
      window.clearTimeout(cap);
    };
  }, [visible, reduceMotion]);

  /* Drive the readout. */
  useEffect(() => {
    if (!visible || reduceMotion) return;
    const controls = animate(progress, ready ? 100 : 88, {
      duration: ready ? 0.3 : (HARD_CAP_MS - 400) / 1000,
      ease: ready ? EASE : [0.3, 0.6, 0.4, 1],
    });
    return () => controls.stop();
  }, [ready, visible, reduceMotion, progress]);

  /* Release: wipe once ready. */
  useEffect(() => {
    if (ready && !leaving) setLeaving(true);
  }, [ready, leaving]);

  /* Absolute kill switch — the card can never outlive the cap + wipe,
     even if an animation completion callback is missed. */
  useEffect(() => {
    if (!visible || reduceMotion) return;
    const kill = window.setTimeout(
      () => setVisible(false),
      HARD_CAP_MS + 1100,
    );
    return () => window.clearTimeout(kill);
  }, [visible, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) setVisible(false);
  }, [reduceMotion]);

  /* Scroll lock lasts exactly as long as the card is on screen. */
  useEffect(() => {
    if (!visible) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[140] flex flex-col justify-between bg-background px-5 py-8 sm:px-10"
      initial={{ y: "0%" }}
      animate={{ y: leaving ? "-100%" : "0%" }}
      transition={{ duration: 0.85, ease: WIPE_EASE }}
      onAnimationComplete={() => {
        if (leaving) setVisible(false);
      }}
      aria-hidden="true"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <motion.p
          className="meta-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          EC — Portfolio
        </motion.p>
        <motion.p
          className="meta-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <motion.span>{counter}</motion.span>
          <span aria-hidden="true"> / 100</span>
        </motion.p>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[clamp(2.6rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
            initial={{ y: "112%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            EDDY CASAS
          </motion.h1>
        </div>

        {/* Readiness hairline — scaleX only, driven by the real gate */}
        <div
          className="mt-8 h-px w-full max-w-md bg-border"
          role="presentation"
        >
          <motion.div
            className="h-full w-full origin-left bg-accent"
            style={{ scaleX: hairline }}
          />
        </div>

        <motion.p
          className="meta-label mt-6 !text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        >
          Software Developer
        </motion.p>
      </div>

      <div className="mx-auto flex w-full max-w-6xl items-end justify-between">
        <motion.p
          className="meta-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          Bacolod City, PH
        </motion.p>
        <motion.p
          className="meta-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          MMXXVI
        </motion.p>
      </div>
    </motion.div>
  );
}
