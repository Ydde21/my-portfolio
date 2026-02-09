import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo3d from "@/assets/logo-3d.png";

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!triggered) return;
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [triggered, value, count, rounded]);

  return (
    <motion.div
      className="text-center"
      onViewportEnter={() => setTriggered(true)}
      viewport={{ once: true }}
    >
      <span className="block font-display text-3xl sm:text-4xl font-bold text-primary">
        {display}+
      </span>
      <span className="text-sm text-muted-foreground mt-1 block">{label}</span>
    </motion.div>
  );
}

const stats = [
  { value: 3, label: "Years Coding" },
  { value: 10, label: "Projects Built" },
  { value: 13, label: "Technologies" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60, filter: "blur(6px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-5">
      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Image */}
        <motion.div className="flex justify-center" variants={fadeLeft}>
          <motion.div
            className="relative w-64 h-64 sm:w-72 sm:h-72"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl" />
            <img
              src={logo3d}
              alt="Eddy Casas"
              className="relative w-full h-full rounded-2xl object-cover border-2 border-border shadow-lg"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div variants={fadeRight}>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            About Me
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            I'm a passionate full-stack developer who loves turning ideas into polished digital
            experiences. With a strong focus on modern web technologies and clean architecture,
            I build applications that are not only functional but delightful to use.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            When I'm not coding, you'll find me exploring new frameworks, contributing to open
            source, or sketching out UI concepts. I believe great software starts with empathy
            for the end user.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>

          {/* Resume button */}
          <motion.div className="mt-8" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" className="rounded-full px-8 font-semibold shadow-lg shadow-primary/25">
              <motion.span
                className="mr-2 inline-flex"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Download className="h-4 w-4" />
              </motion.span>
              Download Resume
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
