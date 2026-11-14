import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("@/components/Footer", () => ({ Footer: () => <footer>footer</footer> }));

import HowItWorksPage from "./page";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("HowItWorksPage", () => {
  it("renders one h1 and the five steps in order", () => {
    render(<HowItWorksPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your vision brought to life");
    const steps = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(steps).toEqual([
      "Step 1: Share your inspiration",
      "Step 2: Video consultation & size guide",
      "Step 3: Progress updates & design check‑ins",
      "Step 4: Complete your look",
      "Step 5: Delivered to your door",
    ]);
  });

  it("puts each step on its own slide, followed by the footer, with a dot for each", () => {
    render(<HowItWorksPage />);
    const dots = within(screen.getByRole("navigation", { name: "Slides" })).getAllByRole("button");
    expect(dots.map((d) => d.getAttribute("aria-label"))).toEqual([
      "Go to Share your inspiration",
      "Go to Video consultation & size guide",
      "Go to Progress updates & design check-ins",
      "Go to Complete your look",
      "Go to Delivered to your door",
      "Go to Contact",
    ]);
  });

  it("links the call to action to the bespoke brief", () => {
    render(<HowItWorksPage />);
    expect(screen.getByRole("link", { name: "Share your inspiration" })).toHaveAttribute("href", "/bespoke#brief");
  });

  it("gives every content image alt text (decorative ones are explicitly empty)", () => {
    const { container } = render(<HowItWorksPage />);
    const imgs = Array.from(container.querySelectorAll("img"));
    for (const img of imgs) expect(img.hasAttribute("alt")).toBe(true);
    expect(imgs.filter((i) => i.getAttribute("alt") !== "")).toHaveLength(10);
  });
});
