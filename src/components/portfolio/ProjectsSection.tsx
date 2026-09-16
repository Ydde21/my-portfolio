import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
  const isMobile = mode === "mobile";
  const mobileStatusBarCrop = 46;

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
          className={
            isMobile
              ? "absolute inset-x-0 w-full object-cover"
              : "absolute inset-0 h-full w-full object-contain"
          }
          style={
            isMobile
              ? {
                  top: `-${mobileStatusBarCrop}px`,
                  height: `calc(100% + ${mobileStatusBarCrop}px)`,
                }
              : undefined
          }
          initial={false}
          animate={{
            opacity: i === current ? 1 : 0,
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      ))}
    </>
  );

  return (
    <div className={mode === "mobile" ? "px-5 pt-4" : ""}>
      {mode === "mobile" ? (
        <div className="relative mx-auto w-full max-w-[220px] lg:mx-0 lg:w-[220px] lg:max-w-none lg:shrink-0">
          <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2rem] border border-border bg-background p-1">
            <div className="relative h-full overflow-hidden rounded-[1.6rem] bg-secondary">
              {imageStack}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[3/2] overflow-hidden border-b border-border bg-secondary">
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
                  className="absolute inset-0 rounded-full bg-accent"
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

function ProjectMeta({ project }: { project: PortfolioProject }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {project.kind === "mobile"
        ? `${project.platforms.join(" · ")} app`
        : "Web application"}
    </p>
  );
}

function ProjectLinks({ project }: { project: PortfolioProject }) {
  if (project.kind === "mobile") {
    const mp = project as MobileProject;
    return (
      <a
        href={mp.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline inline-flex items-center gap-1 text-sm font-medium"
      >
        Download
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    );
  }

  const wp = project as WebProject;
  return (
    <>
      <a
        href={wp.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline inline-flex items-center gap-1 text-sm font-medium"
      >
        Visit site
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
      {wp.repoUrl && (
        <a
          href={wp.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Code
        </a>
      )}
    </>
  );
}

function ProjectCardMobile({
  project,
  index,
}: {
  project: MobileProject;
  index: number;
}) {
  return (
    <motion.article
      className="group border-t border-border pb-14 pt-10 lg:col-span-2 lg:grid lg:grid-cols-[1fr_240px] lg:items-start lg:gap-14"
      data-testid="mobile-project-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-xl">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
            Mobile App
          </span>
          {project.platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {platform}
            </span>
          ))}
        </div>
        <h3 className="font-display mt-4 text-3xl tracking-tight">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <ProjectLinks project={project} />
        </div>
      </div>
      <div className="mt-10 w-full max-w-[280px] lg:mt-0 lg:w-[240px] lg:max-w-none">
        <ProjectCarousel
          slides={project.screenshots}
          mode={project.kind}
          title={project.title}
        />
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
      className="group border-t border-border pb-14 pt-10"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProjectCarousel
        slides={project.images}
        mode={project.kind}
        title={project.title}
      />
      <div className="mt-5">
        <ProjectMeta project={project} />
        <h3 className="font-display mt-2 text-xl tracking-tight">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <ProjectLinks project={project} />
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
    <section id="projects" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="section-index">01 — Selected Work</p>
            <h2 className="font-display mt-3 max-w-lg text-3xl leading-tight tracking-tight sm:text-5xl">
              Real products, shipped and in use.
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground md:block">
            Fourteen builds across fintech, healthcare, procurement, and
            e-commerce — each one designed, engineered, and shipped end to end.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-x-10 lg:grid-cols-3"
          data-testid="projects-grid"
        >
          {orderedProjects.map((project, i) =>
            project.kind === "mobile" ? (
              <ProjectCardMobile
                key={project.title}
                project={project}
                index={i}
              />
            ) : (
              <ProjectCardWeb key={project.title} project={project} index={i} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
