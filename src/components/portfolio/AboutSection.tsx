import { useReducedMotion } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import { ArrowUpRight, Asterisk, MapPin } from "lucide-react";
export default function AboutSection() {
  const reduced = useReducedMotion();
  return (
    <section id="about" className="about-section page-shell">
      <div className="about-heading">
        <span className="eyebrow">02 / THE PERSON BEHIND THE PIXELS</span>
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Good software is
          <br />
          more than <span>good code.</span>
        </motion.h2>
      </div>
      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-top">
            <Asterisk size={28} />
            <span className="eyebrow">CURIOUS BY DEFAULT.</span>
          </div>
          <div
            className="about-robot"
            data-robot-anchor
            data-robot-pose="quiet"
            aria-hidden="true"
          />
          <div className="about-location">
            <MapPin size={14} />
            Bacolod City, Philippines
          </div>
        </div>
        <div className="about-story">
          <h3>
            I care about the
            <br />
            <span>whole product.</span>
          </h3>
          <p>
            I work across React, TypeScript, Node.js, ASP.NET Core, and
            PostgreSQL, and I treat design as part of engineering rather than a
            handoff.
          </p>
          <p>
            From database schema to the last hover state. If a screen needs
            explanation, the screen isn’t done.
          </p>
          <div className="about-stats">
            <div>
              <strong>17</strong>
              <span>TECHNOLOGIES</span>
            </div>
            <div>
              <strong>02</strong>
              <span>YEARS CODING</span>
            </div>
          </div>
          <a href="#contact" className="understated-link">
            Start a conversation <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
