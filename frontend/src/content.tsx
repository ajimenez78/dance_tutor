import { createContext, useContext, useEffect, useState } from "react";
import { useLanguage } from "./i18n";
import type { Language } from "./i18n";
import type { Lesson, Playlist, Style, StyleInfo } from "./types";

export type Styles = Record<Style, StyleInfo>;
export type Content = { styles: Styles; lessons: Lesson[]; playlist: Playlist };
type Loaded = { styles: Styles; course: Omit<Content, "styles"> | null };

const requests = new Map<string, Promise<unknown>>();

export function clearContentCache() {
  requests.clear();
}

function get<T>(path: string): Promise<T> {
  if (!requests.has(path)) {
    const request = fetch(path).then((response) => {
      if (!response.ok) throw new Error(`${path}: ${response.status}`);
      return response.json();
    });
    request.catch(() => requests.delete(path));
    requests.set(path, request);
  }
  return requests.get(path) as Promise<T>;
}

async function loadContent(
  style: Style | null,
  language: Language,
): Promise<Loaded> {
  const query = `?lang=${language}`;
  const [styles, course] = await Promise.all([
    get<Styles>(`/api/styles${query}`),
    style &&
      Promise.all([
        get<Lesson[]>(`/api/styles/${style}/lessons${query}`),
        get<Playlist>(`/api/styles/${style}/playlist${query}`),
      ]).then(([lessons, playlist]) => ({ lessons, playlist })),
  ]);
  return { styles, course };
}

// Keeps showing the previous language's content while the new one loads, so
// an open lesson or form is not reset by a language change.
export function useContentLoader(style: Style | null) {
  const { language } = useLanguage();
  const [loaded, setLoaded] = useState<
    (Loaded & { style: Style | null }) | null
  >(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    setFailed(false);
    loadContent(style, language).then(
      (content) => current && setLoaded({ ...content, style }),
      () => current && setFailed(true),
    );
    return () => {
      current = false;
    };
  }, [style, language, attempt]);
  const ready = loaded?.style === style ? loaded : null;
  return {
    styles: ready?.styles ?? null,
    content: ready?.course ? { styles: ready.styles, ...ready.course } : null,
    failed,
    retry: () => setAttempt((value) => value + 1),
  };
}

const ContentContext = createContext<Content | null>(null);
export const ContentProvider = ContentContext.Provider;

export function useContent(): Content {
  return useContext(ContentContext)!;
}
