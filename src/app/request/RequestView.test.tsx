import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequestBagProvider } from "@/components/RequestBagProvider";
import { BAG_KEY } from "@/lib/bag";
import { RequestView } from "./RequestView";
import { ImagePicker } from "@/components/ImagePicker";

const cust = {
  changes: "As shown", colours: "", fabric: "", occasion: "",
  sizeMode: "standard", standardSize: "M", unit: "cm", notes: "",
};
const seed = [
  { id: "a", pieceSlug: null, pieceName: "Bespoke from scratch", customisation: cust },
  { id: "b", pieceSlug: "noor", pieceName: "Noor", customisation: { ...cust, changes: "Shorter sleeves" } },
];

function setup(items: unknown[] = seed, onSubmit = vi.fn().mockResolvedValue(undefined)) {
  localStorage.setItem(BAG_KEY, JSON.stringify(items));
  render(
    <RequestBagProvider>
      <RequestView onSubmit={onSubmit} />
    </RequestBagProvider>,
  );
  return onSubmit;
}

describe("RequestView", () => {
  beforeEach(() => localStorage.clear());

  it("shows an empty state with links and no form", async () => {
    setup([]);
    expect(await screen.findByText("Your request bag is empty")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /collections/i })).toHaveAttribute("href", "/collections");
    expect(screen.getByRole("link", { name: /bespoke/i })).toHaveAttribute("href", "/bespoke");
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it("lists items and removes one", async () => {
    const user = userEvent.setup();
    setup();
    expect(await screen.findByText("Noor")).toBeInTheDocument();
    expect(screen.getByText("Bespoke from scratch")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /remove/i })[1]);
    expect(screen.queryByText("Noor")).not.toBeInTheDocument();
    expect(screen.getByText("Bespoke from scratch")).toBeInTheDocument();
  });

  it("shows errors for invalid client details and does not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = setup();
    await user.click(await screen.findByRole("button", { name: "Send request" }));
    expect((await screen.findAllByRole("alert")).length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sends via whatsapp with valid details", async () => {
    const user = userEvent.setup();
    const onSubmit = setup();
    await user.type(await screen.findByLabelText("Name"), "Amina Khan");
    await user.type(screen.getByLabelText("Email"), "amina@example.com");
    await user.type(screen.getByLabelText("Country"), "UK");
    await user.click(screen.getByRole("button", { name: "Send & continue on WhatsApp" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const [payload, files, via] = onSubmit.mock.calls[0];
    expect(via).toBe("whatsapp");
    expect(files).toEqual([]);
    expect(payload.items).toHaveLength(2);
    expect(payload.client.name).toBe("Amina Khan");
  });
});

describe("ImagePicker", () => {
  it("rejects non-images", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onChange = vi.fn();
    render(<ImagePicker files={[]} onChange={onChange} resize={async (f) => f} />);
    await user.upload(
      screen.getByLabelText(/inspiration photos/i),
      new File(["x"], "a.pdf", { type: "application/pdf" }),
    );
    expect(await screen.findByText("Only photos can be attached")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("blocks additions over the budget", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const big = new File([new Uint8Array(4_000_001)], "big.jpg", { type: "image/jpeg" });
    render(<ImagePicker files={[]} onChange={onChange} resize={async (f) => f} />);
    await user.upload(screen.getByLabelText(/inspiration photos/i), big);
    expect(await screen.findByText(/Photos too large/)).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("adds a valid photo", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ok = new File(["x"], "ok.jpg", { type: "image/jpeg" });
    render(<ImagePicker files={[]} onChange={onChange} resize={async (f) => f} />);
    await user.upload(screen.getByLabelText(/inspiration photos/i), ok);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith([ok]));
  });
});
