import { randomUUID } from "node:crypto";
import { pool } from "./db";

export async function accountLearner(sub: string): Promise<string | null> {
  const { rows } = await pool.query(
    "SELECT learner_id FROM accounts WHERE sub = $1",
    [sub],
  );
  return rows[0]?.learner_id ?? null;
}

export async function isLinked(learnerId: string) {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM accounts WHERE learner_id = $1",
    [learnerId],
  );
  return rowCount === 1;
}

// The first sign-in links the guest learner. If that learner already belongs
// to another account, the new account starts with a fresh learner instead.
export async function linkAccount(sub: string, guestId: string) {
  for (const learnerId of [guestId, randomUUID()]) {
    await pool.query(
      `INSERT INTO accounts (sub, learner_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [sub, learnerId],
    );
    const linked = await accountLearner(sub);
    if (linked) return linked;
  }
  throw new Error(`Could not link account ${sub}`);
}
