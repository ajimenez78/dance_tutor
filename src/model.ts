import { lessons } from "./lessons";
import type { Style } from "./lessons";

export type Source = {
  id: string;
  title: string;
  url: string;
  style: Style;
  kind: "Video" | "Social" | "Article";
};
export type Progress = {
  stages: Record<Style, StartingStage>;
  style: Style | null;
  completed: string[];
  activity: string[];
  sources: Source[];
};
export const STORAGE_KEY = "ritmo-v1";
export type StartingStage = "rhythm" | "basics" | "flow";
export const stageStart: Record<StartingStage, number> = {
  rhythm: 0,
  basics: 1,
  flow: 3,
};
export const emptyProgress: Progress = {
  stages: { salsa: "rhythm", bachata: "rhythm" },
  style: null,
  completed: [],
  activity: [],
  sources: [],
};

export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function previousDay(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - 1);
  return result;
}

export function streak(activity: string[], now = new Date()): number {
  let cursor = activity.includes(dateKey(now)) ? now : previousDay(now);
  let count = 0;
  while (activity.includes(dateKey(cursor))) {
    count++;
    cursor = previousDay(cursor);
  }
  return count;
}

export function completeLesson(
  progress: Progress,
  id: string,
  now = new Date(),
): Progress {
  return {
    ...progress,
    completed: [...new Set([...progress.completed, id])],
    activity: [...new Set([...progress.activity, dateKey(now)])],
  };
}

export function nextLesson(
  style: Style,
  completed: string[],
  stage: StartingStage = "rhythm",
) {
  const available = lessons[style].slice(stageStart[stage]);
  return (
    available.find((lesson) => !completed.includes(lesson.id)) ?? available[0]
  );
}

export function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...emptyProgress };
    const value = JSON.parse(stored) as Progress;
    if (
      (value.style !== null &&
        value.style !== "salsa" &&
        value.style !== "bachata") ||
      !Array.isArray(value.completed) ||
      !value.completed.every((id) => typeof id === "string") ||
      !Array.isArray(value.activity) ||
      !value.activity.every((day) => typeof day === "string") ||
      !Array.isArray(value.sources) ||
      !value.sources.every(
        (source) =>
          source &&
          typeof source.id === "string" &&
          typeof source.title === "string" &&
          (source.style === "salsa" || source.style === "bachata") &&
          ["Video", "Social", "Article"].includes(source.kind) &&
          normalizeUrl(source.url),
      )
    )
      return { ...emptyProgress };
    const storedStage = (style: Style): StartingStage =>
      ["rhythm", "basics", "flow"].includes(value.stages?.[style])
        ? value.stages[style]
        : "rhythm";
    return {
      ...value,
      stages: { salsa: storedStage("salsa"), bachata: storedStage("bachata") },
    };
  } catch {
    return { ...emptyProgress };
  }
}

export function normalizeUrl(input: string): string | null {
  try {
    const url = new URL(input.trim());
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function sourceKind(url: string): Source["kind"] {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (["youtube.com", "youtu.be", "m.youtube.com", "vimeo.com"].includes(host))
    return "Video";
  if (
    [
      "instagram.com",
      "tiktok.com",
      "facebook.com",
      "x.com",
      "twitter.com",
    ].includes(host)
  )
    return "Social";
  return "Article";
}
