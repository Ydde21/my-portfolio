import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import Magnetic from "./Magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Slow, deliberate rise used for the hero load sequence. The stagger is
   offset so the typography is still arriving as the preloader wipes
   away — a progressive reveal rather than a cut. Reduced motion gets the
   same choreography compressed to nearly nothing. */
const riseVariants = (reduce: boolean) => ({
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduce ? 0.45 : 0.9,
      delay: reduce ? 0.04 + i * 0.05 : 0.5 + i * 0.12,
      ease: EASE,
    },
  }),
});

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const rise = riseVariants(Boolean(reduceMotion));

  return (
    <section
      id="home"
      data-scene="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      aria-label="Introduction"
    >
      {/* The fixed 3D scene is the hero visual — this section is transparent.
          Scrims keep the type legible: a full dim on portrait screens (where
          the machine sits behind the copy) and a floor fade on all sizes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-background/60 md:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 bg-gradient-to-t from-background to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-28 pt-32 sm:px-8 sm:pt-36">
        <motion.div
          className="flex items-center gap-3"
          variants={rise}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <p className="meta-label">Available for work — Bacolod City, PH</p>
        </motion.div>

        <motion.h1
          className="font-display mt-8 text-[clamp(3.5rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
          variants={rise}
          custom={1}
          initial="hidden"
          animate="show"
        >
          EDDY
          <br />
          CASAS
        </motion.h1>

        <motion.p
          className="meta-label mt-6 !text-accent"
          variants={rise}
          custom={2}
          initial="hidden"
          animate="show"
        >
          Software Developer
        </motion.p>

        <motion.p
          className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          variants={rise}
          custom={3}
          initial="hidden"
          animate="show"
        >
          I design and build practical web applications, business systems, and
          software products — from database schema to the last hover state.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5"
          variants={rise}
          custom={4}
          initial="hidden"
          animate="show"
        >
          <Magnetic strength={0.3}>
            <a
              href="#work"
              className="btn-sweep group inline-flex items-center gap-2 border border-foreground/25 px-6 py-3.5 text-sm font-medium text-foreground transition-colors duration-300"
            >
              View selected work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <Magnetic strength={0.18}>
            <a
              href="#contact"
              className="link-underline text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Get in touch
            </a>
          </Magnetic>
          <Magnetic strength={0.18}>
            <a
              href="/CasasEddy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              aria-label="View resume"
            >
              <Eye className="h-4 w-4" />
              View resume
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Bottom metadata strip — the scroll cue sits centred, clear of the
          fixed chatbot launcher in the corner */}
      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-border/70 px-5 py-5 sm:px-8"
        variants={rise}
        custom={5}
        initial="hidden"
        animate="show"
      >
        <p className="meta-label">Full Stack — Web &amp; Mobile</p>
        <a
          href="#work"
          className="meta-label inline-flex items-center gap-2 !text-foreground/80 hover:!text-foreground"
          aria-label="Scroll to work section"
        >
          Scroll
          <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
        </a>
        <p className="meta-label hidden justify-self-end sm:block">
          Bacolod City, PH
        </p>
      </motion.div>
    </section>
  );
}
