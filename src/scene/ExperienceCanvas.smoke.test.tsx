/* Temporary smoke test — verifies the component mounts and renders the
   machine-fallback div when WebGL is unavailable (jsdom). */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import ExperienceCanvas from "./ExperienceCanvas";

describe("ExperienceCanvas", () => {
  it("mounts and falls back gracefully without WebGL", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => {
      root.render(createElement(ExperienceCanvas));
    });
    const el = host.querySelector(".machine-fallback");
    expect(el).toBeTruthy();
    await act(async () => {
      root.unmount();
    });
    document.body.removeChild(host);
  });
});
