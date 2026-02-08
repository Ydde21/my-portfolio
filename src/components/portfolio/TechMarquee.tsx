const techs = [
  "React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "MongoDB",
  "PostgreSQL", "Python", "Firebase", "Git", "REST APIs", "GraphQL",
  "Docker", "Supabase", "Prisma", "Framer Motion",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...techs, ...techs];
  return (
    <div className="flex overflow-hidden">
      <div className={`flex shrink-0 gap-3 py-2 ${reverse ? "marquee-reverse" : "marquee"}`}>
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border border-border bg-card text-foreground whitespace-nowrap"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="py-12 overflow-hidden border-y border-border">
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
