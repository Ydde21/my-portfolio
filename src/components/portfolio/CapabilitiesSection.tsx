import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Grounded in the shipped project list — payroll, procurement, clinic
   operations, store-listed mobile, and end-to-end product builds. */
const capabilities = [
  {
    index: "01",
    title: "Product Engineering",
    line: "Product-grade web applications end to end — from database schema to the last hover state.",
  },
  {
    index: "02",
    title: "Business Systems",
    line: "Payroll, procurement, and clinic operations — real systems with approvals, audit logs, and compliance.",
  },
  {
    index: "03",
    title: "Mobile",
    line: "React Native apps designed, built, and shipped to the App Store and Google Play.",
  },
];

export default function CapabilitiesSection() {
  return (
    <section
      aria-label="What I build"
      className="relative border-t border-border bg-background px-5 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <h2 className="font-display max-w-md text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            What I build.
          </h2>
        </motion.div>

        <div className="divide-y divide-border border-y border-border">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.index}
              className="group grid gap-3 py-8 sm:grid-cols-[4rem_1fr_1.4fr] sm:items-baseline sm:gap-10 sm:py-12"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            >
              <p className="section-index text-accent">{cap.index}</p>
              <h3 className="font-display text-2xl tracking-tight text-foreground/70 transition-colors duration-300 group-hover:text-foreground sm:text-4xl">
                {cap.title}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:justify-self-end sm:text-base">
                {cap.line}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
