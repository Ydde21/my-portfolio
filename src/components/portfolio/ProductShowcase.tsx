import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Bell, BookOpen, Calculator, Check, Clock3, Coins, Command, Gauge, GitBranch, GitPullRequest, HeartPulse, Hotel, Layers, Megaphone, MessagesSquare, Plane, Receipt, RotateCcw, Sparkles, Timer, WalletCards } from "lucide-react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { getProjectImages, type PortfolioProject, type ProjectScreenshot } from "./projects.data";

const brandMarks = {
  notchmeter: Gauge, savewise: WalletCards, havenharmony: Hotel, paylance: Receipt,
  procuredesk: GitPullRequest, cliniqo: HeartPulse, timepay: Timer, paymatrix: Layers,
  sulitflight: Plane, mineflow: MessagesSquare, adforge: Megaphone, servicepass: BookOpen,
  presyopro: Calculator, savvywallet: Coins, aniverse: Sparkles,
};

function StudioWindow({ image, label, className = "" }: {
  image: ProjectScreenshot; label: string; className?: string;
}) {
  return (
    <div className={`studio-window ${className}`}>
      <div className="studio-window-bar"><span><i /><i /><i /></span><small>{label}</small><ArrowUpRight size={10} /></div>
      <img src={image.src} alt="" loading="lazy" />
      <span className="studio-window-edge" />
    </div>
  );
}

function CollectionComposition({ project }: { project: PortfolioProject }) {
  const studio = project.showcase!;
  const images = getProjectImages(project);
  const primary = images[studio.primary ?? 0];
  const secondary = images[studio.secondary ?? 1];
  const composition = studio.composition;
  if (!composition) return null;
  if (composition === "mobile") return (
    <div className="collection-product collection-mobile">
      {[secondary, primary, images[2]].map((image, index) => (
        <div className={`studio-phone collection-phone-${index}`} key={image.src}>
          <img src={image.src} alt="" loading="lazy" /><span className="device-edge" />
        </div>
      ))}
      <span className="studio-annotation collection-mobile-note"><i />{studio.detail}</span>
    </div>
  );
  if (composition === "notch") return (
    <div className="collection-product collection-notch">
      <div className="meter-display"><img src={primary.src} alt="" loading="lazy" /><span className="meter-display-stand" /></div>
      <div className="meter-detail"><img src={secondary.src} alt="" loading="lazy" /></div>
      <div className="studio-feature-tags"><span>Claude</span><span>ChatGPT</span><span>Cursor</span></div>
    </div>
  );
  return (
    <div className={`collection-product collection-${composition}`}>
      {(composition === "stack" || composition === "gallery") && <StudioWindow image={images[2]} label={project.title} className="collection-tertiary" />}
      <StudioWindow image={primary} label={project.title} className="collection-primary" />
      {composition === "invoice" ? (
        <div className="studio-invoice"><span className="invoice-clip" /><img src={secondary.src} alt="" loading="lazy" /><span>{studio.detail}<Receipt size={12} /></span></div>
      ) : <StudioWindow image={secondary} label={studio.detail || project.title} className="collection-secondary" />}
      {composition === "workflow" && <div className="studio-journey">{(studio.identity === "timepay" ? ["Clock in", "Attendance", "Payroll"] : ["Request", "Approve", "Track"]).map((step, i) => <span key={step}><i />{step}{i < 2 && <b>→</b>}</span>)}</div>}
      {composition === "calculator" && <span className="studio-object-mark"><Calculator strokeWidth={1} /></span>}
      {composition === "campaign" && <span className="studio-campaign-orbit" />}
    </div>
  );
}

/** Product interfaces come from the apps' own local demos. The art is a backdrop. */
export default function ProductShowcase({ project, open }: {
  project: PortfolioProject;
  open?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(!document.hidden);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(mx, { stiffness: 100, damping: 25 });
  const rotateX = useSpring(my, { stiffness: 100, damping: 25 });
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const showcase = project.showcase!;
  const images = getProjectImages(project);
  const playing = inView && visible && !reduced;
  const BrandMark = brandMarks[showcase.identity as keyof typeof brandMarks] || RotateCcw;
  return (
    <motion.div
      ref={ref}
      className={`product-showcase product-showcase-${showcase.identity} ${playing ? "is-playing" : ""}`}
      style={{ "--studio-tone": showcase.tone, rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY } as CSSProperties}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        mx.set(((event.clientX - box.left) / box.width - 0.5) * 5);
        my.set(((event.clientY - box.top) / box.height - 0.5) * -4);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      role={open ? undefined : "img"}
      aria-label={open ? undefined : `${project.title} product showcase: ${showcase.headline.replace(/\n/g, " ")}`}
    >
      <img className="studio-art" src={showcase.art} alt="" loading="lazy" />
      <div className="studio-vignette" />
      <div className="studio-content" aria-hidden="true">
        <div className="studio-topline">
          <span className="studio-brand">
            {showcase.icon ? <img src={showcase.icon} alt="" /> : <BrandMark size={18} strokeWidth={1.5} />}
            {project.title}
          </span>
          <span className="studio-edition">{showcase.edition}</span>
        </div>
        <div className="studio-headline">{showcase.headline}</div>
        <CollectionComposition project={project} />
        {showcase.identity === "nudge" && (
          <div className="nudge-product">
            <div className="studio-phone studio-phone-back">
              <img src={images[2].src} alt="" loading="lazy" />
              <span className="device-edge" />
            </div>
            <div className="studio-phone studio-phone-front">
              <img src={images[1].src} alt="" loading="lazy" />
              <span className="device-edge" />
            </div>
            <div className="island-detail">
              <div className="island-detail-row">
                <span className="island-bell"><Bell size={19} fill="currentColor" /></span>
                <span><b>DRINK WATER</b><small>It's time</small></span>
                <strong>00:00</strong>
              </div>
              <div className="island-queue"><span>9:30 AM</span> Take vitamins</div>
              <div className="island-actions"><span><Check size={12} /> Done</span><span><Clock3 size={11} /> 5m</span><span>10m</span><span>30m</span></div>
            </div>
            <span className="studio-annotation nudge-annotation"><i /> A little reminder. Right where you are.</span>
          </div>
        )}
        {showcase.identity === "nivra" && (
          <div className="nivra-product">
            <div className="studio-laptop">
              <div className="laptop-display"><img src={images[0].src} alt="" loading="lazy" /></div>
              <div className="laptop-base"><i /></div>
            </div>
            <div className="notch-detail">
              <div className="notch-bridge"><i /></div>
              <img src={images[1].src} alt="" loading="lazy" />
            </div>
            <div className="signal-orbit"><span><Command size={12} /> Agents</span><span><Clock3 size={12} /> Calendar</span><span><GitBranch size={12} /> Builds</span></div>
            <span className="studio-annotation nivra-annotation"><i /> Three signals. One thing that matters.</span>
          </div>
        )}
        {showcase.identity === "recurr" && (
          <div className="recurr-product">
            <div className="replay-flow"><span><i /> Capture</span><b>→</b><span><RotateCcw size={10} /> Replay</span><b>→</b><span><Layers size={10} /> Diff</span><b>→</b><span><Check size={10} /> Verify</span></div>
            <div className="recurr-workspace">
              <div className="workspace-chrome"><span><i /><i /><i /></span><small>checkout-api / incident workspace</small><span>↗</span></div>
              <img src={images[0].src} alt="" loading="lazy" />
              <span className="replay-scan" />
            </div>
            <div className="replay-terminal">
              <div><span>↳ local replay</span><small>CHECKOUT DEMO</small></div>
              <p><span>$</span> recurr replay RUN-AYMD8N</p>
              <p className="terminal-captured"><i /> Original failure reproduced <b>500</b></p>
              <p className="terminal-verified"><Check size={12} /> Fixed build verified <b>202</b></p>
            </div>
          </div>
        )}
        <div className="studio-bottomline"><span>{showcase.footer}</span><span>{open ? "Explore case study" : "Product showcase"} <ArrowUpRight size={13} /></span></div>
      </div>
      {open && <button className="studio-hit-target" onClick={open} aria-label={`Explore ${project.title}`} />}
    </motion.div>
  );
}
