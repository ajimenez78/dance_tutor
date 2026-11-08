# Dance tutor Project

## Business Requirements

- A Dance tutor that will guide you through learning to dance
- It must support different dancing styles
- It will start with Salsa & Bachata
- At first, you will select the style you want to work throuh
- Learners with prior experience can choose a later starting stage
- Encourage little daily practice
- You must provide a video tutorial for each lesson
- If you already have enough level, you can start in a ore advanced stage
- Encourage learnig and practicing a little bit of knowledge at each time
- You can add sources of knowledge from the Internet (Youtube, web pages or social accounts)
- Let's start with a simple MVP
- Optional accounts (Cognito); guest mode without an account stays

## Technical Details

- A modern React.js frontend
- Use popular libraries
- As simple as possible but with an elegant UI
- Support multi-lingual interface. Start with english and spanish languages. Default must be Spanish.
- Try the videos match the selected language, if possible
- Prefer Spanish speaking tutors.

## Architecture

- `frontend/`: React app (Vite), hosted on AWS Amplify. The build uses `amplify.yml` with `appRoot: frontend`.
- `backend/`: TypeScript AWS Lambda functions, one per endpoint, on Serverless Framework v4 (HTTP API, nodejs24.x, eu-south-2, org `ajimenez`). No Docker or containers.
- All lesson, tutorial, style and playlist content lives in `backend/src/content` and is served under `/api`. Amplify rewrites `/api/<*>` to the API Gateway endpoint.
- Local development: `serverless offline` on 127.0.0.1:3000, with the Vite dev and preview servers proxying `/api` to it. Playwright starts both.
- Learner progress (style, stages, completed lessons, practice days, sources) is stored in Aurora DSQL, keyed by an anonymous learner UUID kept in the browser. The cluster is its own Serverless service in `backend/database/` (`schema.sql`, `npm run db:migrate`); the API reads its endpoint from that stack and connects as `admin` with an IAM token.
- Optional accounts: Amazon Cognito user pool with managed login in its own Serverless service `backend/auth/` (`npm run auth:deploy`). The frontend signs in with `react-oidc-context` using settings from `GET /api/config`. `/api/me/*` routes use an HTTP API JWT authorizer; each learner handler serves both its guest and `/api/me` route through `learnerHandler` (`backend/src/learner.ts`). The `accounts` table maps the Cognito `sub` to a learner. Google and Facebook are Cognito identity providers; managed login shows their buttons.
- `frontend/public/privacy.html`: bilingual privacy policy with data deletion instructions (required by Meta), linked from the app footer.
- Local development and `npm run test:db` use a personal DSQL cluster (stage `${STAGE:-$USER}`); there is no local database.
- `frontend/` and `backend/` are independent npm projects; run checks in each.
- Plans live in `plans/`, one file per feature.

## Development notes

- AWS access uses the SSO profile `AdministratorAccess-891377214100`: prefix commands with `AWS_PROFILE=...`; when the token expires, run `aws sso login --profile AdministratorAccess-891377214100`.
- Deploy order per stage: `npm run db:deploy`, `db:migrate` and `auth:deploy` before the API, since the API resolves the cluster endpoint and ARN from the `dance-tutor-data-<stage>` stack and the user pool from `dance-tutor-auth-<stage>`.
- Identity provider secrets live in Secrets Manager (`dance-tutor/google`, `dance-tutor/facebook`) in eu-south-2, the stacks' region: CloudFormation resolves `{{resolve:secretsmanager:...}}` only in the stack's own region. Never put secrets in SSM parameters or `${ssm:...}`, which would copy them into the template.
- Facebook is deployed to dev only: the Meta app is in development mode (only its admins and testers can sign in). Deploy prod auth once the app is live.
- `serverless offline` enforces the JWT authorizer only with `ignoreJWTSignature: true` and a named authorizer (`authorizer: { name: account }`); it checks issuer, audience and expiry but not the signature.
- Keep `pg` under `build.esbuild.external` in `backend/serverless.yml`: it is CommonJS and fails inside the ESM bundle ("Dynamic require of events").
- Playwright account tests create a Cognito test user with the AWS CLI: run them with `AWS_PROFILE` set.
- The frontend applies progress changes at once and sends saves one at a time, in order (`frontend/src/progress.ts`). In Playwright, use `reloadWhenSaved` from `e2e/fixtures.ts` instead of `page.reload()`.
- Restart long-running dev servers after config changes; check `/api` responses through port 5173 return JSON, not `index.html`.
- The GitHub repo belongs to `ajimenez78`; for `gh` actions use `GH_TOKEN=$(gh auth token --user ajimenez78) gh ...`.
- Update CLAUDE.md for each implemented feature to keep the project context up to date.

## Strategy

1. Write plan with success criteria for each phase to be checked off. Include project scaffolding, including .gitignore, and rigorous unit testing.
2. Execute the plan ensuring all critiera are met
3. Carry out extensive integration testing with Playwright or similar, fixing defects
4. Only complete when the MVP is finished and tested, with the server running and ready for the user

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever

