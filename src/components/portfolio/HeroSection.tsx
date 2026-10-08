import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Asterisk, FileText } from "lucide-react";
import { useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import RobotInteraction from "./RobotInteraction";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const reduced = useReducedMotion();
  const cinematic =
    useMediaQuery("(min-width: 960px) and (min-height: 650px)") && !reduced;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.32, 0.5], [1, 1, 0]);
  const nextOpacity = useTransform(scrollYProgress, [0.56, 0.78, 1], [0, 1, 1]);
  const nextY = useTransform(scrollYProgress, [0.45, 0.8], [70, 0]);
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setIntroVisible(value < 0.52),
  );
  useEffect(() => {
    if (intro.current) intro.current.inert = cinematic && !introVisible;
  }, [cinematic, introVisible]);
  return (
    <section
      ref={ref}
      id="home"
      className="hero-experience"
      aria-label="Introduction"
    >
      <div className="hero-sticky">
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="aurora aurora-one" />
          <div className="aurora aurora-two" />
          <div className="hero-gridlines" />
        </div>
        <div className="hero-layout page-shell">
          <motion.div
            ref={intro}
            aria-hidden={cinematic && !introVisible}
            className="hero-intro"
            style={cinematic ? { y, opacity } : undefined}
          >
            <motion.p
              className="eyebrow"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="status-dot" /> EDDY CASAS · SOFTWARE DEVELOPER
            </motion.p>
            <h1 aria-label="Software. With soul.">
              {["Software.", "With soul."].map((line, i) => (
                <span className="title-mask" key={line}>
                  <motion.span
                    initial={reduced ? false : { y: "110%", rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{
                      duration: 1.1,
                      delay: 0.12 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={i === 1 ? "muted-title" : ""}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div
              className="hero-description-group"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              <p className="hero-description">
                I turn ideas into practical applications, business systems, and
                thoughtfully crafted digital experiences.
              </p>
              <div className="hero-actions">
                <a href="#work" className="pill-button">
                  Explore my work <ArrowUpRight size={18} />
                </a>
                <a
                  href="/CasasEddy.pdf"
                  className="pill-button resume-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText size={18} aria-hidden="true" /> View résumé
                </a>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="hero-next"
            aria-hidden="true"
            style={{
              opacity: reduced ? 0 : nextOpacity,
              y: reduced ? 0 : nextY,
            }}
          >
            <span className="eyebrow">THOUGHT THROUGH. BUILT THROUGH.</span>
            <h2>
              From the first idea.
              <br />
              <span>
                To the final
                <br />
                interaction.
              </span>
            </h2>
          </motion.div>
          <div className="hero-stage">
            <div className="stage-halo" aria-hidden="true" />
            <span className="floating-label label-one">
              <span className="status-dot" /> A little personality.
            </span>
            <RobotInteraction />
            <span className="floating-label label-two">
              <Asterisk size={16} /> A lot of possibility.
            </span>
          </div>
        </div>
        <div className="hero-bottom page-shell">
          <a href="#work" className="scroll-prompt">
            <span>
              <ArrowDown size={16} />
            </span>
            SCROLL TO DISCOVER
          </a>
          <p>
            BASED IN BACOLOD CITY, PH
            <br />
            <span>Building for wherever you are.</span>
          </p>
          <a className="hero-bottom-link" href="#contact">
            Let’s talk <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
