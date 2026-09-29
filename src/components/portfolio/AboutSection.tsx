import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const stats: Array<[string, string]> = [
  ["17", "Technologies"],
  ["2", "Years coding"],
];

export default function AboutSection() {
  return (
    <section
      id="about"
      data-scene="about"
      className="relative border-t border-border bg-background px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-display max-w-4xl text-balance text-3xl leading-[1.15] tracking-tight sm:text-5xl sm:leading-[1.1]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          I'm a software developer who cares about the{" "}
          <em className="font-light italic text-accent">whole product</em> —
          from database schema to the last hover state.
        </motion.h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <motion.div
            className="space-y-5 text-base leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          >
            <p>
              I work across React, TypeScript, Node.js, ASP.NET Core, and
              PostgreSQL, and I treat design as part of engineering rather
              than a handoff. If a screen needs explanation, the screen isn't
              done.
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4">
              <a
                href="#contact"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowUpRight className="h-4 w-4" />
                Start a conversation
              </a>
            </div>
          </motion.div>

          <motion.dl
            className="grid content-start grid-cols-3 gap-6 border-t border-border pt-8 lg:grid-cols-1 lg:gap-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.18, ease: EASE }}
          >
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
                  {value}
                </dt>
                <dd className="meta-label mt-2">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
