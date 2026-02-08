export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-5">
      <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Eddy Casas. All rights reserved.</span>
      </div>
    </footer>
  );
}
