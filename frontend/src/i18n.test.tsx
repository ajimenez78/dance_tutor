import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  LANGUAGE_KEY,
  LanguagePicker,
  LanguageProvider,
  loadLanguage,
  translate,
  useLanguage,
} from "./i18n";
import { spanish } from "./translations";
import type { Lesson } from "./types";
import VideoTutorial from "./VideoTutorial";

const lesson = {
  id: "salsa-rhythm",
  subtitle: "",
  tag: "",
  learn: "",
  steps: [],
  tip: "",
  question: "",
  answers: [],
  correct: 0,
};
const localizedLessons: Record<"es" | "en", Lesson> = {
  es: {
    ...lesson,
    title: "Encuentra tu ritmo",
    tutorial: {
      youtubeId: "IbBBYxbtz-w",
      author: "Alfonso y Mónica",
      source: "https://www.youtube.com/watch?v=IbBBYxbtz-w",
      audioLanguage: "es",
    },
  },
  en: {
    ...lesson,
    title: "Find your rhythm",
    tutorial: {
      youtubeId: "dYgGFqTsD9I",
      author: "Dance Dojo",
      source:
        "https://thedancedojo.com/blog/how-to-find-the-beat-in-salsa-music/",
      audioLanguage: "en",
    },
  },
};

function LocalizedTutorial() {
  const { language } = useLanguage();
  return <VideoTutorial lesson={localizedLessons[language]} />;
}

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

describe("video tutorials", () => {
  it("loads the embedded tutorial only on request and always offers a direct source", () => {
    render(
      <LanguageProvider>
        <LocalizedTutorial />
        <LanguagePicker />
      </LanguageProvider>,
    );
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText("Audio en español")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Ver en la página original/ }),
    ).toHaveAttribute("href", localizedLessons.es.tutorial.source);
    fireEvent.click(screen.getByRole("button", { name: /Ver el tutorial/ }));
    const iframe = screen.getByTitle("Videotutorial: Encuentra tu ritmo");
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining(localizedLessons.es.tutorial.youtubeId),
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
    ).toHaveAttribute("href", localizedLessons.en.tutorial.source);
    fireEvent.click(screen.getByRole("button", { name: /Watch the tutorial/ }));
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${localizedLessons.en.tutorial.youtubeId}?autoplay=1&hl=en`,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "es" } });
    expect(document.querySelector("iframe")).toBeNull();
    expect(
      screen.getByRole("button", { name: /Ver el tutorial/ }),
    ).toBeVisible();
  });
});
