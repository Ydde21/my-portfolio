import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

import hhHero from "@/assets/projects/havenharmony/hero.png";
import hhDashboard from "@/assets/projects/havenharmony/dashboard.png";
import hhRooms from "@/assets/projects/havenharmony/rooms.png";

import swCharts from "@/assets/projects/savvywallet/charts.png";
import swLogin from "@/assets/projects/savvywallet/login.png";
import swTransactions from "@/assets/projects/savvywallet/transactions.png";

import anHero from "@/assets/projects/aniverse/hero.png";
import anGenres from "@/assets/projects/aniverse/genres.png";
import anTrending from "@/assets/projects/aniverse/trending.png";

interface Project {
  title: string;
  description: string;
  images: string[];
  link: string;
}

const projects: Project[] = [
  {
    title: "Haven Harmony",
    description:
      "A comprehensive hotel management system with booking, room management, and guest services features. Built for seamless hospitality operations.",
    images: [hhHero, hhDashboard, hhRooms],
    link: "https://havenharmony.lovable.app",
  },
  {
    title: "Savvy Wallet",
    description:
      "A smart finance and expense tracker that helps users manage budgets, track spending, and visualize financial goals with intuitive charts.",
    images: [swCharts, swLogin, swTransactions],
    link: "https://savvy-wallet.lovable.app",
  },
  {
    title: "Aniverse Canvas",
    description:
      "An anime art platform where artists can showcase, share, and discover artwork. Features galleries, community interactions, and curated collections.",
    images: [anHero, anGenres, anTrending],
    link: "https://aniverse-canvas.lovable.app",
  },
];

function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
      {images.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          initial={false}
          animate={{
            opacity: i === current ? 1 : 0,
            scale: i === current ? 1 : 1.05,
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative w-2 h-2 rounded-full overflow-hidden bg-foreground/30"
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === current && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-full"
                layoutId="carousel-dot"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-5 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Featured Work
          </h2>
          <p className="mt-3 text-muted-foreground">
            A selection of projects I've built
          </p>
        </motion.div>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="group rounded-xl border border-border bg-card overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{
                y: -12,
                rotateY: 3,
                rotateX: -3,
                scale: 1.03,
                boxShadow: "0 25px 50px -20px hsl(var(--primary) / 0.2)",
              }}
              transition={{ duration: 0.3 }}
            >
              <ImageCarousel images={project.images} />
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-4 rounded-full w-full"
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
