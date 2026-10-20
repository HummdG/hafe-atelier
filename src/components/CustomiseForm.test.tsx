import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomiseForm, DEFAULT_CUSTOMISATION } from "./CustomiseForm";

describe("CustomiseForm", () => {
  it("shows measurement inputs only in custom mode", async () => {
    const user = userEvent.setup();
    render(<CustomiseForm defaultValues={DEFAULT_CUSTOMISATION} submitLabel="Save" onSubmit={vi.fn()} />);
    expect(screen.queryByLabelText("Chest")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Custom measurements"));
    expect(screen.getByLabelText("Chest")).toBeInTheDocument();
  });

  it("blocks submit and flags chest when it is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CustomiseForm defaultValues={DEFAULT_CUSTOMISATION} submitLabel="Save" onSubmit={onSubmit} />);
    await user.click(screen.getByLabelText("Custom measurements"));
    await user.type(screen.getByLabelText("Shirt length"), "40");
    await user.type(screen.getByLabelText("Waist"), "30");
    await user.type(screen.getByLabelText("Hip"), "38");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Chest is required")).toBeInTheDocument();
    expect(screen.getByLabelText("Chest")).toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.each(["0", "-5"])("says 'Must be greater than 0' (not 'required') for chest = %s", async (value) => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CustomiseForm defaultValues={DEFAULT_CUSTOMISATION} submitLabel="Save" onSubmit={onSubmit} />);
    await user.click(screen.getByLabelText("Custom measurements"));
    await user.type(screen.getByLabelText("Shirt length"), "40");
    await user.type(screen.getByLabelText("Chest"), value);
    await user.type(screen.getByLabelText("Waist"), "30");
    await user.type(screen.getByLabelText("Hip"), "38");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Must be greater than 0")).toBeInTheDocument();
    expect(screen.queryByText("Chest is required")).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits numeric inch measurements without standardSize", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CustomiseForm defaultValues={DEFAULT_CUSTOMISATION} submitLabel="Save" onSubmit={onSubmit} />);
    await user.click(screen.getByLabelText("Custom measurements"));
    await user.click(screen.getByLabelText("in"));
    await user.type(screen.getByLabelText("Shirt length"), "40");
    await user.type(screen.getByLabelText("Chest"), "36");
    await user.type(screen.getByLabelText("Waist"), "30");
    await user.type(screen.getByLabelText("Hip"), "38");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const c = onSubmit.mock.calls[0][0];
    expect(c.unit).toBe("in");
    expect(c.sizeMode).toBe("custom");
    expect(c.standardSize).toBeUndefined();
    expect(c.measurements).toEqual({ shirtLength: 40, chest: 36, waist: 30, hip: 38 });
  });

  it("submits a standard size without measurements", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CustomiseForm defaultValues={DEFAULT_CUSTOMISATION} submitLabel="Save" onSubmit={onSubmit} />);
    await user.selectOptions(screen.getByLabelText("Size"), "S");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const c = onSubmit.mock.calls[0][0];
    expect(c.standardSize).toBe("S");
    expect(c.measurements).toBeUndefined();
  });
});
