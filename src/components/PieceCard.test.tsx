import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PieceCard } from "./PieceCard";
import type { Piece } from "@/data/types";

const base: Piece = {
  slug: "test-piece",
  name: "Test Piece",
  collection: "bridal",
  description: "d",
  fabric: "f",
  craft: "c",
  images: ["/images/placeholders/test-piece-1.svg", "/images/placeholders/test-piece-2.svg"],
};

describe("PieceCard", () => {
  it("shows name, price copy and links to the piece", () => {
    render(<PieceCard piece={base} />);
    expect(screen.getByText("Test Piece")).toBeInTheDocument();
    expect(screen.getByText("Price on request")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/pieces/test-piece");
  });
  it("renders a hover image when there are two images", () => {
    const { container } = render(<PieceCard piece={base} />);
    expect(container.querySelectorAll("img")).toHaveLength(2);
    expect(container.querySelector("img.opacity-0")?.className).toContain("group-hover:opacity-100");
  });
  it("renders one image when there is only one", () => {
    const { container } = render(<PieceCard piece={{ ...base, images: [base.images[0]] }} />);
    expect(container.querySelectorAll("img")).toHaveLength(1);
  });
});
