import { motion } from "framer-motion";

const categories = [
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "Vite",
      "React Native",
    ],
  },
  {
    title: "Backend",
    items: ["Node.js", "ASP.NET Core Web API", "REST APIs", "PHP"],
  },
  {
    title: "Database & Cloud",
    items: [
      "PostgreSQL",
      "Supabase",
      "Vercel",
      "SQL Server",
      "Microsoft Azure",
    ],
  },
];

export default function TechStackSection() {
  return (
    <section id="tech" className="border-t border-border px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="section-index">03 — Stack</p>
            <h2 className="font-display mt-3 max-w-md text-3xl leading-tight tracking-tight sm:text-5xl">
              Tools I reach for daily.
            </h2>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="bg-background p-8"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h3 className="font-display text-lg tracking-tight">
                {cat.title}
              </h3>
              <ul className="mt-5 space-y-2.5">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-border/60 pb-2.5 text-sm text-muted-foreground last:border-0 last:pb-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
