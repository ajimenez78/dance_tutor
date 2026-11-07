# Database persistence plan (Trello card #2, F801VAoL)

Decisions:

- Persist learner state only: current style, starting stage per style, completed lessons, practice days and saved sources. Lessons, tutorials, styles and playlists stay in `backend/src/content`.
- Storage: Aurora DSQL (PostgreSQL-compatible, serverless, no VPC, IAM auth) in its own Serverless service `dance-tutor-data`, one cluster per stage. The API reads the cluster endpoint through `${param:...}` and connects with `pg` and `@aws-sdk/dsql-signer`.
- Each learner has an anonymous UUID generated in the browser. Card #3 will link it to an account through a nullable `account_id`.
- Fresh start: existing `localStorage` progress is not imported. The language preference stays in the browser.
- Local development and integration tests use a personal dev cluster (stage `arturo`); no Docker, no local emulator.
- If the API is unreachable, show the existing translated error with retry; no offline mode.
- Lambda connects as the DSQL `admin` role (`dsql:DbConnectAdmin`), keeping the schema and the app on one role for this single-tenant MVP.
- `pg` is CommonJS, so it is marked `external` in the esbuild build (an ESM bundle cannot `require` Node built-ins); `@aws-sdk/dsql-signer` is shipped in the artifact instead of relying on the runtime SDK.
- The browser applies each change at once and sends saves one at a time, in order, with `keepalive`; a failed save shows the error with retry, which reloads progress from the API. Browser tests reload only after pending saves finish (`e2e/fixtures.ts`).
- The practice day is sent by the browser (`YYYY-MM-DD` in local time), matching the streak calculation.
- Scripts: `npm run db:deploy`, `db:migrate` and `test:db` in `backend/` target stage `${STAGE:-$USER}`; `npm test` stays database-free.

Model (UUID keys, no sequences; DSQL does not enforce foreign keys):

- `learners(id uuid pk, current_style text null, created_at timestamptz)`
- `learner_stages(learner_id uuid, style text, stage text, pk(learner_id, style))`
- `completed_lessons(learner_id uuid, lesson_id text, completed_at timestamptz, pk(learner_id, lesson_id))`
- `practice_days(learner_id uuid, day date, pk(learner_id, day))`
- `sources(id uuid pk, learner_id uuid, style text, title text, url text, kind text, created_at timestamptz)`

API (`{id}` is the learner UUID):

- `GET /api/learners/{id}/progress` returns the frontend `Progress` shape; an unknown learner gets empty progress.
- `PUT /api/learners/{id}/style`, `PUT /api/learners/{id}/stages/{style}`
- `POST /api/learners/{id}/completions` records the lesson and today's practice day.
- `POST /api/learners/{id}/sources`, `DELETE /api/learners/{id}/sources/{sourceId}`
- Requests are validated (UUID, style, stage, lesson ID, source URL and kind); invalid input returns 400.

Checkpoints:

- [x] 1. Data service: `dance-tutor-data` defines the DSQL cluster; deployed to stage `arturo`; `select 1` succeeds with an IAM token.
- [x] 2. Schema: a SQL migration file and an npm script apply it idempotently; all five tables exist on the dev cluster.
- [x] 3. Repository: a backend module reads and writes progress; its tests pass against the dev cluster.
- [x] 4. Handlers: progress routes in `serverless.yml` with `dsql:DbConnectAdmin` permission; handler unit tests pass; a curl round trip through `serverless offline` persists and returns progress.
- [x] 5. Frontend: generates and keeps the learner UUID, loads and saves progress through the API instead of `localStorage`; "stays in this browser" copy updated in both languages; unit tests pass.
- [x] 6. Browser tests: Playwright against `serverless offline` and the dev cluster; completing a lesson survives a reload, a new browser context starts empty; full suite passes.
- [x] 7. Deploy: data service and API to `prod`, schema applied, progress round trip verified through the Amplify domain (warm requests 0.1-0.2 s).
- [x] 8. Docs and PR: README, CLAUDE.md architecture and this plan updated; PR opened.
- [ ] 9. After merge: the Amplify build serves the new frontend and the live app keeps progress across a reload.
