import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { clearContentCache, useContentLoader } from "./content";
import { LanguageProvider, useLanguage } from "./i18n";
import type { Style } from "./types";

function respond(path: string) {
  const url = new URL(path, "http://test");
  const lang = url.searchParams.get("lang");
  if (url.pathname === "/api/styles") return { salsa: { name: lang } };
  if (url.pathname.endsWith("/lessons")) return [{ id: `${lang}-lesson` }];
  return { title: `${lang} playlist`, lessons: [] };
}

function mockApi(failures = 0) {
  const fetch = vi.fn(async (path: string) => {
    if (failures-- > 0) return new Response(null, { status: 500 });
    return Response.json(respond(path));
  });
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

function render(style: Style | null) {
  return renderHook(
    () => ({ loader: useContentLoader(style), language: useLanguage() }),
    { wrapper },
  );
}

afterEach(() => {
  clearContentCache();
  vi.unstubAllGlobals();
});

describe("content loader", () => {
  it("loads only the styles before a style is chosen", async () => {
    const fetch = mockApi();
    const { result } = render(null);
    expect(result.current.loader.styles).toBeNull();
    await waitFor(() => expect(result.current.loader.styles).not.toBeNull());
    expect(result.current.loader.content).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/styles?lang=es");
  });

  it("loads a style's lessons and playlist in Spanish by default", async () => {
    mockApi();
    const { result } = render("salsa");
    await waitFor(() => expect(result.current.loader.content).not.toBeNull());
    expect(result.current.loader.content).toEqual({
      styles: { salsa: { name: "es" } },
      lessons: [{ id: "es-lesson" }],
      playlist: { title: "es playlist", lessons: [] },
    });
  });

  it("keeps the previous language's content until the new one arrives, then caches it", async () => {
    const fetch = mockApi();
    const { result } = render("salsa");
    await waitFor(() => expect(result.current.loader.content).not.toBeNull());
    act(() => result.current.language.setLanguage("en"));
    expect(result.current.loader.content?.lessons).toEqual([
      { id: "es-lesson" },
    ]);
    await waitFor(() =>
      expect(result.current.loader.content?.lessons).toEqual([
        { id: "en-lesson" },
      ]),
    );
    act(() => result.current.language.setLanguage("es"));
    await waitFor(() =>
      expect(result.current.loader.content?.lessons).toEqual([
        { id: "es-lesson" },
      ]),
    );
    expect(fetch).toHaveBeenCalledTimes(6);
  });

  it("reports a failure and retries the failed request", async () => {
    mockApi(1);
    const { result } = render("salsa");
    await waitFor(() => expect(result.current.loader.failed).toBe(true));
    act(() => result.current.loader.retry());
    expect(result.current.loader.failed).toBe(false);
    await waitFor(() => expect(result.current.loader.content).not.toBeNull());
  });
});
