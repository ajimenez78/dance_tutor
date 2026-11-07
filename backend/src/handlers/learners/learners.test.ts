import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as progress from "../../progress";
import { handler as addSource } from "./addSource";
import { handler as completions } from "./completions";
import { handler as getProgress } from "./progress";
import { handler as removeSource } from "./removeSource";
import { handler as stage } from "./stage";
import { handler as style } from "./style";

vi.mock("../../progress");

const learner = "6f1c2b9e-3d4a-4c5b-8e7f-0a1b2c3d4e5f";
const sourceId = "0b9d8c7e-6f5a-4b3c-9d2e-1f0a9b8c7d6e";
const source = {
  id: sourceId,
  title: "Basic step",
  url: "https://www.youtube.com/watch?v=abc",
  style: "salsa",
  kind: "Video",
};

function request(path: Record<string, string>, body?: unknown) {
  return {
    pathParameters: path,
    body: body === undefined ? undefined : JSON.stringify(body),
  } as APIGatewayProxyEventV2;
}

beforeEach(() => vi.resetAllMocks());

describe("learner handlers", () => {
  it("returns the learner's progress", async () => {
    const stored = { style: "salsa", completed: [] };
    vi.mocked(progress.getProgress).mockResolvedValue(stored as never);
    const result = await getProgress(request({ learner }));
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body ?? "")).toEqual(stored);
    expect(progress.getProgress).toHaveBeenCalledWith(learner);
  });

  it("stores each kind of change", async () => {
    const results = [
      await style(request({ learner }, { style: "bachata" })),
      await stage(request({ learner, style: "salsa" }, { stage: "flow" })),
      await completions(
        request({ learner }, { lessonId: "salsa-rhythm", day: "2026-11-07" }),
      ),
      await addSource(request({ learner }, { ...source, extra: true })),
      await removeSource(request({ learner, source: sourceId })),
    ];
    for (const result of results) expect(result.statusCode).toBe(204);
    expect(progress.setStyle).toHaveBeenCalledWith(learner, "bachata");
    expect(progress.setStage).toHaveBeenCalledWith(learner, "salsa", "flow");
    expect(progress.completeLesson).toHaveBeenCalledWith(
      learner,
      "salsa-rhythm",
      "2026-11-07",
    );
    expect(progress.addSource).toHaveBeenCalledWith(learner, source);
    expect(progress.removeSource).toHaveBeenCalledWith(learner, sourceId);
  });

  it("rejects an invalid learner id", async () => {
    for (const result of [
      await getProgress(request({ learner: "nope" })),
      await style(request({}, { style: "salsa" })),
    ]) {
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body ?? "")).toEqual({
        error: "Invalid learner id",
      });
    }
  });

  it("rejects invalid changes without storing them", async () => {
    const results = [
      await style(request({ learner }, { style: "tango" })),
      await style({ pathParameters: { learner }, body: "{" } as never),
      await stage(request({ learner, style: "salsa" }, { stage: "expert" })),
      await completions(
        request({ learner }, { lessonId: "unknown", day: "2026-11-07" }),
      ),
      await completions(
        request({ learner }, { lessonId: "salsa-rhythm", day: "today" }),
      ),
      await addSource(request({ learner }, { ...source, url: "ftp://x" })),
      await addSource(request({ learner }, { ...source, title: " " })),
      await removeSource(request({ learner, source: "nope" })),
    ];
    for (const result of results) expect(result.statusCode).toBe(400);
    expect(
      (await stage(request({ learner, style: "tango" }, { stage: "flow" })))
        .statusCode,
    ).toBe(404);
    for (const write of [
      progress.setStyle,
      progress.setStage,
      progress.completeLesson,
      progress.addSource,
      progress.removeSource,
    ])
      expect(write).not.toHaveBeenCalled();
  });
});
