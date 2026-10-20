import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import { RequestBagProvider } from "./RequestBagProvider";
import { Header } from "./Header";
import { BAG_KEY } from "@/lib/bag";

vi.mock("next/navigation", () => ({ usePathname: () => "/collections" }));

const item = {
  id: "seed-1",
  pieceSlug: null,
  pieceName: "Bespoke from scratch",
  customisation: {
    changes: "", colours: "", fabric: "", occasion: "",
    sizeMode: "standard", standardSize: "M", unit: "cm", notes: "",
  },
};

const setup = () =>
  render(
    <RequestBagProvider>
      <Header variant="solid" />
    </RequestBagProvider>,
  );

describe("Header", () => {
  beforeEach(() => localStorage.clear());

  it("links the wordmark home", () => {
    setup();
    expect(screen.getByText("HAFE ATELIER").closest("a")).toHaveAttribute("href", "/");
  });

  it("links to the request bag", () => {
    setup();
    expect(screen.getByRole("link", { name: /request bag/i })).toHaveAttribute("href", "/request");
  });

  it("shows no badge before hydration, then the count", async () => {
    localStorage.setItem(BAG_KEY, JSON.stringify([item]));
    // server/first render: effects have not run, so the bag is not hydrated
    const html = renderToString(
      <RequestBagProvider>
        <Header variant="solid" />
      </RequestBagProvider>,
    );
    expect(html).not.toMatch(/>1</);
    setup();
    expect(await screen.findByText("1")).toBeInTheDocument();
  });

  it("toggles the menu drawer", () => {
    setup();
    const btn = screen.getByRole("button", { name: /menu/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Collections" })).toBeInTheDocument();
  });

  it("portals the drawer to body and restores focus to the menu button on close", () => {
    const { container } = setup();
    const btn = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(btn);
    const nav = screen.getByRole("navigation", { name: "Main menu" });
    expect(container.contains(nav)).toBe(false);
    expect(document.body.contains(nav)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Main menu" })).not.toBeInTheDocument();
    expect(btn).toHaveFocus();
  });
});
