import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Reading position: raw scroll progress, spring-smoothed so the hairline
     glides instead of stepping with each wheel tick. */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className="relative transition-all duration-500"
        style={
          scrolled || open
            ? {
                background: "var(--nav-blur)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: "1px solid hsl(var(--border) / 0.7)",
              }
            : { borderBottom: "1px solid transparent" }
        }
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#home"
            className="font-display text-base font-semibold tracking-tight text-foreground"
          >
            EDDY CASAS
            <span className="meta-label ml-2 hidden !text-[0.625rem] sm:inline">
              / Software Developer
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-underline text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={toggle}
              className="border border-border p-2 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              className="border border-border p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="border border-border p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-1 border-t border-border/70 px-5 py-4">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-2.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll progress — a hairline in the accent, aligned to the nav edge */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      </nav>
    </motion.header>
  );
}
