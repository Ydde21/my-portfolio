import { afterEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ProjectsSection from "./ProjectsSection";
import { projects, type MobileProject } from "./projects.data";

const mobileProject = projects.find(
  (project): project is MobileProject => project.kind === "mobile",
);

if (!mobileProject) {
  throw new Error("Expected at least one mobile project in projects.data.ts");
}

const originalStoreLinks = { ...mobileProject.storeLinks };

afterEach(() => {
  mobileProject.storeLinks = { ...originalStoreLinks };
});

describe("ProjectsSection", () => {
  it("renders the mobile featured project before web projects", () => {
    render(<ProjectsSection />);

    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent?.trim());

    expect(titles[0]).toBe(mobileProject.title);
  });

  it("shows mobile badge and platform chips", () => {
    render(<ProjectsSection />);

    expect(screen.getByText("Mobile App")).toBeInTheDocument();
    expect(screen.getByText("iOS")).toBeInTheDocument();
    expect(screen.getByText("Android")).toBeInTheDocument();
  });

  it("renders store links only when present", () => {
    mobileProject.storeLinks = { appStore: originalStoreLinks.appStore };

    render(<ProjectsSection />);

    expect(screen.getByRole("link", { name: /app store/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /google play/i }),
    ).not.toBeInTheDocument();
  });

  it("always renders case study for mobile projects", () => {
    mobileProject.storeLinks = {};

    render(<ProjectsSection />);

    expect(screen.getByRole("link", { name: /case study/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /app store/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /google play/i }),
    ).not.toBeInTheDocument();
  });

  it("renders one dot per mobile screenshot", () => {
    render(<ProjectsSection />);

    const mobileCard = screen.getByTestId("mobile-project-card");
    const dots = within(mobileCard).getAllByRole("button", {
      name: /go to slide/i,
    });

    expect(dots).toHaveLength(mobileProject.screenshots.length);
  });

  it("keeps a single-column layout until large screens", () => {
    render(<ProjectsSection />);

    const grid = screen.getByTestId("projects-grid");
    const mobileCard = screen.getByTestId("mobile-project-card");

    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("lg:grid-cols-3");
    expect(grid.className).not.toContain("sm:grid-cols-2");
    expect(mobileCard).toHaveClass("lg:col-span-2");
  });
});
