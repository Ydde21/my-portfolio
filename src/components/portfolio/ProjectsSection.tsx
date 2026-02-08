import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Haven Harmony images
import hhHero from "@/assets/projects/havenharmony/hero.png";
import hhDashboard from "@/assets/projects/havenharmony/dashboard.png";
import hhRooms from "@/assets/projects/havenharmony/rooms.png";

// Savvy Wallet images
import swCharts from "@/assets/projects/savvywallet/charts.png";
import swLogin from "@/assets/projects/savvywallet/login.png";
import swTransactions from "@/assets/projects/savvywallet/transactions.png";

// Aniverse Canvas images
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
    link: "#",
  },
  {
    title: "Savvy Wallet",
    description:
      "A smart finance and expense tracker that helps users manage budgets, track spending, and visualize financial goals with intuitive charts.",
    images: [swCharts, swLogin, swTransactions],
    link: "#",
  },
  {
    title: "Aniverse Canvas",
    description:
      "An anime art platform where artists can showcase, share, and discover artwork. Features galleries, community interactions, and curated collections.",
    images: [anHero, anGenres, anTrending],
    link: "#",
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
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-primary" : "bg-foreground/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-5 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Featured Work</h2>
          <p className="mt-3 text-muted-foreground">A selection of projects I've built</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl transition-shadow duration-300"
              style={{ perspective: "800px" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ rotateY: 2, rotateX: -2, scale: 1.02 }}
            >
              <ImageCarousel images={project.images} />
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-full w-full">
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    Live Demo
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
