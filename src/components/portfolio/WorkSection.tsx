import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import {
  projects,
  type PortfolioProject,
  type ProjectScreenshot,
} from "./projects.data";
import Magnetic from "./Magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------
   The deck: every project in the index, featured first.
------------------------------------------------------------------- */
const orderedProjects: PortfolioProject[] = [...projects].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);

interface DeckCard {
  project: PortfolioProject;
  shot: ProjectScreenshot;
  link: { href: string; label: string };
  secondary: Array<{ href: string; label: string }>;
  tag: string;
}

function firstShot(p: PortfolioProject): ProjectScreenshot {
  return p.kind === "web" ? p.images[0] : p.screenshots[0];
}

function primaryLink(p: PortfolioProject): { href: string; label: string } {
  return p.kind === "web"
    ? { href: p.liveUrl, label: "View live" }
    : { href: p.downloadUrl, label: "Download" };
}

/* Repo / store / case-study links — rendered only where they exist. */
function secondaryLinks(p: PortfolioProject): Array<{ href: string; label: string }> {
  if (p.kind === "web") {
    return p.repoUrl ? [{ href: p.repoUrl, label: "Repository" }] : [];
  }
  const links: Array<{ href: string; label: string }> = [];
  if (p.storeLinks.appStore) {
    links.push({ href: p.storeLinks.appStore, label: "App Store" });
  }
  if (p.storeLinks.googlePlay) {
    links.push({ href: p.storeLinks.googlePlay, label: "Google Play" });
  }
  if (p.caseStudyUrl) {
    links.push({ href: p.caseStudyUrl, label: "Case study" });
  }
  return links;
}

const deck: DeckCard[] = orderedProjects.map((project) => ({
  project,
  shot: firstShot(project),
  link: primaryLink(project),
  secondary: secondaryLinks(project),
  tag:
    project.kind === "mobile"
      ? "Mobile App"
      : project.title === "TimePay PH"
        ? "Mobile-first SaaS"
        : "Web App",
}));

/* Clamp a 0..1 scroll progress into a segment's local 0..1 progress */
function useSegment(progress: MotionValue<number>, start: number, end: number) {
  return useTransform(progress, [start, end], [0, 1], { clamp: true });
}

function CardLinks({ card }: { card: DeckCard }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Magnetic strength={0.24}>
        <a
          href={card.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sweep group inline-flex items-center gap-2 border border-foreground/25 px-5 py-2.5 text-xs font-medium text-foreground transition-colors duration-300 sm:text-sm"
        >
          {card.link.label}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </Magnetic>
      {card.secondary.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground sm:text-sm"
        >
          {s.label}
          <ArrowUpRight className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

function StackCard({
  card,
  index,
  total,
  scrollYProgress,
  reduce,
}: {
  card: DeckCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const { project, shot, tag } = card;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const num = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  /* This card's entrance segment: it slides up over the previous card.
     A ~35% dwell pause is built into each segment so the active card
     rests before the next one enters. */
  const ENTER_PORTION = 0.65;
  const segStart = index / total;
  const enterEnd = segStart + ENTER_PORTION / total;
  const segEnd = (index + 1) / total;
  const enter = useSegment(scrollYProgress, segStart, enterEnd);
  const enterY = useTransform(enter, [0, 1], ["104%", "0%"]);

  /* The next card's entrance drives this card's recession into the deck.
     Only transform + opacity are animated — both are compositor-only
     properties, so scrolling never triggers layout or repaint. */
  const nextStart = segEnd;
  const nextEnterEnd = segEnd + ENTER_PORTION / total;
  /* Always mounted — for the last card the range sits at/beyond progress 1,
     so the transform never leaves its rest state. */
  const cover = useSegment(scrollYProgress, nextStart, nextEnterEnd);
  const coveredScale = useTransform(cover, [0, 1], [1, 0.94]);
  const coveredY = useTransform(cover, [0, 1], [0, -22]);
  const dimOpacity = useTransform(cover, [0, 1], [0, 0.45]);

  const settleStyle = reduce
    ? undefined
    : {
        scale: isLast ? 1 : coveredScale,
        y: isLast ? 0 : coveredY,
      };

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={
        reduce
          ? { zIndex: index + 1 }
          : {
              zIndex: index + 1,
              y: isFirst ? 0 : enterY,
            }
      }
    >
      <motion.article
        className="preview-shadow group relative flex h-full w-full flex-col overflow-hidden border border-border bg-card"
        style={settleStyle}
        aria-label={`Project ${index + 1} of ${total}: ${project.title}`}
      >
        {/* Dim veil: opacity-driven (GPU-composited) instead of a
            brightness filter, which forced a repaint every scroll frame */}
        {!reduce && !isLast && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 bg-black"
            style={{ opacity: dimOpacity }}
            aria-hidden="true"
          />
        )}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[0.92fr_1.08fr]">
          {/* Info column */}
          <div className="flex min-h-0 flex-col p-5 sm:p-8 lg:p-10">
            <div className="flex items-baseline justify-between gap-4">
              <p className="section-index">{num}</p>
              <p className="meta-label text-accent">{project.domain}</p>
            </div>

            <h3 className="font-display mt-5 text-3xl leading-[1.02] tracking-[-0.02em] text-foreground sm:mt-8 sm:text-5xl lg:text-6xl">
              {project.title}
            </h3>
            <p className="meta-label mt-3 sm:mt-4">{tag}</p>

            <ul className="mt-5 hidden space-y-2.5 border-t border-border pt-5 sm:mt-8 sm:block sm:pt-6">
              {project.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-baseline gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    className="inline-block h-px w-4 shrink-0 translate-y-[-3px] bg-accent"
                    aria-hidden="true"
                  />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 sm:pt-8">
              <CardLinks card={card} />
            </div>
          </div>

          {/* Visual — object-contain: no zoom, full screenshot visible */}
          <div className="relative min-h-[9rem] overflow-hidden border-t border-border bg-secondary sm:min-h-[12rem] lg:min-h-0 lg:border-l lg:border-t-0">
            <img
              src={shot.src}
              alt={shot.alt}
              className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.02] sm:p-6"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function WorkSection() {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const total = deck.length;

  const { scrollYProgress: rawProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* Lightly spring the scroll progress so trackpad/touch scrolling glides
     between cards instead of stepping 1:1 with the raw scroll delta. */
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0001,
  });

  /* Announce the active card to the 3D scene (contract: scene:focus-project). */
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(total - 1, Math.max(0, Math.floor(v * total))),
  );
  useMotionValueEvent(activeIndex, "change", (latest) => {
    window.dispatchEvent(
      new CustomEvent("scene:focus-project", {
        detail: { index: latest, total },
      }),
    );
  });
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("scene:focus-project", {
        detail: { index: 0, total },
      }),
    );
  }, [total]);

  return (
    <section
      id="work"
      data-scene="work"
      className="relative"
      aria-label="Selected work"
    >
      {/* Spacing before the deck */}
      <div className="pt-28 sm:pt-36" aria-hidden="true" />

      {reduce ? (
        /* Reduced-motion fallback: simple readable stack */
        <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-8 px-5 pb-28 sm:pb-36">
          {deck.map((card, index) => (
            <article
              key={card.project.title}
              className="preview-shadow overflow-hidden border border-border bg-card"
              aria-label={`Project ${index + 1} of ${total}: ${card.project.title}`}
            >
              <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="section-index">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(total).padStart(2, "0")}
                    </p>
                    <p className="meta-label text-accent">
                      {card.project.domain}
                    </p>
                  </div>
                  <h3 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">
                    {card.project.title}
                  </h3>
                  <p className="meta-label mt-3">{card.tag}</p>
                  <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {card.project.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-baseline gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          className="inline-block h-px w-4 shrink-0 translate-y-[-3px] bg-accent"
                          aria-hidden="true"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {card.project.description}
                  </p>
                  <div className="mt-6">
                    <CardLinks card={card} />
                  </div>
                </div>
                <div className="overflow-hidden border border-border bg-secondary">
                  <img
                    src={card.shot.src}
                    alt={card.shot.alt}
                    className="block w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Scroll-driven stacking deck — ~80vh of scroll per card */
        <div
          ref={trackRef}
          className="relative"
          style={{ height: `${total * 80 + 20}vh` }}
        >
          <div className="sticky top-0 flex h-screen items-center justify-center px-4 pb-8 pt-24 sm:px-6 sm:pt-28">
            <div className="relative h-full max-h-[44rem] w-full max-w-6xl">
              {deck.map((card, index) => (
                <StackCard
                  key={card.project.title}
                  card={card}
                  index={index}
                  total={total}
                  scrollYProgress={scrollYProgress}
                  reduce={reduce}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer so the next section breathes after the deck */}
      <div className="pb-20 sm:pb-28" aria-hidden="true" />
    </section>
  );
}
