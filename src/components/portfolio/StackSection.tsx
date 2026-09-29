import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const groups = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native", "Vite", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    items: ["Node.js", "ASP.NET Core Web API", "REST APIs", "PHP"],
  },
  {
    title: "Database & Cloud",
    items: ["PostgreSQL", "Supabase", "SQL Server", "Vercel", "Microsoft Azure"],
  },
];

export default function StackSection() {
  return (
    <section
      id="stack"
      data-scene="stack"
      className="relative border-t border-border bg-background px-5 py-28 sm:py-36"
      aria-label="Technology stack"
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
            Tools I reach for daily.
          </h2>
        </motion.div>

        <div className="divide-y divide-border border-y border-border">
          {groups.map((group, i) => (
            <motion.div
              key={group.title}
              className="grid gap-4 py-10 sm:grid-cols-[12rem_1fr] sm:gap-10 sm:py-12"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            >
              <h3 className="meta-label pt-2">{group.title}</h3>
              <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="font-display cursor-default text-3xl tracking-tight text-foreground/40 transition-colors duration-300 hover:text-foreground sm:text-4xl"
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
