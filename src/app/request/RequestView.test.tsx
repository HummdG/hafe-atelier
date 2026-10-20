import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequestBagProvider } from "@/components/RequestBagProvider";
import { BAG_KEY } from "@/lib/bag";
import { RequestView } from "./RequestView";
import { ImagePicker } from "@/components/ImagePicker";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/site", async (orig) => {
  const mod = await orig<typeof import("@/lib/site")>();
  return { ...mod, site: { ...mod.site, whatsappNumber: "+44 7700 900123" } };
});

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
  beforeEach(() => {
    localStorage.clear();
    push.mockReset();
    vi.unstubAllGlobals();
  });

  async function fillAndClick(user: ReturnType<typeof userEvent.setup>, button: string) {
    await user.type(await screen.findByLabelText("Name"), "Amina Khan");
    await user.type(screen.getByLabelText("Email"), "amina@example.com");
    await user.type(screen.getByLabelText("Country"), "UK");
    await user.click(screen.getByRole("button", { name: button }));
  }

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

  it("sends by email, clears the bag and goes to the thank-you page", async () => {
    const user = userEvent.setup();
    const onSubmit = setup();
    await fillAndClick(user, "Send request");
    await waitFor(() => expect(push).toHaveBeenCalledWith("/request/sent"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][2]).toBe("email");
    expect(JSON.parse(localStorage.getItem(BAG_KEY) ?? "[]")).toEqual([]);
  });

  it("opens the WhatsApp window synchronously and points it at wa.me after success", async () => {
    const user = userEvent.setup();
    const win = { location: { href: "" }, close: vi.fn(), opener: {} as unknown };
    const open = vi.fn().mockReturnValue(win);
    vi.stubGlobal("open", open);
    let resolveSubmit!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((r) => (resolveSubmit = r)));
    setup(seed, onSubmit);
    await fillAndClick(user, "Send & continue on WhatsApp");
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(open).toHaveBeenCalledWith("", "_blank");
    expect(win.opener).toBeNull();
    expect(win.location.href).toBe("");
    resolveSubmit();
    await waitFor(() => expect(push).toHaveBeenCalledWith("/request/sent"));
    expect(win.location.href).toMatch(/^https:\/\/wa\.me\/447700900123\?text=/);
    expect(win.close).not.toHaveBeenCalled();
    const [payload, files, via] = onSubmit.mock.calls[0] as unknown as [{ items: unknown[]; client: { name: string } }, File[], string];
    expect(via).toBe("whatsapp");
    expect(files).toEqual([]);
    expect(payload.items).toHaveLength(2);
    expect(payload.client.name).toBe("Amina Khan");
  });

  it("closes the WhatsApp window and shows the error on failure", async () => {
    const user = userEvent.setup();
    const win = { location: { href: "" }, close: vi.fn() };
    vi.stubGlobal("open", vi.fn().mockReturnValue(win));
    setup(seed, vi.fn().mockRejectedValue(new Error("Too many requests — please try again in a few minutes")));
    await fillAndClick(user, "Send & continue on WhatsApp");
    expect(await screen.findByText(/Too many requests/)).toBeInTheDocument();
    expect(win.close).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByText("Noor")).toBeInTheDocument();
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
