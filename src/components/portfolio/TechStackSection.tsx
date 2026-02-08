import { motion } from "framer-motion";

const categories = [
  {
    title: "Frontend",
    color: "bg-primary",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    color: "bg-accent",
    items: ["Node.js", "ASP.NET Core Web API", "REST APIs"],
  },
  {
    title: "Database & Cloud",
    color: "bg-primary",
    items: ["PostgreSQL", "Supabase", "Vercel"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
};

export default function TechStackSection() {
  return (
    <section id="tech" className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Tech Stack</h2>
          <p className="mt-3 text-muted-foreground">Technologies I work with daily</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="rounded-xl border border-border bg-card overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`h-1 ${cat.color}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">{cat.title}</h3>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {cat.items.map((item, j) => (
                    <motion.span
                      key={item}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground cursor-default"
                      variants={tagVariants}
                      custom={j + i * 3}
                      whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
