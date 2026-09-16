import { Github, Linkedin, ArrowUp } from "lucide-react";

const socials = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="border-t border-border px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-xl tracking-tight">Eddy Casas</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Full Stack Developer — Bacolod City, Philippines
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
                className="link-underline text-sm text-muted-foreground hover:text-foreground"
                aria-label={s.label}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
          <button
            onClick={scrollToTop}
            className="link-underline inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Top
          </button>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Eddy Casas. Designed and built by hand.
        </p>
      </div>
    </footer>
  );
}
