import { describe, expect, it, vi } from "vitest";
import {
  completeLesson,
  dateKey,
  emptyProgress,
  loadProgress,
  nextLesson,
  normalizeUrl,
  previousDay,
  sourceKind,
  STORAGE_KEY,
  streak,
} from "./model";
import { lessons } from "./lessons";

describe("local calendar dates and daily practice", () => {
  it("uses the local date rather than the UTC day", () => {
    const local = new Date(2026, 9, 29, 0, 15);
    expect(dateKey(local)).toBe("2026-10-29");
  });
  it("defaults to the current day and crosses month/year boundaries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12));
    expect(dateKey()).toBe("2026-01-01");
    expect(dateKey(previousDay(new Date()))).toBe("2025-12-31");
  });
  it("subtracts a calendar day across daylight saving changes without mutating input", () => {
    const date = new Date(2026, 9, 26, 0, 30);
    expect(dateKey(previousDay(date))).toBe("2026-10-25");
    expect(date.getDate()).toBe(26);
  });
  it("counts a streak through today, ignoring duplicates and future dates", () => {
    expect(
      streak(
        ["2026-10-29", "2026-10-28", "2026-10-28", "2026-10-27", "2026-10-30"],
        new Date(2026, 9, 29),
      ),
    ).toBe(3);
  });
  it("keeps yesterday’s streak alive until today is over", () => {
    expect(streak(["2026-10-28", "2026-10-27"], new Date(2026, 9, 29))).toBe(2);
  });
  it("breaks the streak on a missing day", () => {
    expect(streak(["2026-10-27"], new Date(2026, 9, 29))).toBe(0);
    expect(streak([], new Date(2026, 9, 29))).toBe(0);
  });
  it("records a lesson only once, but repeat practice counts on new days", () => {
    const first = completeLesson(
      emptyProgress,
      "salsa-rhythm",
      new Date(2026, 9, 28),
    );
    const repeat = completeLesson(first, "salsa-rhythm", new Date(2026, 9, 28));
    const nextDay = completeLesson(
      repeat,
      "salsa-rhythm",
      new Date(2026, 9, 29),
    );
    expect(nextDay.completed).toEqual(["salsa-rhythm"]);
    expect(nextDay.activity).toEqual(["2026-10-28", "2026-10-29"]);
    expect(emptyProgress.completed).toEqual([]);
  });
  it("uses today when no completion date is supplied", () => {
    expect(completeLesson(emptyProgress, "salsa-rhythm").activity).toEqual([
      dateKey(),
    ]);
  });
});

describe("learning path", () => {
  it("starts at a chosen stage without completing earlier lessons", () => {
    expect(nextLesson("salsa", [], "basics").id).toBe("salsa-basic");
    expect(nextLesson("salsa", [], "flow").id).toBe("salsa-flow");
    expect(nextLesson("bachata", [], "flow").id).toBe("bachata-flow");
    expect(emptyProgress.completed).toEqual([]);
  });
  it("repeats the selected stage instead of sending experienced learners back to the first lesson", () => {
    expect(nextLesson("salsa", ["salsa-flow"], "flow").id).toBe("salsa-flow");
    expect(nextLesson("bachata", ["bachata-side"], "basics").id).toBe(
      "bachata-tap",
    );
  });
  it("suggests the first incomplete lesson independently for each style", () => {
    expect(nextLesson("salsa", ["salsa-rhythm"]).id).toBe("salsa-basic");
    expect(nextLesson("bachata", ["salsa-rhythm"]).id).toBe("bachata-rhythm");
  });
  it("suggests a repeat of the foundations after finishing the path", () => {
    expect(
      nextLesson(
        "salsa",
        lessons.salsa.map((lesson) => lesson.id),
      ).id,
    ).toBe("salsa-rhythm");
  });
  it("provides complete instruction and valid quizzes for all eight lessons", () => {
    const all = [...lessons.salsa, ...lessons.bachata];
    expect(new Set(all.map((lesson) => lesson.id)).size).toBe(8);
    all.forEach((lesson) => {
      expect(lesson.steps).toHaveLength(4);
      expect(lesson.learn.length).toBeGreaterThan(80);
      expect(lesson.answers[lesson.correct]).toBeTruthy();
    });
  });
});

describe("browser storage", () => {
  it("persists independent stage choices and recovers invalid stages without losing progress", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...emptyProgress,
        completed: ["salsa-rhythm"],
        stages: { salsa: "flow", bachata: "basics" },
      }),
    );
    expect(loadProgress().stages).toEqual({ salsa: "flow", bachata: "basics" });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...emptyProgress,
        completed: ["salsa-rhythm"],
        stages: { salsa: "unknown", bachata: "flow" },
      }),
    );
    expect(loadProgress().stages).toEqual({ salsa: "rhythm", bachata: "flow" });
    expect(loadProgress().completed).toEqual(["salsa-rhythm"]);
  });
  it("starts empty and round-trips valid progress with sources", () => {
    expect(loadProgress()).toEqual(emptyProgress);
    const saved = {
      style: "salsa",
      completed: ["salsa-rhythm"],
      activity: ["2026-10-29"],
      sources: [
        {
          id: "1",
          title: "My source",
          url: "https://youtube.com/watch?v=123",
          style: "salsa",
          kind: "Video",
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    expect(loadProgress()).toEqual({ ...saved, stages: emptyProgress.stages });
  });
  it.each([
    "broken json",
    "null",
    "{}",
    '{"style":"tango"}',
    '{"style":"salsa","completed":[3],"activity":[],"sources":[]}',
    '{"style":"salsa","completed":[],"activity":[4],"sources":[]}',
    '{"style":"salsa","completed":[],"activity":[],"sources":[null]}',
  ])("recovers from malformed stored data: %s", (stored) => {
    localStorage.setItem(STORAGE_KEY, stored);
    expect(loadProgress()).toEqual(emptyProgress);
  });
  it("rejects unsafe source URLs restored from storage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...emptyProgress,
        style: "salsa",
        sources: [
          {
            id: "1",
            title: "Bad",
            style: "salsa",
            kind: "Article",
            url: "javascript:alert(1)",
          },
        ],
      }),
    );
    expect(loadProgress()).toEqual(emptyProgress);
  });
  it("continues if storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    expect(loadProgress()).toEqual(emptyProgress);
  });
});

describe("source URLs", () => {
  it.each([
    "javascript:alert(1)",
    "data:text/html,hello",
    "file:///etc/passwd",
    "not a url",
    "",
    "youtube.com",
  ])("rejects invalid or non-web URLs: %s", (url) => {
    expect(normalizeUrl(url)).toBeNull();
  });
  it("accepts and trims complete http and https URLs", () => {
    expect(normalizeUrl(" https://example.com ")).toBe("https://example.com/");
    expect(normalizeUrl("http://example.com/lesson")).toBe(
      "http://example.com/lesson",
    );
  });
  it.each([
    ["https://www.youtube.com/watch?v=a", "Video"],
    ["https://youtu.be/a", "Video"],
    ["https://m.youtube.com/watch?v=a", "Video"],
    ["https://vimeo.com/123", "Video"],
    ["https://instagram.com/dancer", "Social"],
    ["https://www.tiktok.com/@dancer", "Social"],
    ["https://thedancedojo.com/", "Article"],
    ["https://notyoutube.com/", "Article"],
  ])("classifies %s as %s", (url, expected) => {
    expect(sourceKind(url)).toBe(expected);
  });
});
