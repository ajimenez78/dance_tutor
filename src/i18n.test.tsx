import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  LANGUAGE_KEY,
  LanguagePicker,
  LanguageProvider,
  loadLanguage,
  translate,
} from "./i18n";
import { lessons } from "./lessons";
import { spanishLessons } from "./lessons.es";
import { spanish } from "./translations";
import { tutorials } from "./videos";
import VideoTutorial from "./VideoTutorial";
import {
  bachataPlaylist,
  bachataPlaylistUrl,
  playlistVideoUrl,
} from "./bachataPlaylist";

describe("languages", () => {
  it("has a Spanish translation for every literal interface message", () => {
    for (const file of [
      "App.tsx",
      "Practice.tsx",
      "VideoTutorial.tsx",
      "i18n.tsx",
    ]) {
      const source = readFileSync(`src/${file}`, "utf8");
      for (const match of source.matchAll(/\bt\(\s*"([^"]+)"/g)) {
        expect(spanish[match[1]], `${file}: ${match[1]}`).toBeTruthy();
      }
    }
  });
  it("defaults to Spanish and accepts only supported stored languages", () => {
    expect(loadLanguage()).toBe("es");
    localStorage.setItem(LANGUAGE_KEY, "en");
    expect(loadLanguage()).toBe("en");
    localStorage.setItem(LANGUAGE_KEY, "fr");
    expect(loadLanguage()).toBe("es");
  });
  it("defaults to Spanish if storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(loadLanguage()).toBe("es");
  });
  it("translates interpolated sentences and uses English messages directly", () => {
    expect(translate("es", "Your {style} journey", { style: "salsa" })).toBe(
      "Tu recorrido de salsa",
    );
    expect(translate("en", "{count} / 4 lessons", { count: 2 })).toBe(
      "2 / 4 lessons",
    );
    expect(translate("es", "Name")).toBe("Nombre");
    expect(translate("en", "Name")).toBe("Name");
  });
  it("preserves placeholders and unknown external content", () => {
    expect(translate("es", "{title} removed.")).toContain("{title}");
    expect(translate("es", "My personal video title")).toBe(
      "My personal video title",
    );
  });
  it("switches and persists the language and document metadata", () => {
    render(
      <LanguageProvider>
        <LanguagePicker />
      </LanguageProvider>,
    );
    expect(document.documentElement.lang).toBe("es");
    expect(document.title).toContain("Tu práctica");
    fireEvent.change(screen.getByRole("combobox", { name: "Idioma" }), {
      target: { value: "en" },
    });
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveValue(
      "en",
    );
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe("en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toContain("Your daily");
  });
  it("continues switching when preference storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(
      <LanguageProvider>
        <LanguagePicker />
      </LanguageProvider>,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "en" } });
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveValue(
      "en",
    );
  });
  it("keeps interpolation parameters identical in both languages", () => {
    for (const [english, translated] of Object.entries(spanish)) {
      expect(translated.trim()).not.toBe("");
      expect(translated.match(/\{\w+\}/g)?.sort() ?? []).toEqual(
        english.match(/\{\w+\}/g)?.sort() ?? [],
      );
    }
  });
});

describe("bilingual lessons and tutorials", () => {
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

  it("provides full Spanish content with the same stable lesson IDs and quiz structure", () => {
    for (const style of ["salsa", "bachata"] as const) {
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
      for (const language of ["es", "en"] as const) {
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
  it("loads the embedded tutorial only on request and always offers a direct source", () => {
    render(
      <LanguageProvider>
        <VideoTutorial lesson={spanishLessons.salsa[0]} />
        <LanguagePicker />
      </LanguageProvider>,
    );
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText("Audio en español")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Ver en la página original/ }),
    ).toHaveAttribute("href", tutorials["salsa-rhythm"].es.source);
    fireEvent.click(screen.getByRole("button", { name: /Ver el tutorial/ }));
    const iframe = screen.getByTitle("Videotutorial: Encuentra tu ritmo");
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining(tutorials["salsa-rhythm"].es.youtubeId),
    );
    expect(iframe).toHaveAttribute("src", expect.stringContaining("hl=es"));
    expect(
      screen.getByText(/Si el reproductor no está disponible/),
    ).toBeVisible();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "en" } });
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText("English audio")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Watch on the original site/ }),
    ).toHaveAttribute("href", tutorials["salsa-rhythm"].en.source);
    fireEvent.click(screen.getByRole("button", { name: /Watch the tutorial/ }));
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${tutorials["salsa-rhythm"].en.youtubeId}?autoplay=1&hl=en`,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "es" } });
    expect(document.querySelector("iframe")).toBeNull();
    expect(
      screen.getByRole("button", { name: /Ver el tutorial/ }),
    ).toBeVisible();
  });
});
