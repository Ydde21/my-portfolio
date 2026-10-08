import { useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { projects, getProjectImages, getProjectCategory, getProjectPlatform, type PortfolioProject } from "./projects.data";
import ProductShowcase from "./ProductShowcase";
import { useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";

const featuredNames = ["Nudge", "Nivra", "Recurr", "NotchMeter"];
const featured = featuredNames.flatMap((title) =>
  projects.filter((project) => project.title === title),
);
const chapterCount = featured.length;
const tones = ["#ffab66", "#b6b1ff", "#99e8c3", "#adacf5"];
const captions = [
  "A little reminder. Right where you are.",
  "Less noise. One thing that matters.",
  "Production failures, replayed on your machine.",
  "Your AI subscriptions. At a glance.",
];
const getImages = getProjectImages;
const category = getProjectCategory;
const platform = getProjectPlatform;

function ProjectLink({ project }: { project: PortfolioProject }) {
  const href =
    project.kind === "mobile"
      ? project.downloadUrl
      : project.liveUrl || project.repoUrl;
  if (!href) return null;
  const label =
    project.kind === "mobile"
      ? "View release"
      : project.liveUrl
        ? "Visit project"
        : "View source";
  return (
    <a
      className="pill-button"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: ${project.title}`}
    >
      {label}
      <ArrowUpRight size={16} />
    </a>
  );
}

function ProjectDetails({
  project,
  onClose,
  trigger,
}: {
  project: PortfolioProject | null;
  onClose: () => void;
  trigger: React.RefObject<HTMLElement>;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const title = project?.title;
  // A keyed content tree below resets the screenshot when a new project opens.
  const images = project ? getImages(project) : [];
  return (
    <Dialog.Root
      open={Boolean(project)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setImageIndex(0);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="project-overlay" />
        <Dialog.Content
          className="project-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus();
          }}
        >
          {project && (
            <div key={title}>
              <div className="dialog-top">
                <span className="eyebrow">
                  {project.domain} / {platform(project)}
                </span>
                <Dialog.Close
                  className="icon-control"
                  aria-label="Close project"
                >
                  <X size={20} />
                </Dialog.Close>
              </div>
              <Dialog.Title className="dialog-title">
                {project.title}
              </Dialog.Title>
              {project.showcase && (
                <div className="dialog-showcase"><ProductShowcase project={project} /></div>
              )}
              <div className="dialog-layout">
                <div
                  className={`dialog-gallery ${project.kind === "mobile" ? "is-mobile" : ""}`}
                >
                  <img
                    src={images[imageIndex]?.src}
                    alt={images[imageIndex]?.alt}
                  />
                  {project.caseStudy && <p className="gallery-provenance">{project.caseStudy.previewNote}</p>}
                  <div className="dialog-gallery-controls">
                    <button
                      className="icon-control"
                      onClick={() =>
                        setImageIndex(
                          (i) => (i - 1 + images.length) % images.length,
                        )
                      }
                      aria-label={`Previous screenshot of ${project.title}`}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span aria-live="polite">
                      {imageIndex + 1} / {images.length}
                    </span>
                    <button
                      className="icon-control"
                      onClick={() =>
                        setImageIndex((i) => (i + 1) % images.length)
                      }
                      aria-label={`Next screenshot of ${project.title}`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="dialog-story">
                  <Dialog.Description>{project.description}</Dialog.Description>
                  <ul>
                    {project.highlights.map((text) => (
                      <li key={text}>
                        <Plus size={13} />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <ProjectLink project={project} />
                  {project.caseStudy && (
                    <div className="case-study-story">
                      <div><span className="eyebrow">THE CHALLENGE</span><p>{project.caseStudy.challenge}</p></div>
                      <div><span className="eyebrow">THE APPROACH</span><p>{project.caseStudy.approach}</p></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ShowcaseVisual({
  project,
  index,
  open,
}: {
  project: PortfolioProject;
  index: number;
  open: () => void;
}) {
  const images = getImages(project);
  if (project.showcase) return <ProductShowcase project={project} open={open} />;
  return (
    <button
      className={`showcase-visual showcase-visual-${index}`}
      onClick={open}
      aria-label={`Explore ${project.title}`}
    >
      <div className="showcase-glow" />
      {project.kind === "mobile" ? (
        <div className="phone-composition">
          {[images[1], images[0], images[2]].map((image, i) => (
            <div className={`phone phone-${i}`} key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" />
              <span className="phone-camera" />
            </div>
          ))}
        </div>
      ) : (
        <div className="desktop-composition">
          <div className="browser-mockup">
            <div className="browser-chrome">
              <span>● ● ●</span>
              <span>{project.title.toLowerCase()}</span>
              <span>↗</span>
            </div>
            <img src={images[0].src} alt={images[0].alt} loading="lazy" />
          </div>
          <div className="detail-window">
            <img src={images[1].src} alt={images[1].alt} loading="lazy" />
            <span>
              Inside {project.title}
              <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      )}
      <span className="visual-open">
        <ArrowUpRight size={19} />
        Explore project
      </span>
    </button>
  );
}

export default function WorkSection() {
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 960px) and (min-height: 650px)");
  const cinematic = wide && !reduced;
  const [activeIndex, setActive] = useState(0);
  const active = Math.min(activeIndex, chapterCount - 1);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const stageTurn = useTransform(scrollYProgress, (value) =>
    cinematic ? Math.sin(((value * chapterCount) % 1) * Math.PI) * -4 : 0,
  );
  const stageLift = useTransform(scrollYProgress, (value) =>
    cinematic ? Math.sin(((value * chapterCount) % 1) * Math.PI) * -22 : 0,
  );
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (cinematic) setActive(Math.min(chapterCount - 1, Math.floor(Math.max(0, value) * chapterCount)));
  });
  const select = (index: number) => {
    if (cinematic && section.current) {
      const rect = section.current.getBoundingClientRect();
      window.scrollTo({
        top:
          window.scrollY +
          rect.top +
          ((index + 0.12) / chapterCount) * (rect.height - window.innerHeight),
        behavior: "instant",
      });
    } else setActive(index);
  };
  const open = (project: PortfolioProject) => {
    trigger.current = document.activeElement as HTMLElement;
    setSelected(project);
  };
  const project = featured[active];
  const filtered = projects.filter(
    (project) => filter === "All" || category(project) === filter,
  );
  return (
    <>
      <section
        id="work"
        ref={section}
        className={`work-experience ${cinematic ? "is-cinematic" : ""}`}
        aria-labelledby="work-title"
        data-active-project={active}
        style={{ "--chapter-height": `${chapterCount * 100 + 40}svh` } as CSSProperties}
      >
        <div
          className="work-sticky"
          style={{ "--project-tone": tones[active] } as CSSProperties}
        >
          <div className="work-topline page-shell">
            <h2 id="work-title">
              <span className="eyebrow">01 / SELECTED WORK</span>Ideas made real
              <span className="accent-dot">.</span>
            </h2>
            <a href="#all-projects" className="understated-link">
              All {projects.length} projects <ArrowDown size={16} />
            </a>
          </div>
          <div className="showcase-layout page-shell">
            <div className="showcase-story">
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.title}
                  initial={reduced ? false : { opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{
                    duration: reduced ? 0 : 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span className="project-tag">
                    {project.domain} <i /> {platform(project)}
                  </span>
                  <h3>{project.title}</h3>
                  <p>{captions[active]}</p>
                  {project.showcase && <span className="featured-note">PRODUCT DESIGN & ENGINEERING</span>}
                  <button className="text-action" onClick={() => open(project)}>
                    Discover the project <ArrowUpRight size={17} />
                  </button>
                </motion.div>
              </AnimatePresence>
              <div
                className="work-companion"
                data-robot-anchor
                data-robot-pose="present"
                aria-hidden="true"
              />
            </div>
            <motion.div
              className="showcase-stage"
              id="featured-project-panel"
              role="tabpanel"
              aria-labelledby={`project-tab-${active}`}
              style={{ rotateY: stageTurn, y: stageLift }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  className="showcase-frame"
                  key={project.title}
                  initial={
                    reduced
                      ? false
                      : { opacity: 0, y: 65, rotateX: 12, scale: 0.91 }
                  }
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -55, rotateX: -9, scale: 0.94 }}
                  transition={{
                    duration: reduced ? 0 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ShowcaseVisual
                    project={project}
                    index={active}
                    open={() => open(project)}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
          <div className="project-navigation page-shell">
            <span className="project-number">
              0{active + 1}
              <span>/ {String(chapterCount).padStart(2, "0")}</span>
            </span>
            <div
              className="project-tabs"
              role="tablist"
              aria-label="Selected projects"
            >
              {featured.map((p, i) => (
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`project-tab-${i}`}
                  role="tab"
                  aria-controls="featured-project-panel"
                  tabIndex={active === i ? 0 : -1}
                  aria-selected={active === i}
                  onKeyDown={(event) => {
                    let next = i;
                    if (event.key === "ArrowRight") next = (i + 1) % chapterCount;
                    else if (event.key === "ArrowLeft") next = (i - 1 + chapterCount) % chapterCount;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = chapterCount - 1;
                    else return;
                    event.preventDefault();
                    select(next);
                    tabs.current[next]?.focus();
                  }}
                  key={p.title}
                  onClick={() => select(i)}
                >
                  <span className="tab-track">
                    <i
                      style={{ transform: `scaleX(${active === i ? 1 : 0})` }}
                    />
                  </span>
                  {p.title}
                </button>
              ))}
            </div>
            <div className="project-arrows">
              <button
                className="icon-control"
                aria-label="Previous featured project"
                onClick={() => select((active - 1 + chapterCount) % chapterCount)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="icon-control"
                aria-label="Next featured project"
                onClick={() => select((active + 1) % chapterCount)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <section
        id="all-projects"
        className="collection-section page-shell"
        aria-labelledby="collection-title"
      >
        <div className="collection-heading">
          <div>
            <span className="eyebrow">THE REST OF THE EXPLORATION</span>
            <h2 id="collection-title">
              More ideas.
              <br />
              <span>More possibilities.</span>
            </h2>
          </div>
          <div className="collection-intro">
            <p>
              Web applications, mobile experiences, and tools built around real
              problems.
            </p>
            <div className="collection-filters" aria-label="Filter projects">
              {["All", "Web", "Mobile", "Desktop"].map((item) => (
                <button
                  aria-pressed={filter === item}
                  key={item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                  {item === "All" && <sup>{projects.length}</sup>}
                </button>
              ))}
            </div>
          </div>
        </div>
        <motion.div layout={!reduced} className="project-grid">
          {filtered.map((p, i) => (
            <motion.button
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: reduced ? 0 : 0.55,
                delay: Math.min((i % 3) * 0.05, 0.1),
              }}
              className={`project-tile ${p.kind === "mobile" && !p.showcase ? "mobile-tile" : ""} ${p.showcase ? "studio-tile" : ""}`}
              key={p.title}
              onClick={() => open(p)}
              aria-label={`Explore ${p.title}`}
            >
              <div className="tile-image">
                <img
                  src={p.showcase?.cover || getImages(p)[0].src}
                  alt={p.showcase?.cover ? `${p.title} product showcase: ${p.showcase.headline.replace(/\n/g, " ")}` : getImages(p)[0].alt}
                  loading="lazy"
                />
                <span className="tile-open">
                  <ArrowUpRight size={22} />
                </span>
                <span className="tile-platform">{category(p)}</span>
              </div>
              <div className="tile-caption">
                <h3>{p.title}</h3>
                <span>{p.domain}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
        <p className="collection-footnote">
          {projects.length} projects. Many different problems. The same attention to detail.
        </p>
      </section>
      <ProjectDetails
        project={selected}
        onClose={() => setSelected(null)}
        trigger={trigger}
      />
    </>
  );
}
