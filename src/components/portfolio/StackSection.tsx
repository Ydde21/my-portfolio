import { useReducedMotion } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import { Braces, Database, Terminal } from "lucide-react";
const groups = [
  {
    icon: Braces,
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "React Native",
      "SwiftUI",
      "Vite",
      "HTML5",
      "CSS3",
    ],
  },
  {
    icon: Terminal,
    title: "Backend",
    items: ["Node.js", "Go", "ASP.NET Core Web API", "REST APIs", "PHP"],
  },
  {
    icon: Database,
    title: "Database & Cloud",
    items: [
      "PostgreSQL",
      "Supabase",
      "SQL Server",
      "Vercel",
      "Microsoft Azure",
    ],
  },
];
export default function StackSection() {
  const reduced = useReducedMotion();
  return (
    <section
      id="stack"
      className="stack-section page-shell"
      aria-label="Technology stack"
    >
      <div className="stack-heading">
        <span className="eyebrow">03 / MY TOOLBOX</span>
        <h2>
          The right tools.
          <br />
          <span>Thoughtfully connected.</span>
        </h2>
        <p>Across the interface, the server, and everything in between.</p>
      </div>
      <div className="stack-groups">
        {groups.map(({ icon: Icon, title, items }, i) => (
          <motion.div
            className="stack-group"
            key={title}
            initial={reduced ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <div className="stack-group-title">
              <Icon size={18} />
              <h3>{title}</h3>
              <span>0{i + 1}</span>
            </div>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
