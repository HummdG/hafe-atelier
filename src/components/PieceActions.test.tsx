import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequestBagProvider, useBag } from "./RequestBagProvider";
import { PieceActions } from "./PieceActions";

function Probe() {
  const { count, items } = useBag();
  return <p data-testid="probe">{`count:${count}|${items[0]?.customisation.standardSize ?? ""}|${items[0]?.customisation.changes ?? ""}|${items[0]?.pieceSlug ?? ""}`}</p>;
}

function setup() {
  render(
    <RequestBagProvider>
      <PieceActions piece={{ slug: "noor", name: "Noor" }} />
      <Probe />
    </RequestBagProvider>,
  );
}

describe("PieceActions", () => {
  beforeEach(() => localStorage.clear());

  it("disables quick add until a size is chosen, and links to the size guide", () => {
    setup();
    expect(screen.getByRole("button", { name: "Add to request bag" })).toBeDisabled();
    expect(screen.getByLabelText("Size")).toHaveValue("");
    expect(screen.getByRole("link", { name: /see the size guide/i })).toHaveAttribute("href", "/size-guide");
  });

  it("adds the piece as shown", async () => {
    const user = userEvent.setup();
    setup();
    await user.selectOptions(screen.getByLabelText("Size"), "S");
    await user.click(screen.getByRole("button", { name: "Add to request bag" }));
    expect(screen.getByTestId("probe")).toHaveTextContent("count:1|S|As shown|noor");
    expect(screen.getByText("Added to your request bag")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view your request/i })).toHaveAttribute("href", "/request");
  });

  it("adds a customised piece from Make this mine", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Make this mine" }));
    const changes = screen.getByLabelText(/what would you change/i);
    await user.clear(changes);
    await user.type(changes, "Shorter sleeves");
    await user.selectOptions(screen.getAllByLabelText("Size")[1], "S");
    await user.click(screen.getByRole("button", { name: "Add my version to the bag" }));
    expect(await screen.findByText("Added to your request bag")).toBeInTheDocument();
    expect(screen.getByTestId("probe")).toHaveTextContent("count:1|S|Shorter sleeves|noor");
  });
});
