import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequestBagProvider, useBag } from "@/components/RequestBagProvider";
import { BespokeBrief } from "./BespokeBrief";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function Probe() {
  const { count, items } = useBag();
  return <p data-testid="probe">{`count:${count}|${items[0]?.pieceSlug === null ? "null" : "set"}|${items[0]?.pieceName ?? ""}`}</p>;
}

describe("BespokeBrief", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  it("adds a from-scratch item and routes to /request", async () => {
    const user = userEvent.setup();
    render(
      <RequestBagProvider>
        <BespokeBrief />
        <Probe />
      </RequestBagProvider>,
    );
    await user.type(screen.getByLabelText(/what would you change/i), "A emerald gharara for my nikah");
    await user.click(screen.getByRole("button", { name: /add my brief/i }));
    await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/request"));
    expect(screen.getByTestId("probe")).toHaveTextContent("count:1|null|Bespoke from scratch");
  });
});
