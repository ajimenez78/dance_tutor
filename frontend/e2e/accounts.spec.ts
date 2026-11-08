import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { expect, test, waitForSaves } from "./fixtures";

// A confirmed user in the stage's Cognito pool, created with the admin API.
// Needs AWS credentials, as the API itself does.
const email = `e2e-${randomUUID()}@example.com`;
const password = `E2e-${randomUUID()}`;
let userPool = "";

function cognito(...args: string[]) {
  execFileSync("aws", ["cognito-idp", ...args, "--user-pool-id", userPool], {
    env: { ...process.env, AWS_REGION: "eu-south-2" },
  });
}

test.beforeAll(async ({ request }) => {
  const { authority } = await (await request.get("/api/config")).json();
  userPool = authority.split("/").pop();
  cognito(
    "admin-create-user",
    "--username", email,
    "--user-attributes", "Name=email,Value=" + email, "Name=email_verified,Value=true",
    "--message-action", "SUPPRESS",
  );
  cognito(
    "admin-set-user-password",
    "--username", email,
    "--password", password,
    "--permanent",
  );
});

test.afterAll(() => cognito("admin-delete-user", "--username", email));

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ritmo-language", "en"));
});

// The tests share one account, so they run in order.
test.describe.configure({ mode: "serial" });

async function signIn(page: Page) {
  await waitForSaves(page);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
}

const danceFloor = (page: Page) =>
  page.getByRole("combobox", { name: "YOUR DANCE FLOOR" });

test("links guest progress on first sign-in", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start with Bachata" }).click();
  await expect(danceFloor(page)).toHaveValue("bachata");
  await signIn(page);
  await expect(danceFloor(page)).toHaveValue("bachata");
  await expect(page.getByText("Your progress follows your account.")).toBeAttached();
});

test("loads the account's progress in another browser", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Start with Salsa" }),
  ).toBeVisible();
  await signIn(page);
  await expect(danceFloor(page)).toHaveValue("bachata");
});

test("returns to a new guest on sign-out", async ({ page }) => {
  await page.goto("/");
  await signIn(page);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("button", { name: "Start with Salsa" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});
