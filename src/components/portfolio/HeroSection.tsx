import { Suspense, lazy } from "react";
import { motion, useReducedMotion } from "framer-motion";

const HeroCanvas = lazy(() => import("./HeroCanvas"));

/* Fade-up used for the load sequence; short and restrained on purpose */
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-24 pt-28 sm:pt-32"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: editorial intro */}
        <div>
          <motion.p
            className="section-index"
            variants={rise}
            custom={0}
            initial="hidden"
            animate="show"
          >
            Eddy Casas — Full Stack Developer
          </motion.p>

          <motion.h1
            className="font-display mt-6 max-w-xl text-[2.75rem] leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]"
            variants={rise}
            custom={1}
            initial="hidden"
            animate="show"
          >
            I build dependable web applications for{" "}
            <em className="font-light italic text-accent">real users</em>.
          </motion.h1>

          <motion.p
            className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground"
            variants={rise}
            custom={2}
            initial="hidden"
            animate="show"
          >
            Full-stack developer in Bacolod City, Philippines. I design and ship
            complete products — booking systems, payroll platforms, fintech
            tools — with clean architecture and interfaces that respect the
            person using them.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            variants={rise}
            custom={3}
            initial="hidden"
            animate="show"
          >
            <a
              href="#projects"
              className="link-underline text-sm font-medium text-foreground"
            >
              View selected work
            </a>
            <a
              href="#contact"
              className="link-underline text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Get in touch
            </a>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Available for work
            </span>
          </motion.div>
        </div>

        {/* Right: the one 3D moment on the page */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[420px]"
          variants={rise}
          custom={2}
          initial="hidden"
          animate="show"
          aria-hidden="true"
        >
          {reduceMotion ? (
            <div className="flex h-full w-full items-center justify-center rounded-sm border border-border bg-secondary/60">
              <span className="font-display text-7xl text-foreground/80">EC</span>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-6xl text-foreground/25">EC</span>
                </div>
              }
            >
              <HeroCanvas />
            </Suspense>
          )}
          <span className="pointer-events-none absolute -bottom-2 right-0 select-none text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            drag to rotate
          </span>
        </motion.div>
      </div>
    </section>
  );
}
