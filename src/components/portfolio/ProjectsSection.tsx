import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Apple,
  ExternalLink,
  FileText,
  Github,
  Play,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  projects,
  type MobileProject,
  type PortfolioProject,
  type ProjectKind,
  type ProjectScreenshot,
  type WebProject,
} from "./projects.data";

function ProjectCarousel({
  slides,
  mode,
  title,
}: {
  slides: ProjectScreenshot[];
  mode: ProjectKind;
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  const next = useCallback(() => {
    if (!hasMultipleSlides) {
      return;
    }
    setCurrent((c) => (c + 1) % slides.length);
  }, [hasMultipleSlides, slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next, hasMultipleSlides]);

  if (slides.length === 0) {
    return null;
  }

  const imageStack = (
    <>
      {slides.map((slide, i) => (
        <motion.img
          key={`${slide.src}-${i}`}
          src={slide.src}
          alt={slide.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={false}
          animate={{
            opacity: i === current ? 1 : 0,
            scale: i === current ? 1 : 1.05,
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      ))}
    </>
  );

  return (
    <div className={mode === "mobile" ? "px-5 pt-4" : ""}>
      {mode === "mobile" ? (
        <div className="relative mx-auto w-full max-w-[260px]">
          <div className="absolute -inset-3 rounded-[2.8rem] bg-primary/20 blur-2xl" />
          <div className="relative aspect-[9/19.5] w-full rounded-[2.5rem] border border-border bg-background p-1 shadow-[0_30px_60px_-25px_hsl(var(--primary)/0.35)]">
            <div className="absolute left-1/2 top-1.5 h-1.5 w-16 -translate-x-1/2 rounded-full bg-muted-foreground/40" />
            <div className="relative h-full overflow-hidden rounded-[1.9rem] bg-secondary">
              {imageStack}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
          {imageStack}
        </div>
      )}

      {hasMultipleSlides && (
        <div
          className={
            mode === "mobile"
              ? "mt-4 mb-1 flex justify-center gap-1.5"
              : "absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
          }
        >
          {slides.map((_, i) => (
            <button
              key={`${title}-slide-${i}`}
              onClick={() => setCurrent(i)}
              className="relative h-2 w-2 overflow-hidden rounded-full bg-foreground/30"
              aria-label={`${title}: Go to slide ${i + 1}`}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  layoutId={`${title}-carousel-dot`}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
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

function ProjectCardMobile({
  project,
  index,
}: {
  project: MobileProject;
  index: number;
}) {
  const hasStoreLinks = Boolean(
    project.storeLinks.appStore || project.storeLinks.googlePlay,
  );

  return (
    <motion.article
      className="group overflow-hidden rounded-xl border border-border bg-card lg:col-span-2"
      data-testid="mobile-project-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      whileHover={{
        y: -12,
        rotateY: 2,
        rotateX: -2,
        scale: 1.02,
        boxShadow: "0 25px 50px -20px hsl(var(--primary) / 0.25)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 pb-1">
        <Badge className="mb-3 gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider">
          <Smartphone className="h-3.5 w-3.5" />
          Mobile App
        </Badge>
        <h3 className="font-display text-2xl font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>

      <ProjectCarousel
        slides={project.screenshots}
        mode={project.kind}
        title={project.title}
      />

      <div className="p-5 pt-4">
        <div className="flex flex-wrap gap-2">
          {project.platforms.map((platform) => (
            <Badge
              key={platform}
              variant="secondary"
              className="rounded-full px-3 py-1"
            >
              {platform}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.storeLinks.appStore && (
            <Button asChild size="sm" className="rounded-full">
              <a
                href={project.storeLinks.appStore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Apple className="mr-2 h-3.5 w-3.5" />
                App Store
              </a>
            </Button>
          )}

          {project.storeLinks.googlePlay && (
            <Button asChild size="sm" className="rounded-full">
              <a
                href={project.storeLinks.googlePlay}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="mr-2 h-3.5 w-3.5" />
                Google Play
              </a>
            </Button>
          )}

          <Button
            asChild
            size="sm"
            variant={hasStoreLinks ? "outline" : "default"}
            className="rounded-full"
          >
            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="mr-2 h-3.5 w-3.5" />
              Case Study
            </a>
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-full">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCardWeb({
  project,
  index,
}: {
  project: WebProject;
  index: number;
}) {
  return (
    <motion.article
      className="group overflow-hidden rounded-xl border border-border bg-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      whileHover={{
        y: -12,
        rotateY: 3,
        rotateX: -3,
        scale: 1.03,
        boxShadow: "0 25px 50px -20px hsl(var(--primary) / 0.2)",
      }}
      transition={{ duration: 0.3 }}
    >
      <ProjectCarousel slides={project.images} mode={project.kind} title={project.title} />

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-full">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={project.repoUrl ? "rounded-full flex-1" : "rounded-full w-full"}
          >
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Live Demo
            </a>
          </Button>

          {project.repoUrl && (
            <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-3.5 w-3.5" />
                Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const orderedProjects: PortfolioProject[] = [...projects].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  );

  return (
    <section id="projects" className="bg-secondary/30 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Featured Work
          </h2>
          <p className="mt-3 text-muted-foreground">
            A selection of projects I&apos;ve built
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          data-testid="projects-grid"
          style={{ perspective: "1200px" }}
        >
          {orderedProjects.map((project, i) =>
            project.kind === "mobile" ? (
              <ProjectCardMobile key={project.title} project={project} index={i} />
            ) : (
              <ProjectCardWeb key={project.title} project={project} index={i} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
