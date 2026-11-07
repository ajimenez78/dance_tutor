# Multi-user accounts plan (Trello card #3, p1anjKkg)

Decisions (confirmed 2026-11-07):

- Email sign-in ships first. Google and Facebook are wired up but enabled only once their OAuth client IDs and secrets exist (checkpoint 5 waits for them).
- After guest progress is linked, the browser gets a fresh guest ID, so signing out starts a blank guest session.
- Work on branch `multi-user-accounts`; prod deploy allowed once dev checks pass.

- Identity: Amazon Cognito user pool, one per stage, in its own Serverless service `dance-tutor-auth` (`backend/auth/`). It provides sign-up with email verification, sign-in, password reset and federation without running our own auth code.
- Sign-in UI: Cognito managed login pages (authorization code flow with PKCE, Spanish and English), opened from the app with `react-oidc-context`. The app client is public (no secret).
- Federation: Google and Facebook as Cognito social identity providers. Instagram is not offered: Cognito has no Instagram provider and Instagram does not provide consumer login for third-party apps; Facebook covers Meta accounts.
- Guest mode stays: the app works without an account, as today. Signing in is optional and makes progress follow the user across devices.
- On first sign-in, the current guest progress is linked to the account. Later sign-ins on other devices load the account's progress.
- Model: new table `accounts(sub text pk, learner_id uuid, created_at)` maps the Cognito user (`sub`) to a learner. Progress tables do not change.
- API: `/api/me/...` routes mirror the learner routes, protected by an HTTP API JWT authorizer for the user pool; the learner is resolved from the token, never from the request. Anonymous `/api/learners/{id}` routes refuse learners linked to an account (403), so linked progress is only reachable with a token.
- Frontend config (user pool domain and client ID) comes from `GET /api/config`, so Amplify needs no new environment variables.
- Callback and sign-out URLs: `http://localhost:5173`, `http://localhost:4173` (dev stage) and the Amplify domain (prod).
- Email: Cognito's built-in sender for the MVP (daily sending limit); Amazon SES later if needed.

Model:

- `accounts(sub text pk, learner_id uuid not null, created_at timestamptz)`; one account per learner, enforced by a unique index on `learner_id`.

API:

- `GET /api/config` returns the authority (user pool issuer), managed login domain and client ID.
- `POST /api/me/link` with `{ learnerId }` links the guest learner on first sign-in; if the account already has a learner, it is returned unchanged and the guest learner is left as is.
- `GET /api/me/progress`, `PUT /api/me/style`, `PUT /api/me/stages/{style}`, `POST /api/me/completions`, `POST /api/me/sources`, `DELETE /api/me/sources/{sourceId}`.
- Missing or invalid token returns 401.

Checkpoints:

- [x] 1. Auth service: `dance-tutor-auth` defines the user pool, public app client and managed login domain; deployed to stage `arturo`; a test user can sign up, verify the email and sign in on the managed login page.
- [x] 2. Accounts schema and repository: `accounts` table added to `schema.sql` and migrated; repository functions to link and resolve an account; tests pass against the dev cluster.
- [x] 3. Protected API: JWT authorizer and `/api/me/*` routes; anonymous routes reject linked learners; handler unit tests pass; a curl round trip with a real dev-pool token works and without a token returns 401. `serverless offline` checks issuer, audience and expiry only with `ignoreJWTSignature` and a named authorizer (`authorizer: { name: account }`); API Gateway verifies the signature, tested on the deployed dev stage.
- [ ] 4. Frontend sign-in: `react-oidc-context` with config from `/api/config`; sign in, sign up and sign out in the header in both languages; progress uses `/api/me` when signed in and links guest progress on first sign-in; unit tests pass.
- [ ] 5. Federation: Google and Facebook providers configured with client secrets in SSM Parameter Store (SecureString), email attribute mapped; manual sign-in with each works on the dev stage.
- [ ] 6. Browser tests: Playwright with a dev-pool test user (created with the admin API): guest progress is linked on first sign-in, progress appears in a second browser after sign-in, sign-out returns to guest mode; full suite passes.
- [ ] 7. Deploy: auth service, schema and API to `prod`; Amplify domain registered as callback; live sign-up, sign-in with Google and Facebook, and progress across two browsers verified.
- [ ] 8. Docs and PR: README, CLAUDE.md and this plan updated; PR opened.
