import { Github, Linkedin, ArrowUp } from "lucide-react";

const socials = [
  { icon: Github, href: "https://github.com/Ydde21", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/eddy-casas-72a07b364/", label: "LinkedIn" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-xl tracking-tight">EDDY CASAS</p>
          <p className="meta-label mt-2">
            Software Developer — Bacolod City, PH
          </p>
        </div>

        <div className="flex items-center gap-6">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={s.label}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
          <a
            href="mailto:yddecsasas21@gmail.com"
            className="link-underline text-sm text-muted-foreground hover:text-foreground"
          >
            Email
          </a>
          <button
            onClick={scrollToTop}
            className="link-underline inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Top
          </button>
        </div>
      </div>
    </footer>
  );
}
