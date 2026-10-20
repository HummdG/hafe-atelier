import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { FullPageSlider } from "./FullPageSlider";

const sections = [
  { id: "one", label: "One", content: <p>1</p> },
  { id: "two", label: "Two", content: <p>2</p> },
  { id: "three", label: "Three", content: <p>3</p> },
];

let ioCallback: IntersectionObserverCallback;
const scrollIntoView = vi.fn();

beforeEach(() => {
  scrollIntoView.mockReset();
  Element.prototype.scrollIntoView = scrollIntoView;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        ioCallback = cb;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("FullPageSlider", () => {
  it("renders one labelled dot per section", () => {
    render(<FullPageSlider sections={sections} />);
    const nav = screen.getByRole("navigation", { name: "Slides" });
    expect(within(nav).getAllByRole("button")).toHaveLength(3);
    expect(within(nav).getByRole("button", { name: "Go to Three" })).toBeInTheDocument();
  });

  it("scrolls to a section when its dot is clicked", () => {
    render(<FullPageSlider sections={sections} />);
    fireEvent.click(screen.getByRole("button", { name: "Go to Three" }));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById("three"));
  });

  it("marks the intersecting section as current and updates the hash", () => {
    const spy = vi.spyOn(history, "replaceState");
    render(<FullPageSlider sections={sections} />);
    expect(screen.getByRole("button", { name: "Go to One" })).toHaveAttribute("aria-current", "true");
    act(() => {
      ioCallback(
        [{ isIntersecting: true, target: document.getElementById("two")! } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(screen.getByRole("button", { name: "Go to Two" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Go to One" })).not.toHaveAttribute("aria-current");
    expect(spy).toHaveBeenCalledWith(null, "", "#two");
  });

  it("moves to the next section on ArrowDown", () => {
    render(<FullPageSlider sections={sections} />);
    fireEvent.keyDown(screen.getByTestId("slider"), { key: "ArrowDown" });
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById("two"));
  });
});
