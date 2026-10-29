import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { translate } from "../src/i18n";
import type { Language } from "../src/i18n";

for (const language of ["es", "en"] as Language[]) {
  test(`${language}: key screens meet automated WCAG AA checks`, async ({
    page,
  }) => {
    const t = (message: string) => translate(language, message);
    const issues: {
      screen: string;
      id: string;
      nodes: { target: unknown; summary: string | undefined }[];
    }[] = [];
    async function check(screen: string) {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      for (const issue of result.violations)
        issues.push({
          screen,
          id: issue.id,
          nodes: issue.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        });
    }
    await page.goto("/");
    await page.getByRole("combobox", { name: "Idioma" }).selectOption(language);
    await check("Onboarding");
    await page
      .getByRole("button", {
        name: translate(language, "Start with {style}", { style: "Salsa" }),
      })
      .click();
    await check("Today");
    await page
      .getByRole("button", { name: t("Learning path"), exact: true })
      .click();
    await check("Learning path");
    await page
      .getByRole("button", { name: t("My library"), exact: true })
      .click();
    await check("Library");
    await page
      .getByRole("button", { name: t("Add source"), exact: true })
      .click();
    await check("Source form");
    await page.getByRole("button", { name: t("Today"), exact: true }).click();
    await page.getByRole("button", { name: t("Let’s practice") }).click();
    await check("Lesson");
    await page.getByRole("button", { name: t("Try it out") }).click();
    await check("Practice");
    await page.getByRole("button", { name: t("Ready to reflect") }).click();
    await check("Quiz");
    await page
      .getByRole("button", { name: language === "es" ? "4 y 8" : "4 and 8" })
      .click();
    await page.getByRole("button", { name: t("Finish lesson") }).click();
    await check("Completion");
    expect(issues).toEqual([]);
  });
}
