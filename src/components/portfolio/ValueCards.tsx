import { motion } from "framer-motion";
import { Code2, Zap, Palette } from "lucide-react";

const values = [
  {
    icon: Code2,
    title: "Clean Code",
    description:
      "I write maintainable, well-structured code following industry best practices. Every line has purpose.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description:
      "Efficient workflows and modern tooling mean I ship quality products on tight timelines.",
  },
  {
    icon: Palette,
    title: "Modern Design",
    description:
      "Pixel-perfect interfaces with thoughtful animations that create memorable user experiences.",
  },
];

const flipVariants = {
  hidden: { opacity: 0, rotateY: -90, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function ValueCards() {
  return (
    <section className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            What I Bring
          </h2>
          <p className="mt-3 text-muted-foreground">
            Values that drive every project
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                className="group relative rounded-xl border border-border bg-card p-8 text-center overflow-hidden"
                variants={flipVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.2)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient border glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15))",
                  }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
