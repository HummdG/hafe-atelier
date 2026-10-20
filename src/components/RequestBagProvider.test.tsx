import { StrictMode } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RequestBagProvider, useBag } from "./RequestBagProvider";
import { BAG_KEY } from "@/lib/bag";

const item = {
  id: "seed-1",
  pieceSlug: null,
  pieceName: "Bespoke from scratch",
  customisation: {
    changes: "", colours: "", fabric: "", occasion: "",
    sizeMode: "standard", standardSize: "M", unit: "cm", notes: "",
  },
};

function Probe() {
  const { count, hydrated } = useBag();
  return <p data-testid="c">{hydrated ? `count:${count}` : "loading"}</p>;
}

describe("RequestBagProvider", () => {
  beforeEach(() => localStorage.clear());
  it("hydrates once under StrictMode without duplicating items", async () => {
    localStorage.setItem(BAG_KEY, JSON.stringify([item]));
    render(
      <StrictMode>
        <RequestBagProvider><Probe /></RequestBagProvider>
      </StrictMode>,
    );
    await waitFor(() => expect(screen.getByTestId("c")).toHaveTextContent("count:1"));
    await waitFor(() => expect(JSON.parse(localStorage.getItem(BAG_KEY)!)).toHaveLength(1));
  });
});
