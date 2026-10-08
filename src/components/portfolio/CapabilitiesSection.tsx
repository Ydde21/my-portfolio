import { useReducedMotion } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Layers3, Smartphone } from "lucide-react";
const capabilities = [
  {
    icon: Code2,
    title: "Product engineering",
    line: "Product-grade web applications end to end — from database schema to the last hover state.",
    tags: ["Architecture", "Interfaces", "Delivery"],
  },
  {
    icon: Layers3,
    title: "Business systems",
    line: "Payroll, procurement, and clinic operations — real systems with approvals, audit logs, and compliance.",
    tags: ["Workflows", "Operations", "Data"],
  },
  {
    icon: Smartphone,
    title: "Mobile experiences",
    line: "React Native apps designed, built, and shipped to the App Store and Google Play.",
    tags: ["React Native", "iOS", "Android"],
  },
];
export default function CapabilitiesSection() {
  const reduced = useReducedMotion();
  return (
    <section
      className="capabilities-section page-shell"
      aria-label="What I build"
    >
      <div className="capabilities-heading">
        <span className="eyebrow">
          FROM THE BIG PICTURE TO THE SMALL DETAILS
        </span>
        <h2>Built from the inside out.</h2>
      </div>
      <div className="capability-grid">
        {capabilities.map(({ icon: Icon, title, line, tags }, i) => (
          <motion.article
            key={title}
            className="capability-card"
            initial={reduced ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduced ? 0 : 0.7, delay: i * 0.1 }}
          >
            <div className="capability-symbol">
              <Icon size={32} strokeWidth={1} />
              <span>0{i + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{line}</p>
            <div>
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              <ArrowUpRight size={18} />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
