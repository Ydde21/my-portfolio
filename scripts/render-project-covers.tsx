import { createRoot, type Root } from "react-dom/client";
import ProductShowcase from "../src/components/portfolio/ProductShowcase";
import { projects } from "../src/components/portfolio/projects.data";

// Development-only export helper. Capture the real composition, including its fonts.
let root: Root | undefined;
export function unmountProjectCover() {
  root?.unmount();
  root = undefined;
  document.getElementById("project-cover-export")?.remove();
}

export async function mountProjectCover(title: string) {
  const project = projects.find((item) => item.title === title);
  if (!project?.showcase) throw new Error(`No showcase for ${title}`);
  unmountProjectCover();
  const element = document.createElement("div");
  element.id = "project-cover-export";
  Object.assign(element.style, {
    position: "fixed", inset: "0 auto auto 0", width: "1000px", height: "700px",
    zIndex: "99999", background: "#0b0c10",
  });
  document.body.append(element);
  root = createRoot(element);
  root.render(<ProductShowcase project={project} />);
  await document.fonts.ready;
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(images.map((image) => image.decode()));
}
