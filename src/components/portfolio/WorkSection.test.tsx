import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import WorkSection from "./WorkSection";
import { projects } from "./projects.data";

afterEach(cleanup);
describe("project browsing", () => {
  it("keeps all 18 real projects discoverable and filters by platform", async () => {
    render(<WorkSection />);
    const collection = screen.getByRole("region", {
      name: "More ideas. More possibilities.",
    });
    projects.forEach((project) =>
      expect(
        within(collection).getByRole("button", {
          name: `Explore ${project.title}`,
        }),
      ).toBeInTheDocument(),
    );
    fireEvent.click(within(collection).getByRole("button", { name: "Mobile" }));
    await waitFor(() =>
      expect(collection.querySelectorAll(".project-tile")).toHaveLength(2),
    );
    expect(
      within(collection).getByRole("button", { name: "Explore SaveWise" }),
    ).toBeInTheDocument();
    expect(within(collection).getByRole("button", { name: "Explore Nudge" })).toBeInTheDocument();
    fireEvent.click(
      within(collection).getByRole("button", { name: "Desktop" }),
    );
    await waitFor(() =>
      expect(collection.querySelectorAll(".project-tile")).toHaveLength(2),
    );
    expect(
      within(collection).getByRole("button", { name: "Explore NotchMeter" }),
    ).toBeInTheDocument();
    expect(within(collection).getByRole("button", { name: "Explore Nivra" })).toBeInTheDocument();
  });

  it("navigates the four featured chapters and opens the new case studies", async () => {
    render(<WorkSection />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Nudge", "Nivra", "Recurr", "NotchMeter"]);
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(tabs[3]).toHaveAttribute("aria-selected", "true");
    expect(tabs[3]).toHaveFocus();
    fireEvent.keyDown(tabs[3], { key: "ArrowRight" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(tabs[3]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[3], { key: "Home" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    const collection = screen.getByRole("region", { name: "More ideas. More possibilities." });
    for (const name of ["Nudge", "Nivra", "Recurr"]) {
      const tile = within(collection).getByRole("button", { name: `Explore ${name}` });
      tile.focus();
      fireEvent.click(tile);
      const dialog = screen.getByRole("dialog", { name });
      expect(dialog).toHaveTextContent("THE CHALLENGE");
      expect(dialog).toHaveTextContent("THE APPROACH");
      if (name === "Nudge") expect(within(dialog).queryByRole("link")).not.toBeInTheDocument();
      fireEvent.click(within(dialog).getByRole("button", { name: "Close project" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      expect(tile).toHaveFocus();
    }
  });

  it("opens original project details, cycles every screenshot, and resets on reopen", async () => {
    const { container } = render(<WorkSection />);
    const tile = within(
      container.querySelector("#all-projects")! as HTMLElement,
    ).getByRole("button", { name: "Explore NotchMeter" });
    const project = projects.find((project) => project.title === "NotchMeter")!;
    const images =
      project.kind === "web" ? project.images : project.screenshots;
    fireEvent.click(tile);
    const dialog = screen.getByRole("dialog", { name: "NotchMeter" });
    expect(dialog).toHaveTextContent(project.description);
    expect(
      within(dialog).getByRole("link", { name: "View source: NotchMeter" }),
    ).toHaveAttribute("href", "https://github.com/Ydde21/NotchMeter");
    const gallery = dialog.querySelector(".dialog-gallery > img")!;
    const next = within(dialog).getByRole("button", {
      name: "Next screenshot of NotchMeter",
    });
    for (let i = 1; i <= images.length; i++) {
      fireEvent.click(next);
      expect(gallery).toHaveAttribute(
        "alt",
        images[i % images.length].alt,
      );
    }
    fireEvent.click(
      within(dialog).getByRole("button", {
        name: "Previous screenshot of NotchMeter",
      }),
    );
    expect(gallery).toHaveAttribute(
      "alt",
      images[images.length - 1].alt,
    );
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Close project" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    fireEvent.click(tile);
    expect(screen.getByRole("dialog").querySelector(".dialog-gallery > img")).toHaveAttribute(
      "alt",
      images[0].alt,
    );
  });

  it("links SaveWise to its real release and allows keyboard chapter selection", () => {
    render(<WorkSection />);
    const tabs = screen.getAllByRole("tab");
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveFocus();
    fireEvent.click(
      within(
        screen.getByRole("region", { name: "More ideas. More possibilities." }),
      ).getByRole("button", { name: "Explore SaveWise" }),
    );
    expect(
      within(screen.getByRole("dialog", { name: "SaveWise" })).getByRole(
        "link",
        { name: "View release: SaveWise" },
      ),
    ).toHaveAttribute(
      "href",
      "https://github.com/Ydde21/SaveWise/releases/tag/SaveWise",
    );
  });
});
