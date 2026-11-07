import type { Style } from "./content";
import { pool } from "./db";

export type StartingStage = "rhythm" | "basics" | "flow";
export type Source = {
  id: string;
  title: string;
  url: string;
  style: Style;
  kind: "Video" | "Social" | "Article";
};

async function column<T>(sql: string, learnerId: string) {
  const { rows } = await pool.query(sql, [learnerId]);
  return rows.map((row) => Object.values(row)[0] as T);
}

export async function getProgress(learnerId: string) {
  const style = await column<Style>(
    "SELECT current_style FROM learners WHERE id = $1",
    learnerId,
  );
  const { rows: stageRows } = await pool.query(
    "SELECT style, stage FROM learner_stages WHERE learner_id = $1",
    [learnerId],
  );
  const stages: Record<Style, StartingStage> = {
    salsa: "rhythm",
    bachata: "rhythm",
  };
  for (const row of stageRows) stages[row.style as Style] = row.stage;
  return {
    style: style[0] ?? null,
    stages,
    completed: await column<string>(
      "SELECT lesson_id FROM completed_lessons WHERE learner_id = $1 ORDER BY completed_at",
      learnerId,
    ),
    activity: await column<string>(
      "SELECT day::text FROM practice_days WHERE learner_id = $1 ORDER BY day",
      learnerId,
    ),
    sources: (
      await pool.query(
        "SELECT id, title, url, style, kind FROM sources WHERE learner_id = $1 ORDER BY created_at",
        [learnerId],
      )
    ).rows as Source[],
  };
}

export async function setStyle(learnerId: string, style: Style) {
  await pool.query(
    `INSERT INTO learners (id, current_style) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET current_style = EXCLUDED.current_style`,
    [learnerId, style],
  );
}

export async function setStage(
  learnerId: string,
  style: Style,
  stage: StartingStage,
) {
  await pool.query(
    `INSERT INTO learner_stages (learner_id, style, stage) VALUES ($1, $2, $3)
     ON CONFLICT (learner_id, style) DO UPDATE SET stage = EXCLUDED.stage`,
    [learnerId, style, stage],
  );
}

export async function completeLesson(
  learnerId: string,
  lessonId: string,
  day: string,
) {
  await pool.query(
    `INSERT INTO completed_lessons (learner_id, lesson_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [learnerId, lessonId],
  );
  await pool.query(
    "INSERT INTO practice_days (learner_id, day) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [learnerId, day],
  );
}

export async function addSource(learnerId: string, source: Source) {
  await pool.query(
    `INSERT INTO sources (id, learner_id, style, title, url, kind)
     VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    [source.id, learnerId, source.style, source.title, source.url, source.kind],
  );
}

export async function removeSource(learnerId: string, sourceId: string) {
  await pool.query("DELETE FROM sources WHERE id = $1 AND learner_id = $2", [
    sourceId,
    learnerId,
  ]);
}
