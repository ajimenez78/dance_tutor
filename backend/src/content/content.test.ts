import { describe, expect, it } from "vitest";
import {
  bachataPlaylist,
  bachataPlaylistUrl,
  playlistVideoUrl,
} from "./bachataPlaylist";
import { getLessons, getPlaylist, getStyles } from "./index";
import { lessons } from "./lessons";
import { spanishLessons } from "./lessons.es";
import { tutorials } from "./videos";

const styles = ["salsa", "bachata"] as const;
const languages = ["es", "en"] as const;

describe("core lessons", () => {
  it("provides complete instruction and valid quizzes for all eight lessons", () => {
    const all = [...lessons.salsa, ...lessons.bachata];
    expect(new Set(all.map((lesson) => lesson.id)).size).toBe(8);
    all.forEach((lesson) => {
      expect(lesson.steps).toHaveLength(4);
      expect(lesson.learn.length).toBeGreaterThan(80);
      expect(lesson.answers[lesson.correct]).toBeTruthy();
    });
  });

  it("provides full Spanish content with the same stable lesson IDs and quiz structure", () => {
    for (const style of styles) {
      spanishLessons[style].forEach((lesson, index) => {
        const english = lessons[style][index];
        expect(lesson.id).toBe(english.id);
        expect(lesson.title).not.toBe(english.title);
        expect(lesson.learn).not.toBe(english.learn);
        expect(lesson.steps).toHaveLength(4);
        expect(lesson.answers).toHaveLength(english.answers.length);
        expect(lesson.correct).toBe(english.correct);
        expect(lesson.answers[lesson.correct]).toBeTruthy();
      });
    }
  });

  it("assigns an attributed tutorial with matching spoken language to every lesson", () => {
    for (const lesson of [...lessons.salsa, ...lessons.bachata]) {
      for (const language of languages) {
        const video = tutorials[lesson.id][language];
        expect(video.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
        expect(video.author.length).toBeGreaterThan(3);
        expect(new URL(video.source).protocol).toBe("https:");
        expect(video.audioLanguage).toBe(language);
      }
      expect(tutorials[lesson.id].es.author).toBe("Alfonso y Mónica");
      expect(tutorials[lesson.id].es.youtubeId).not.toBe(
        tutorials[lesson.id].en.youtubeId,
      );
    }
  });

  it("keeps the complete Alfonso y Mónica Bachata playlist classified by level", () => {
    expect(bachataPlaylist).toHaveLength(54);
    expect(new Set(bachataPlaylist.map((video) => video[0])).size).toBe(54);
    expect(new URL(bachataPlaylistUrl).searchParams.get("list")).toBe(
      "PL2hC4eLPfJuMsjVBE8qFywgchnsRKB2vB",
    );
    expect(new Set(bachataPlaylist.map((video) => video[2]))).toEqual(
      new Set(["initial", "foundations", "intermediate"]),
    );
    expect(playlistVideoUrl(bachataPlaylist[0][0])).toContain(
      bachataPlaylist[0][0],
    );
  });
});

describe("content API", () => {
  it.each(languages)(
    "returns localized style descriptions in %s",
    (language) => {
      const result = getStyles(language);
      expect(Object.keys(result)).toEqual(["salsa", "bachata"]);
      expect(result.salsa.name).toBe("Salsa");
      expect(result.bachata.timing).toBe(
        language === "es"
          ? "Paso, paso, paso, toque."
          : "Step, step, step, tap.",
      );
    },
  );

  it.each(languages)(
    "resolves the %s tutorial into every core lesson",
    (language) => {
      for (const style of styles) {
        const result = getLessons(style, language);
        const source = language === "es" ? spanishLessons : lessons;
        expect(result.map((lesson) => lesson.title)).toEqual(
          source[style].map((lesson) => lesson.title),
        );
        for (const lesson of result)
          expect(lesson.tutorial).toEqual(tutorials[lesson.id][language]);
      }
    },
  );

  it("returns playlist details with level-ordered lessons", () => {
    const result = getPlaylist("bachata", "es");
    expect(result.title).toBe("Bachata paso a paso");
    expect(result.url).toBe(bachataPlaylistUrl);
    expect(result.lessons).toHaveLength(54);
    expect(result.lessons[0].playlistLevel).toBe("initial");
    expect(result.lessons.at(-1)?.playlistLevel).toBe("intermediate");
    expect(result).not.toHaveProperty("videos");
  });
});
