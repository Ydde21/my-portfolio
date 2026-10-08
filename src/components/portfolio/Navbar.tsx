import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import logoMark from "@/assets/logo-3d.png";
const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Résumé", href: "/CasasEddy.pdf" },
];
export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const resize = () => {
      if (innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  return (
    <header className={`site-header ${scrolled || open ? "is-scrolled" : ""}`}>
      <nav className="page-shell nav-inner" aria-label="Primary">
        <a className="brand" href="#home" aria-label="Eddy Casas home">
          <img className="brand-mark" src={logoMark} alt="" />
          <span>
            EDDY CASAS<span>SOFTWARE DEVELOPER</span>
          </span>
        </a>
        <div className="desktop-nav">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={link.href.endsWith(".pdf") ? "nav-resume" : undefined}
              target={link.href.endsWith(".pdf") ? "_blank" : undefined}
              rel={
                link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined
              }
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="nav-contact">
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="nav-controls">
          <button
            className="icon-control theme-toggle"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            ref={toggleRef}
            className="icon-control menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {[...links, { label: "Contact", href: "#contact" }].map(
              (link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.endsWith(".pdf") ? "_blank" : undefined}
                  rel={
                    link.href.endsWith(".pdf")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  <span>0{i + 1}</span>
                  {link.label}
                  <ArrowUpRight />
                </a>
              ),
            )}
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.div
        className="reading-progress"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
