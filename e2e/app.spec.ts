import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { lessons } from "../src/lessons";
import type { Lesson, Style } from "../src/lessons";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ritmo-language", "en"));
});

async function start(page: Page, style: Style = "salsa") {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: `Start with ${style === "salsa" ? "Salsa" : "Bachata"}`,
    })
    .click();
}

async function finishLesson(page: Page, lesson: Lesson, practice = false) {
  await expect(
    page.getByRole("heading", { name: lesson.title, exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try it out" }).click();
  if (practice) {
    await page
      .getByRole("button", { name: "Start practice", exact: true })
      .click();
    await expect(page.getByRole("timer")).not.toHaveText("1:00");
    await page.getByRole("button", { name: "Pause practice" }).click();
    const remaining = await page.getByRole("timer").textContent();
    await page.waitForTimeout(1100);
    await expect(page.getByRole("timer")).toHaveText(remaining!);
    await page.getByRole("button", { name: "Resume practice" }).click();
    await page.getByRole("button", { name: "Reset practice" }).click();
    await expect(page.getByRole("timer")).toHaveText("1:00");
  }
  await page.getByRole("button", { name: "Ready to reflect" }).click();
  await expect(
    page.getByRole("button", { name: "Finish lesson" }),
  ).toBeDisabled();
  const wrong = (lesson.correct + 1) % lesson.answers.length;
  await page
    .getByRole("button", { name: lesson.answers[wrong], exact: false })
    .click();
  await expect(page.getByRole("status")).toContainText("Not quite");
  await expect(
    page.getByRole("button", { name: "Finish lesson" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: lesson.answers[lesson.correct], exact: false })
    .click();
  await page.getByRole("button", { name: "Finish lesson" }).click();
  await expect(
    page.getByRole("heading", { name: "Look at you go." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to my day" }).click();
}

test("first visit offers both styles and has no horizontal overflow", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Find your rhythm/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start with Salsa" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start with Bachata" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("01-style-selection.png"),
    fullPage: true,
  });
});

for (const style of ["salsa", "bachata"] as const) {
  test(`${style}: complete all four lessons, persist progress, and repeat`, async ({
    page,
  }, testInfo) => {
    await start(page, style);
    await page.screenshot({
      path: testInfo.outputPath(`02-${style}-today.png`),
      fullPage: true,
    });
    await expect(page.getByText("0 / 4 lessons")).toBeVisible();
    for (const [index, lesson] of lessons[style].entries()) {
      await page.getByRole("button", { name: "Let’s practice" }).click();
      await finishLesson(page, lesson, index === 0);
      await expect(page.getByText(`${index + 1} / 4 lessons`)).toBeVisible();
    }
    await expect(page.getByText("Today’s practice, done.")).toBeVisible();
    await expect(
      page.getByText("day in a row", { exact: true }).locator(".."),
    ).toHaveText("1day in a row");
    await page.reload();
    await expect(page.getByText("4 / 4 lessons")).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "YOUR DANCE FLOOR" }),
    ).toHaveValue(style);
    await page
      .getByRole("button", { name: "Practice again", exact: true })
      .click();
    await finishLesson(page, lessons[style][0]);
    await expect(page.getByText("4 / 4 lessons")).toBeVisible();
    await page.getByRole("button", { name: "View path" }).click();
    await expect(page.getByText("Foundations complete.")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`03-${style}-completed-path.png`),
      fullPage: true,
    });
  });
}

test("switching styles retains independent progress", async ({ page }) => {
  await start(page);
  await page.getByRole("button", { name: "Let’s practice" }).click();
  await finishLesson(page, lessons.salsa[0]);
  await page
    .getByRole("combobox", { name: "YOUR DANCE FLOOR" })
    .selectOption("bachata");
  await expect(page.getByText("0 / 4 lessons")).toBeVisible();
  await page
    .getByRole("combobox", { name: "YOUR DANCE FLOOR" })
    .selectOption("salsa");
  await expect(page.getByText("1 / 4 lessons")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your first basic step." }),
  ).toBeVisible();
});

test("leaving an unfinished lesson does not complete it", async ({ page }) => {
  await start(page);
  await page.getByRole("button", { name: "Let’s practice" }).click();
  await page.getByRole("button", { name: "Try it out" }).click();
  await page.getByRole("button", { name: "Back to your practice" }).click();
  await expect(page.getByText("0 / 4 lessons")).toBeVisible();
  await page.reload();
  await expect(page.getByText("0 / 4 lessons")).toBeVisible();
});

test("lesson review returns to instructions and preserves quiz selection", async ({
  page,
}) => {
  await start(page);
  await page.getByRole("button", { name: "Let’s practice" }).click();
  await page.getByRole("button", { name: "Try it out" }).click();
  await page.getByRole("button", { name: "Revisit the steps" }).click();
  await expect(
    page.getByRole("heading", { name: "Find your rhythm", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Try it out" }).click();
  await page.getByRole("button", { name: "Ready to reflect" }).click();
  await page.getByRole("button", { name: "4 and 8" }).click();
  await page.getByRole("button", { name: "Review the steps" }).click();
  await page.getByRole("button", { name: "Try it out" }).click();
  await page.getByRole("button", { name: "Ready to reflect" }).click();
  await expect(
    page.getByRole("button", { name: "Finish lesson" }),
  ).toBeEnabled();
});

test("library supports safe links, persistence, style separation and removal", async ({
  page,
}, testInfo) => {
  await start(page);
  await page.getByRole("button", { name: "My library", exact: true }).click();
  await expect(
    page.getByText("Your library starts with a spark."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save your first source" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await page.getByLabel("Name", { exact: true }).fill("Salsa basics video");
  await page
    .getByLabel("Link", { exact: true })
    .fill("https://www.youtube.com/watch?v=example");
  await page.getByRole("button", { name: "Save source", exact: true }).click();
  await expect(page.getByText("Video", { exact: true })).toBeVisible();
  const link = page.getByRole("link", { name: "Open source" });
  await expect(link).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=example",
  );
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noreferrer");
  await page.reload();
  await page.getByRole("button", { name: "My library", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Salsa basics video" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "YOUR DANCE FLOOR" })
    .selectOption("bachata");
  await page.getByRole("button", { name: "My library", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Salsa basics video" }),
  ).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "YOUR DANCE FLOOR" })
    .selectOption("salsa");
  await page.getByRole("button", { name: "My library", exact: true }).click();
  await page.screenshot({
    path: testInfo.outputPath("04-library.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Remove Salsa basics video" }).click();
  await expect(
    page.getByText("Your library starts with a spark."),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "My library", exact: true }).click();
  await expect(
    page.getByText("Your library starts with a spark."),
  ).toBeVisible();
});

test("library validates names and web addresses and allows cancel", async ({
  page,
}) => {
  await start(page);
  await page.getByRole("button", { name: "My library", exact: true }).click();
  await page.getByRole("button", { name: "Add source", exact: true }).click();
  await page.getByRole("button", { name: "Save source", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Give your source a name.");
  await page.getByLabel("Name", { exact: true }).fill("Dance notes");
  for (const badUrl of [
    "not-a-link",
    "javascript:alert(1)",
    "data:text/html,hello",
  ]) {
    await page.getByLabel("Link", { exact: true }).fill(badUrl);
    await page
      .getByRole("button", { name: "Save source", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText(
      "Enter a complete web address",
    );
  }
  await page.getByRole("button", { name: "Cancel adding source" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toHaveCount(0);
});

test("social and article sources get the right type", async ({ page }) => {
  await start(page, "bachata");
  await page.getByRole("button", { name: "My library", exact: true }).click();
  for (const [name, url] of [
    ["My favorite teacher", "https://instagram.com/dance"],
    ["Basic steps guide", "https://example.com/bachata"],
  ]) {
    await page.getByRole("button", { name: "Add source", exact: true }).click();
    await page.getByLabel("Name", { exact: true }).fill(name);
    await page.getByLabel("Link", { exact: true }).fill(url);
    await page
      .getByRole("button", { name: "Save source", exact: true })
      .click();
  }
  await expect(page.getByText("Social", { exact: true })).toBeVisible();
  await expect(page.getByText("Article", { exact: true })).toBeVisible();
});

test("recovers from corrupt storage and communicates blocked storage", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("ritmo-v1", "bad json"));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Start with Salsa" }),
  ).toBeVisible();
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Blocked");
    };
  });
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "Browser storage is unavailable",
  );
  await page.getByRole("button", { name: "Start with Salsa" }).click();
  await expect(
    page.getByRole("heading", { name: /A little practice/ }),
  ).toBeVisible();
});

test("all primary screens fit a narrow viewport and have no browser errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await start(page);
  for (const tab of ["Today", "Learning path", "My library"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Today", exact: true }).click();
  await page.getByRole("button", { name: "Let’s practice" }).click();
  await page.getByRole("button", { name: "Try it out" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("05-guided-practice.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("onboarding and navigation support keyboard operation", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Language" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("combobox", { name: "Starting point" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Start with Salsa" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Learning path", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: /Your salsa journey/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Learning path", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});
