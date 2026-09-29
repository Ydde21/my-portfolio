import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="text-center">
        <p className="meta-label">Error — 404</p>
        <h1 className="font-display mt-6 text-6xl font-semibold tracking-tight text-foreground sm:text-7xl">
          Page not found.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Nothing lives at this address.
        </p>
        <a
          href="/"
          className="link-underline mt-8 inline-block text-sm font-medium text-foreground"
        >
          Return to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
