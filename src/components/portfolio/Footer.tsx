export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Eddy Casas. All rights reserved.</span>
        <span className="font-display text-foreground font-semibold">
          EC<span className="text-primary">.</span>
        </span>
      </div>
    </footer>
  );
}
