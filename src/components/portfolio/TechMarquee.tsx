import { motion } from "framer-motion";

const techs = [
  "React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS",
  "PostgreSQL", "ASP.NET Core Web API", "Git", "REST APIs",
  "Supabase", "Vercel", "HTML5", "CSS3",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...techs, ...techs];
  return (
    <div className="flex overflow-hidden group">
      <div className={`flex shrink-0 gap-3 py-2 ${reverse ? "marquee-reverse" : "marquee"} group-hover:[animation-play-state:paused]`}>
        {items.map((t, i) => (
          <motion.span
            key={`${t}-${i}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border border-border bg-card text-foreground whitespace-nowrap cursor-default"
            whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
            transition={{ duration: 0.2 }}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <motion.section
      className="py-12 overflow-hidden border-y border-border"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </motion.section>
  );
}
