import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "./db";
import {
  addSource,
  completeLesson,
  getProgress,
  removeSource,
  setStage,
  setStyle,
} from "./progress";

const source = {
  id: randomUUID(),
  title: "Basic step",
  url: "https://www.youtube.com/watch?v=abc",
  style: "salsa" as const,
  kind: "Video" as const,
};

afterAll(() => pool.end());

describe("progress repository", () => {
  it("returns empty progress for an unknown learner", async () => {
    expect(await getProgress(randomUUID())).toEqual({
      style: null,
      stages: { salsa: "rhythm", bachata: "rhythm" },
      completed: [],
      activity: [],
      sources: [],
    });
  });

  it("stores and returns a learner's progress", async () => {
    const learner = randomUUID();
    await setStyle(learner, "bachata");
    await setStyle(learner, "salsa");
    await setStage(learner, "salsa", "flow");
    await completeLesson(learner, "salsa-rhythm", "2026-11-06");
    await completeLesson(learner, "salsa-rhythm", "2026-11-07");
    await completeLesson(learner, "salsa-basic", "2026-11-07");
    await addSource(learner, source);
    expect(await getProgress(learner)).toEqual({
      style: "salsa",
      stages: { salsa: "flow", bachata: "rhythm" },
      completed: ["salsa-rhythm", "salsa-basic"],
      activity: ["2026-11-06", "2026-11-07"],
      sources: [source],
    });
  });

  it("removes only the learner's own source", async () => {
    const owner = randomUUID();
    const own = { ...source, id: randomUUID() };
    await addSource(owner, own);
    await removeSource(randomUUID(), own.id);
    expect((await getProgress(owner)).sources).toEqual([own]);
    await removeSource(owner, own.id);
    expect((await getProgress(owner)).sources).toEqual([]);
  });
});
