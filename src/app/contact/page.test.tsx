import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/site", () => ({
  site: {
    email: "hi@example.com",
    whatsappNumber: "+92 300-123 4567",
    instagram: "https://instagram.com/some_handle/",
  },
}));

import ContactPage from "./page";

describe("ContactPage", () => {
  it("strips non-digits from the wa.me link", () => {
    render(<ContactPage />);
    expect(screen.getByRole("link", { name: "Message us" })).toHaveAttribute("href", "https://wa.me/923001234567");
  });

  it("derives the Instagram handle from site.instagram", () => {
    render(<ContactPage />);
    expect(screen.getByRole("link", { name: "@some_handle" })).toHaveAttribute("href", "https://instagram.com/some_handle/");
  });
});
