import { motion } from "framer-motion";

const milestones = [
  {
    year: "2020",
    title: "Bachelor of Science in Information Technology",
  },
  {
    year: "2024",
    title: "Jr. Software Developer",
  },
  {
    year: "2026",
    title: "Full Stack Specialist",
  },
];

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="border-t border-border px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <p className="section-index">04 — Experience</p>
          <h2 className="font-display mt-3 max-w-md text-3xl leading-tight tracking-tight sm:text-5xl">
            Where I've been.
          </h2>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {milestones.map((m, i) => (
            <motion.li
              key={m.year}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-8 py-7 sm:grid-cols-[8rem_1fr_1fr] sm:gap-x-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="font-display text-2xl tracking-tight text-foreground/90 sm:text-3xl">
                {m.year}
              </span>
              <h3 className="col-span-2 mt-1 text-sm font-medium sm:col-span-1 sm:mt-0 sm:text-base">
                {m.title}
              </h3>
              <span className="hidden text-xs uppercase tracking-[0.14em] text-muted-foreground sm:block sm:text-right">
                {i === milestones.length - 1 ? "Present" : ""}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
