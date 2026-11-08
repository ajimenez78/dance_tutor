import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { accountLearner, isLinked, linkAccount } from "./accounts";
import { pool } from "./db";

afterAll(() => pool.end());

describe("accounts repository", () => {
  it("links the first guest learner and keeps it on later sign-ins", async () => {
    const sub = randomUUID();
    const guest = randomUUID();
    expect(await accountLearner(sub)).toBeNull();
    expect(await isLinked(guest)).toBe(false);
    expect(await linkAccount(sub, guest)).toBe(guest);
    expect(await linkAccount(sub, randomUUID())).toBe(guest);
    expect(await accountLearner(sub)).toBe(guest);
    expect(await isLinked(guest)).toBe(true);
  });

  it("gives a new learner when the guest belongs to another account", async () => {
    const guest = randomUUID();
    await linkAccount(randomUUID(), guest);
    const other = await linkAccount(randomUUID(), guest);
    expect(other).not.toBe(guest);
    expect(await isLinked(other)).toBe(true);
  });
});
