# Multi-user accounts plan (Trello card #3, p1anjKkg)

Decisions:

- Identity: Amazon Cognito user pool (Essentials tier), one per stage, in its own Serverless service `dance-tutor-auth` (`backend/auth/`). It provides sign-up with email verification, sign-in, password reset and federation without running our own auth code.
- Sign-in UI: Cognito managed login pages (authorization code flow with PKCE, Spanish and English), opened from the app with `react-oidc-context`. The app client is public (no secret). Sign-up is the managed login page's "Create an account" link.
- Federation: Google and Facebook as Cognito identity providers. Instagram is not offered: Cognito has no Instagram provider and Instagram does not provide consumer login for third-party apps; Facebook covers Meta accounts. Client secrets live in Secrets Manager (`dance-tutor/google`, `dance-tutor/facebook`, eu-south-2) and are resolved by CloudFormation, so they never appear in the template.
- Guest mode stays: the app works without an account. Signing in is optional and makes progress follow the user across devices.
- On first sign-in, the current guest progress is linked to the account. Later sign-ins on other devices load the account's progress. After every sign-in the browser starts a new guest, so signing out starts a blank guest session.
- API: `/api/me/...` routes mirror the learner routes, protected by an HTTP API JWT authorizer; the learner is resolved from the token, never from the request. Guest `/api/learners/{id}` routes refuse learners linked to an account (403).
- Frontend config (issuer, managed login domain and client ID) comes from `GET /api/config`, so Amplify needs no environment variables.
- Callback and sign-out URLs: `http://localhost:5173` and `http://localhost:4173` (dev stages), the Amplify domain (prod).
- Email: Cognito's built-in sender for the MVP (daily sending limit); Amazon SES later if needed.
- Region: all stacks run in eu-south-2 (moved from eu-west-1 on 2026-11-08; prod data copied with the same learner IDs).
- Privacy policy and data deletion instructions (required by Meta): `frontend/public/privacy.html`, linked from the app footer.

Model:

- `accounts(sub text pk, learner_id uuid not null unique, created_at timestamptz)`: one account per learner. If a guest learner already belongs to another account, linking gives the new account a fresh learner.

API:

- `GET /api/config` returns the authority (user pool issuer), managed login domain and client ID.
- `POST /api/me/link` with `{ learnerId }` links the guest learner on first sign-in; if the account already has a learner, it is returned unchanged.
- `GET /api/me/progress`, `PUT /api/me/style`, `PUT /api/me/stages/{style}`, `POST /api/me/completions`, `POST /api/me/sources`, `DELETE /api/me/sources/{sourceId}`.
- Missing or invalid token returns 401.

Checkpoints:

- [x] 1. Auth service: user pool, public app client and managed login domain; a test user can sign up and sign in on the managed login page.
- [x] 2. Accounts schema and repository: `accounts` table migrated; link and resolve functions; tests pass against the dev cluster.
- [x] 3. Protected API: JWT authorizer and `/api/me/*` routes; guest routes reject linked learners; unit tests pass; round trip with a real token works and returns 401 without one, both offline and deployed.
- [x] 4. Frontend sign-in: sign in and sign out in the header in both languages; progress uses `/api/me` when signed in and links guest progress on first sign-in; unit tests pass.
- [ ] 5. Federation:
  - [x] Google: deployed to dev and prod; sign-in works in both.
  - [ ] Facebook: deployed to dev and tested with an admin account. The Meta app (1808115900427571) is still in development mode; once it is live, run `STAGE=prod npm run auth:deploy` and check sign-in on the live site.
- [x] 6. Browser tests: Playwright with a dev-pool test user created with the admin API; guest progress linked on first sign-in, progress in a second browser, sign-out returns to a new guest; full suite passes.
- [ ] 7. Deploy:
  - [x] Auth, schema and API in prod (eu-south-2); Amplify `/api` rewrite points to the eu-south-2 API; live sign-in with Google works.
  - [ ] Live email sign-up with a real inbox (verification email).
  - [ ] Relink the owner's account: the prod user re-registered in the eu-south-2 pool, so the old `accounts` row (old `sub`) must move to the new `sub`.
  - [ ] Remove the old eu-west-1 prod stacks (`dance-tutor-api-prod`, `dance-tutor-auth-prod`, `dance-tutor-data-prod`; the cluster has deletion protection) once the relink is done.
- [x] 8. Docs and PRs: README, CLAUDE.md and this plan updated; PRs #3 to #6 merged.
