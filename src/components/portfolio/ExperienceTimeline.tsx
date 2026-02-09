import { motion } from "framer-motion";
import { Code, Rocket, Users, Award } from "lucide-react";

const milestones = [
  {
    year: "2021",
    title: "Started Coding Journey",
    description: "Dove into web development, learning HTML, CSS, JavaScript and building first projects.",
    icon: Code,
  },
  {
    year: "2022",
    title: "First Freelance Project",
    description: "Delivered a full-stack web app for a client, solidifying real-world development skills.",
    icon: Rocket,
  },
  {
    year: "2023",
    title: "Built 10+ Applications",
    description: "Expanded portfolio with diverse projects spanning finance, hospitality, and creative platforms.",
    icon: Users,
  },
  {
    year: "2024",
    title: "Full Stack Specialist",
    description: "Mastered modern frameworks and became proficient in end-to-end application development.",
    icon: Award,
  },
];

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            My Journey
          </h2>
          <p className="mt-3 text-muted-foreground">Key milestones along the way</p>
        </motion.div>

        <div className="relative">
          {/* Animated vertical line */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border origin-top"
            style={{ transform: "translateX(-50%)" }}
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          />

          <div className="space-y-12">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              const Icon = m.icon;

              return (
                <motion.div
                  key={m.year}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Glowing dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      className="w-4 h-4 rounded-full bg-primary"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 hsl(199 89% 48% / 0.4)",
                          "0 0 0 10px hsl(199 89% 48% / 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <motion.div
                      className="rounded-xl border border-border bg-card p-5 shadow-sm"
                      whileHover={{
                        y: -4,
                        boxShadow: "0 12px 30px -10px hsl(var(--primary) / 0.15)",
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className={`flex items-center gap-3 ${isLeft ? "md:justify-end" : ""}`}>
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                          {m.year}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                        {m.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {m.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
