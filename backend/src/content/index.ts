import { lessons } from "./lessons";
import { spanishLessons } from "./lessons.es";
import { playlistLessons, playlists } from "./playlists";
import { styles } from "./styles";
import type { Language, Style } from "./types";
import { tutorials } from "./videos";

export type {
  Language,
  Lesson,
  PlaylistLevel,
  Style,
  StyleInfo,
  Tutorial,
} from "./types";

export function getStyles(language: Language) {
  return styles[language];
}

export function getLessons(style: Style, language: Language) {
  const source = language === "es" ? spanishLessons : lessons;
  return source[style].map((lesson) => ({
    ...lesson,
    tutorial: tutorials[lesson.id][language],
  }));
}

export function getPlaylist(style: Style, language: Language) {
  const { attribution, title, description, url } = playlists[style][language];
  return {
    attribution,
    title,
    description,
    url,
    lessons: playlistLessons(style, language),
  };
}

export const lessonIds = new Set(
  (["salsa", "bachata"] as const).flatMap((style) =>
    (["es", "en"] as const).flatMap((language) =>
      [
        ...getLessons(style, language),
        ...getPlaylist(style, language).lessons,
      ].map((lesson) => lesson.id),
    ),
  ),
);
