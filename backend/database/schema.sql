CREATE TABLE IF NOT EXISTS learners (
  id uuid PRIMARY KEY,
  current_style text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learner_stages (
  learner_id uuid NOT NULL,
  style text NOT NULL,
  stage text NOT NULL,
  PRIMARY KEY (learner_id, style)
);

CREATE TABLE IF NOT EXISTS completed_lessons (
  learner_id uuid NOT NULL,
  lesson_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (learner_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS practice_days (
  learner_id uuid NOT NULL,
  day date NOT NULL,
  PRIMARY KEY (learner_id, day)
);

CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY,
  learner_id uuid NOT NULL,
  style text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ASYNC IF NOT EXISTS sources_by_learner ON sources (learner_id);

CREATE TABLE IF NOT EXISTS accounts (
  sub text PRIMARY KEY,
  learner_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
