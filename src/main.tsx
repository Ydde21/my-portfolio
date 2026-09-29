import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Cinematic dark theme by default — applied before first paint of the app.
if (!localStorage.getItem("theme")) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
