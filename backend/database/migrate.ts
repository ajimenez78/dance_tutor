import { readFile } from "node:fs/promises";
import { pool } from "../src/db.ts";

const schema = await readFile(new URL("schema.sql", import.meta.url), "utf8");
const statements = schema
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await pool.query(statement);
  console.log(statement.split("\n")[0]);
}
await pool.end();
