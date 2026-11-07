import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { dateKey, emptyProgress } from "./model";
import { LEARNER_KEY, useProgress } from "./progress";

const source = {
  id: "0b9d8c7e-6f5a-4b3c-9d2e-1f0a9b8c7d6e",
  title: "Basic step",
  url: "https://www.youtube.com/watch?v=abc",
  style: "salsa" as const,
  kind: "Video" as const,
};

function mockApi(failing?: string) {
  const fetch = vi.fn(async (path: string, init?: RequestInit) => {
    if (failing && init?.method === failing)
      return new Response(null, { status: 500 });
    if (path.endsWith("/progress")) return Response.json(emptyProgress);
    return new Response(null, { status: 204 });
  });
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

function calls(fetch: ReturnType<typeof mockApi>) {
  return fetch.mock.calls.map(([path, init]) => [
    init?.method,
    path.replace(/learners\/[^/]+/, "learners/me"),
    init?.body && JSON.parse(String(init.body)),
  ]);
}

async function render() {
  const view = renderHook(() => useProgress());
  await waitFor(() => expect(view.result.current.progress).not.toBeNull());
  return view;
}

afterEach(() => vi.unstubAllGlobals());

describe("learner progress", () => {
  it("creates one learner ID per browser and loads its progress", async () => {
    const fetch = mockApi();
    await render();
    const id = localStorage.getItem(LEARNER_KEY);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    await render();
    expect(fetch.mock.calls.map(([path]) => path)).toEqual([
      `/api/learners/${id}/progress`,
      `/api/learners/${id}/progress`,
    ]);
  });

  it("updates progress at once and saves each change in order", async () => {
    const fetch = mockApi();
    const { result } = await render();
    act(() => result.current.selectStyle("salsa", "basics"));
    act(() => result.current.setStage("salsa", "flow"));
    act(() => result.current.complete("salsa-basic"));
    act(() => result.current.addSource(source));
    expect(result.current.progress).toEqual({
      style: "salsa",
      stages: { salsa: "flow", bachata: "rhythm" },
      completed: ["salsa-basic"],
      activity: [dateKey()],
      sources: [source],
    });
    act(() => result.current.removeSource(source.id));
    expect(result.current.progress?.sources).toEqual([]);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(7));
    expect(calls(fetch)).toEqual([
      ["GET", "/api/learners/me/progress", undefined],
      ["PUT", "/api/learners/me/style", { style: "salsa" }],
      ["PUT", "/api/learners/me/stages/salsa", { stage: "basics" }],
      ["PUT", "/api/learners/me/stages/salsa", { stage: "flow" }],
      [
        "POST",
        "/api/learners/me/completions",
        { lessonId: "salsa-basic", day: dateKey() },
      ],
      ["POST", "/api/learners/me/sources", source],
      ["DELETE", `/api/learners/me/sources/${source.id}`, undefined],
    ]);
  });

  it("reports a failed save and reloads progress on retry", async () => {
    const fetch = mockApi("POST");
    const { result } = await render();
    act(() => result.current.complete("salsa-basic"));
    await waitFor(() => expect(result.current.failed).toBe(true));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.failed).toBe(false));
    await waitFor(() =>
      expect(result.current.progress).toEqual(emptyProgress),
    );
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("keeps working for the visit when browser storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    mockApi();
    const { result } = await render();
    expect(result.current.remembered).toBe(false);
    expect(result.current.progress).toEqual(emptyProgress);
    vi.restoreAllMocks();
  });
});
