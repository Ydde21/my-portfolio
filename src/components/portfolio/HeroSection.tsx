import { motion } from "framer-motion";
import { ArrowDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-5">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full border-2 border-primary/20 animate-[spin_20s_linear_infinite]" />
        <div className="absolute top-[30%] right-[15%] w-8 h-8 bg-accent/10 rotate-45" />
        <div className="absolute bottom-[20%] left-[20%] w-12 h-12 rounded-full border border-accent/20 animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute top-[60%] right-[10%] w-6 h-6 bg-primary/10 rounded-full" />
        <div className="absolute top-[15%] right-[40%] w-3 h-3 bg-primary/20 rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase border border-primary/30 rounded-full text-primary bg-primary/5">
            Full Stack Developer
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Eddy Casas
        </motion.h1>

        <motion.p
          className="mt-4 text-lg sm:text-xl text-accent font-display font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Vibe Coding Specialist
        </motion.p>

        <motion.p
          className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          I build modern, performant web applications with clean code and intuitive user experiences.
          Passionate about turning complex problems into elegant digital solutions.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button asChild size="lg" className="rounded-full px-8 font-semibold">
            <a href="#projects">
              <ArrowDown className="mr-2 h-4 w-4" />
              View Projects
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-semibold">
            <a href="#contact">
              <Send className="mr-2 h-4 w-4" />
              Contact Me
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
