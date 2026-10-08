import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource-variable/space-grotesk/index.css";
import "@fontsource-variable/instrument-sans/index.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./index.css";

// Cinematic dark theme by default — applied before first paint of the app.
if (!localStorage.getItem("theme")) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
