import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HowItWorksPage from "./page";

describe("HowItWorksPage", () => {
  it("renders the heading and the five steps in order", () => {
    render(<HowItWorksPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Your vision brought to life" })).toBeInTheDocument();
    const steps = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(steps).toEqual([
      "Step 1: Share your inspiration",
      "Step 2: Video consultation & size guide",
      "Step 3: Progress updates & design check‑ins",
      "Step 4: Complete your look",
      "Step 5: Delivered to your door",
    ]);
  });

  it("links the call to action to the bespoke brief", () => {
    render(<HowItWorksPage />);
    expect(screen.getByRole("link", { name: "Share your inspiration" })).toHaveAttribute("href", "/bespoke#brief");
  });

  it("gives every content image alt text (decorative ones are explicitly empty)", () => {
    const { container } = render(<HowItWorksPage />);
    const imgs = Array.from(container.querySelectorAll("img"));
    expect(imgs.length).toBeGreaterThanOrEqual(10);
    for (const img of imgs) expect(img.hasAttribute("alt")).toBe(true);
    expect(imgs.filter((i) => i.getAttribute("alt") !== "")).toHaveLength(10);
  });
});
