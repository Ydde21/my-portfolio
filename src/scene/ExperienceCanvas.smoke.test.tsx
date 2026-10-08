import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ExperienceCanvas from "./ExperienceCanvas";
import HeroSection from "@/components/portfolio/HeroSection";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("ExperienceCanvas", () => {
  it("keeps the same model's static portrait and portfolio content without WebGL", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(
      <>
        <ExperienceCanvas />
        <HeroSection />
      </>,
    );
    expect(container.querySelector(".robot-fallback")).toHaveAttribute(
      "src",
      "/robot-preview.webp",
    );
    expect(container.querySelector("canvas")).toBeNull();
    expect(document.documentElement.dataset.robotReady).toBeUndefined();
    expect(
      screen.getByRole("link", { name: "Explore my work" }),
    ).toHaveAttribute("href", "#work");
    expect(error).toHaveBeenCalledWith(
      "THREE.WebGLRenderer: Error creating WebGL context.",
    );
  });
});
