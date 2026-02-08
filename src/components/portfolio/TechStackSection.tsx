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

export default function TechStackSection() {
  return (
    <section id="tech" className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Tech Stack</h2>
          <p className="mt-3 text-muted-foreground">Technologies I work with daily</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="rounded-xl border border-border bg-card overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`h-1 ${cat.color}`} />
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
