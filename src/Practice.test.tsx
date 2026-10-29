import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Practice from "./Practice";
import { LanguageProvider, LANGUAGE_KEY } from "./i18n";
beforeEach(() => localStorage.setItem(LANGUAGE_KEY, "en"));

describe("guided practice", () => {
  it("starts paused, advances the count, pauses, resumes and resets", () => {
    vi.useFakeTimers();
    const { container } = render(<Practice style="salsa" />, {
      wrapper: LanguageProvider,
    });
    expect(screen.getByRole("timer")).toHaveTextContent("1:00");
    fireEvent.click(screen.getByRole("button", { name: "Start practice" }));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("timer")).toHaveTextContent("0:59");
    expect(container.querySelector(".beat-display>span")).toHaveTextContent(
      "2",
    );
    fireEvent.click(screen.getByRole("button", { name: "Pause practice" }));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole("timer")).toHaveTextContent("0:59");
    fireEvent.click(screen.getByRole("button", { name: "Resume practice" }));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("timer")).toHaveTextContent("0:58");
    fireEvent.click(screen.getByRole("button", { name: "Reset practice" }));
    expect(screen.getByRole("timer")).toHaveTextContent("1:00");
    expect(container.querySelector(".beat-display>span")).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByRole("button", { name: "Start practice" }),
    ).toBeVisible();
  });
  it("changes tempo, marks salsa holds, and wraps after eight counts", () => {
    vi.useFakeTimers();
    const { container } = render(<Practice style="salsa" />, {
      wrapper: LanguageProvider,
    });
    fireEvent.change(screen.getByRole("slider"), { target: { value: "120" } });
    expect(screen.getByText("120 BPM")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Start practice" }));
    act(() => vi.advanceTimersByTime(1500));
    expect(container.querySelector(".beat-display>small")).toHaveTextContent(
      "hold",
    );
    act(() => vi.advanceTimersByTime(2500));
    expect(container.querySelector(".beat-display>span")).toHaveTextContent(
      "1",
    );
  });
  it("marks bachata taps and applies tempo changes during practice", () => {
    vi.useFakeTimers();
    const { container } = render(<Practice style="bachata" />, {
      wrapper: LanguageProvider,
    });
    fireEvent.click(screen.getByRole("button", { name: "Start practice" }));
    act(() => vi.advanceTimersByTime(1500));
    fireEvent.change(screen.getByRole("slider"), { target: { value: "60" } });
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector(".beat-display>small")).toHaveTextContent(
      "tap",
    );
  });
  it("stops after one minute, restarts, and cleans up intervals on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<Practice style="bachata" />, {
      wrapper: LanguageProvider,
    });
    fireEvent.click(screen.getByRole("button", { name: "Start practice" }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByRole("timer")).toHaveTextContent("0:00");
    expect(screen.getByRole("status")).toHaveTextContent(
      "One minute, well spent.",
    );
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Practice again" }));
    expect(screen.getByRole("timer")).toHaveTextContent("1:00");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("timer")).toHaveTextContent("0:59");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
