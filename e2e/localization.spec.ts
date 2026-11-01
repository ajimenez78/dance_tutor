import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { lessons } from "../src/lessons";
import type { Style } from "../src/lessons";
import { spanishLessons } from "../src/lessons.es";
import { tutorials } from "../src/videos";
import { translate } from "../src/i18n";
import type { Language } from "../src/i18n";
import {
  bachataPlaylist,
  playlistVideoUrl,
} from "../src/bachataPlaylist";
import { playlistLevels, playlists } from "../src/playlists";

const playlistCombinations = [
  { style: "bachata", language: "es" },
  { style: "bachata", language: "en" },
  { style: "salsa", language: "es" },
  { style: "salsa", language: "en" },
] as const;

const playlistLevelLabels = {
  initial: "Initial level",
  foundations: "Foundations and figures",
  intermediate: "Intermediate level and style",
} as const;

async function expectPlaylist(
  page: Page,
  style: Style,
  language: Language,
) {
  const playlist = playlists[style][language];
  const section = page.getByRole("region", { name: playlist.title, exact: true });

  await expect(section).toBeVisible();
  await expect(
    section.getByText(playlist.attribution, { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByRole("link", {
      name: translate(language, "View full playlist"),
    }),
  ).toHaveAttribute("href", playlist.url);

  const videoLinks = section
    .getByRole("link")
    .filter({ hasText: translate(language, "Watch video") });
  await expect(videoLinks).toHaveCount(playlist.videos.length);
  const actualUrls = await videoLinks.evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).href),
  );
  expect(actualUrls.sort()).toEqual(
    playlist.videos.map(([id]) => playlistVideoUrl(id)).sort(),
  );

  for (const level of playlistLevels) {
    const levelCount = playlist.videos.filter(
      (video) => video[2] === level,
    ).length;
    const levelSection = section
      .locator(".playlist-level")
      .nth(playlistLevels.indexOf(level));
    await expect(
      levelSection.getByRole("heading", {
        name: translate(language, playlistLevelLabels[level]),
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      levelSection.getByText(
        `${levelCount} ${translate(language, "videos")}`,
        { exact: true },
      ),
    ).toBeVisible();
  }

  for (const combination of playlistCombinations) {
    if (
      combination.style !== style ||
      combination.language !== language
    ) {
      await expect(
        page.getByRole("heading", {
          name: playlists[combination.style][combination.language].title,
          exact: true,
        }),
      ).toHaveCount(0);
    }
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test("starts in Spanish regardless of browser locale and remembers an English preference", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator(".intro")).toContainText("perfecto. Solo");
  await expect(
    page.getByRole("heading", { name: /Encuentra tu ritmo/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("spanish-onboarding.png"),
    fullPage: true,
  });
  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
  await expect(
    page.getByRole("heading", { name: /Find your rhythm/ }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("combobox", { name: "Language" })).toHaveValue(
    "en",
  );
});

test("Spanish Bachata path shows the complete Alfonso y Mónica playlist by level", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Empezar con Bachata" }).click();
  await page.getByRole("button", { name: "Mi recorrido", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Bachata paso a paso" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nivel inicial" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Fundamentos y figuras" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Nivel intermedio y estilo" }),
  ).toBeVisible();
  await expect(page.locator(".playlist-video")).toHaveCount(
    bachataPlaylist.length,
  );
  await expect(page.getByRole("link", { name: /Ver playlist completa/ })).toHaveAttribute(
    "href",
    expect.stringContaining("PL2hC4eLPfJuMsjVBE8qFywgchnsRKB2vB"),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

for (const { style, language } of playlistCombinations) {
  test(`${language} ${style} path shows only its complete playlist`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: "Idioma" }).selectOption(language);
    const styleName = style === "salsa" ? "Salsa" : "Bachata";
    await page
      .getByRole("button", {
        name: translate(language, "Start with {style}", {
          style: styleName,
        }),
      })
      .click();
    await page
      .getByRole("button", {
        name: translate(language, "Learning path"),
        exact: true,
      })
      .click();

    await expectPlaylist(page, style, language);
  });
}

test("switching language and dance style switches to the matching playlist", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Empezar con Bachata" }).click();
  await page.getByRole("button", { name: "Mi recorrido", exact: true }).click();
  await expectPlaylist(page, "bachata", "es");

  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
  await expectPlaylist(page, "bachata", "en");

  await page
    .getByRole("combobox", { name: translate("en", "YOUR DANCE FLOOR") })
    .selectOption("salsa");
  await page
    .getByRole("button", { name: "Learning path", exact: true })
    .click();
  await expectPlaylist(page, "salsa", "en");

  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expectPlaylist(page, "salsa", "es");

  await page
    .getByRole("combobox", { name: translate("es", "YOUR DANCE FLOOR") })
    .selectOption("bachata");
  await page
    .getByRole("button", { name: "Mi recorrido", exact: true })
    .click();
  await expectPlaylist(page, "bachata", "es");
});

for (const language of ["es", "en"] as Language[]) {
  const t = (message: string, values?: Record<string, string | number>) =>
    translate(language, message, values);
  const content = language === "es" ? spanishLessons : lessons;

  test(`${language}: every lesson has an attributed tutorial, embedded player and direct source`, async ({
    page,
  }) => {
    await page.route("https://www.youtube-nocookie.com/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: '<html lang="en"><title>Video host test fixture</title><body>External video frame</body></html>',
      }),
    );
    await page.goto("/");
    await page.getByRole("combobox", { name: "Idioma" }).selectOption(language);
    await page
      .getByRole("button", {
        name: t("Start with {style}", { style: "Salsa" }),
      })
      .click();
    for (const style of ["salsa", "bachata"] as const) {
      await page
        .getByRole("combobox", { name: t("YOUR DANCE FLOOR") })
        .selectOption(style);
      await page
        .getByRole("button", { name: t("Learning path"), exact: true })
        .click();
      for (const lesson of content[style]) {
        await page
          .getByRole("button", { name: new RegExp(lesson.title) })
          .click();
        await expect(
          page.getByRole("heading", { name: lesson.title, exact: true }),
        ).toBeVisible();
        await expect(
          page.getByRole("link", {
            name: new RegExp(t("Watch on the original site")),
          }),
        ).toHaveAttribute("href", tutorials[lesson.id][language].source);
        await expect(
          page.getByText(tutorials[lesson.id][language].author, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText(
            t(language === "es" ? "Spanish audio" : "English audio"),
          ),
        ).toBeVisible();
        await page
          .getByRole("button", { name: new RegExp(t("Watch the tutorial")) })
          .click();
        const frame = page.getByTitle(
          t("Video tutorial: {title}", { title: lesson.title }),
        );
        await expect(frame).toHaveAttribute(
          "src",
          `https://www.youtube-nocookie.com/embed/${tutorials[lesson.id][language].youtubeId}?autoplay=1&hl=${language}`,
        );
        await expect(frame).toHaveAttribute("allowfullscreen", "");
        await page
          .getByRole("button", { name: t("Back to your practice") })
          .click();
      }
    }
  });

  for (const style of ["salsa", "bachata"] as const) {
    test(`${language} ${style}: starts at combinations without completing skipped lessons`, async ({
      page,
    }, testInfo) => {
      await page.goto("/");
      await page
        .getByRole("combobox", { name: "Idioma" })
        .selectOption(language);
      await page
        .getByRole("combobox", { name: t("Starting point") })
        .selectOption("flow");
      await page
        .getByRole("button", {
          name: t("Start with {style}", {
            style: style === "salsa" ? "Salsa" : "Bachata",
          }),
        })
        .click();
      const lesson = content[style][3];
      await expect(
        page.getByRole("heading", { name: lesson.title + "." }),
      ).toBeVisible();
      await expect(
        page.getByText(t("{count} / 4 lessons", { count: 0 })),
      ).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole("heading", { name: lesson.title + "." }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath(`today-${language}-${style}.png`),
        fullPage: true,
      });
      await page.getByRole("button", { name: t("Let’s practice") }).click();
      await page.screenshot({
        path: testInfo.outputPath(`tutorial-${language}-${style}.png`),
        fullPage: true,
      });
      await page.getByRole("button", { name: t("Try it out") }).click();
      await page.getByRole("button", { name: t("Ready to reflect") }).click();
      await page
        .getByRole("button", {
          name: lesson.answers[lesson.correct],
          exact: false,
        })
        .click();
      await page.getByRole("button", { name: t("Finish lesson") }).click();
      await page.getByRole("button", { name: t("Back to my day") }).click();
      await expect(
        page.getByText(t("{count} / 4 lessons", { count: 1 })),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: t("Practice again"), exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: t("View path") }).click();
      await expect(
        page.getByText(t("Optional review"), { exact: true }),
      ).toHaveCount(3);
      await page
        .getByRole("combobox", { name: t("Starting point") })
        .selectOption("rhythm");
      await page.getByRole("button", { name: t("Today"), exact: true }).click();
      await expect(
        page.getByRole("heading", { name: content[style][0].title + "." }),
      ).toBeVisible();
      await expect(
        page.getByText(t("{count} / 4 lessons", { count: 1 })),
      ).toBeVisible();
    });
  }
}

for (const style of ["salsa", "bachata"] as const) {
  test(`${style}: switching language selects the matching tutor and stops playback`, async ({
    page,
  }) => {
    await page.route("https://www.youtube-nocookie.com/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: '<html lang="en"><body>External video frame</body></html>',
      }),
    );
    await page.goto("/");
    await page
      .getByRole("button", {
        name: `Empezar con ${style === "salsa" ? "Salsa" : "Bachata"}`,
      })
      .click();
    await page.getByRole("button", { name: "Vamos a practicar" }).click();
    const video = tutorials[`${style}-rhythm`];
    await expect(page.locator(".video-language")).toHaveText(
      "Audio en español",
    );
    await expect(
      page.getByText("Alfonso y Mónica", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: /Ver el tutorial/ }).click();
    await expect(page.locator("iframe")).toHaveAttribute(
      "src",
      expect.stringContaining(video.es.youtubeId),
    );
    await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.locator(".video-language")).toHaveText("English audio");
    await expect(
      page.getByText(video.en.author, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Watch on the original site/ }),
    ).toHaveAttribute("href", video.en.source);
    await page.getByRole("button", { name: /Watch the tutorial/ }).click();
    await expect(page.locator("iframe")).toHaveAttribute(
      "src",
      expect.stringContaining(video.en.youtubeId),
    );
    await page.getByRole("combobox", { name: "Language" }).selectOption("es");
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Ver el tutorial/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ver en la página original/ }),
    ).toHaveAttribute("href", video.es.source);
  });
}

test("keeps stage preferences independent per style", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Punto de partida" })
    .selectOption("basics");
  await page.getByRole("button", { name: "Empezar con Salsa" }).click();
  await expect(
    page.getByRole("heading", { name: "Tu primer paso básico." }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "TU PISTA DE BAILE" })
    .selectOption("bachata");
  await expect(
    page.getByRole("heading", { name: "Encuentra tu ritmo." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mi recorrido", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Punto de partida" })
    .selectOption("flow");
  await page
    .getByRole("combobox", { name: "TU PISTA DE BAILE" })
    .selectOption("salsa");
  await expect(
    page.getByRole("heading", { name: "Tu primer paso básico." }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "TU PISTA DE BAILE" })
    .selectOption("bachata");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Encuentra tu fluidez." }),
  ).toBeVisible();
});

test("changing language during a lesson preserves its stage and quiz answer", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Empezar con Salsa" }).click();
  await page.getByRole("button", { name: "Vamos a practicar" }).click();
  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
  await expect(
    page.getByRole("heading", { name: "Find your rhythm", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(lessons.salsa[0].learn, { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try it out" }).click();
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .click();
  await expect(page.getByRole("timer")).not.toHaveText("1:00");
  await page.getByRole("button", { name: "Pause practice" }).click();
  const remaining = await page.getByRole("timer").textContent();
  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expect(
    page.getByRole("button", { name: "Reanudar práctica" }),
  ).toBeVisible();
  await expect(page.getByRole("timer")).toHaveText(remaining!);
  await page.getByRole("button", { name: "Vamos a repasar" }).click();
  await page.getByRole("button", { name: "4 y 8" }).click();
  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
  await expect(
    page.getByRole("heading", { name: lessons.salsa[0].question }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "4 and 8" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "Finish lesson" }),
  ).toBeEnabled();
});

test("Spanish validation translates in place without clearing user input", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Empezar con Salsa" }).click();
  await page
    .getByRole("button", { name: "Mi biblioteca", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Añadir recurso", exact: true })
    .click();
  await page.getByRole("button", { name: "Guardar recurso" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Dale un nombre al recurso.",
  );
  await page.getByLabel("Nombre", { exact: true }).fill("Mi vídeo de salsa");
  await page.getByLabel("Enlace", { exact: true }).fill("invalid");
  await page.getByRole("button", { name: "Guardar recurso" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Introduce una dirección completa",
  );
  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue(
    "Mi vídeo de salsa",
  );
  await expect(page.getByRole("alert")).toContainText(
    "Enter a complete web address",
  );
  await page
    .getByLabel("Link", { exact: true })
    .fill("https://youtube.com/watch?v=example");
  await page.getByRole("button", { name: "Save source", exact: true }).click();
  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expect(
    page.getByRole("heading", { name: "Mi vídeo de salsa" }),
  ).toBeVisible();
  await expect(page.getByText("Vídeo", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Recurso guardado.");
});

test("migrates earlier browser data without losing completed lessons or sources", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "ritmo-v1",
      JSON.stringify({
        style: "salsa",
        completed: ["salsa-rhythm"],
        activity: ["2026-10-29"],
        sources: [
          {
            id: "old-source",
            title: "My original notes",
            url: "https://example.com/notes",
            style: "salsa",
            kind: "Article",
          },
        ],
      }),
    ),
  );
  await page.reload();
  await expect(page.getByText("1 / 4 lecciones")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tu primer paso básico." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mi biblioteca", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "My original notes" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Abrir recurso/ }),
  ).toHaveAttribute("href", "https://example.com/notes");
});
