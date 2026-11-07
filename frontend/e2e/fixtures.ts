import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

type Counted = Window & { pendingSaves: number };

// Counts unfinished progress writes so a test can reload only once the API
// has stored them, as it would after a learner's pause.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      const counted = window as unknown as Counted;
      counted.pendingSaves = 0;
      const fetch = window.fetch;
      window.fetch = (input, init) => {
        if (!init?.method || init.method === "GET") return fetch(input, init);
        counted.pendingSaves++;
        return fetch(input, init).finally(() => counted.pendingSaves--);
      };
    });
    await use(page);
  },
});

export { expect };

export async function waitForSaves(page: Page) {
  await page.waitForFunction(
    () => (window as unknown as Counted).pendingSaves === 0,
  );
}

export async function reloadWhenSaved(page: Page) {
  await waitForSaves(page);
  await page.reload();
}
