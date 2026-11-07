# Ritmo

A small dance tutor for Salsa and Bachata. Spanish by default, with an English language selector. No account needed: progress is saved to the API under an anonymous browser ID. Signing in is optional and makes progress follow you across devices.

- `frontend/`: React, TypeScript and Vite, hosted on AWS Amplify.
- `backend/`: content and progress API as TypeScript AWS Lambda functions, deployed with Serverless Framework v4.
- `backend/database/`: the Aurora DSQL cluster (PostgreSQL-compatible) that stores learner progress, as its own Serverless service.
- `backend/auth/`: the Amazon Cognito user pool and managed login pages for optional accounts, as its own Serverless service.

**Live app:** [Try Ritmo](https://main.d3k2uxz8qd3ag0.amplifyapp.com/) — hosted on AWS Amplify.

## What you can do

- Work through eight short lessons: learn the steps, practice and answer a quick question.
- Watch video demonstrations and use a one-minute visual count with adjustable tempo and pause/reset controls.
- Track completed lessons, daily activity and your practice streak.
- Keep your own YouTube, article and social links in a library for each dance style.

Choose rhythm, basic steps or combinations as your starting stage, independently for each style. Earlier lessons remain available for review and are only marked complete when finished. Existing saved progress is preserved.

## API

Content endpoints accept `lang=es|en` (default `es`).

- `GET /api/health`
- `GET /api/styles`
- `GET /api/styles/{style}/lessons`: core lessons with their tutorial
- `GET /api/styles/{style}/playlist`: playlist details and its lessons by level

Progress endpoints take the learner's UUID:

- `GET /api/learners/{id}/progress`
- `PUT /api/learners/{id}/style`, `PUT /api/learners/{id}/stages/{style}`
- `POST /api/learners/{id}/completions` (`lessonId`, local `day`)
- `POST /api/learners/{id}/sources`, `DELETE /api/learners/{id}/sources/{sourceId}`

Guest routes return 403 for a learner linked to an account. Signed-in learners use the same routes under `/api/me` (for example `GET /api/me/progress`) with a Cognito access token (`Authorization: Bearer`); without a valid token they return 401.

- `GET /api/config`: sign-in settings (issuer, managed login domain, client ID)
- `POST /api/me/link` (`learnerId`): links the guest learner on first sign-in and returns the account's learner

## Run locally

Use Node 24 or 26 and npm. The Serverless CLI (`npm i -g serverless`) needs a `serverless login`, even offline. Progress uses a personal DSQL cluster in AWS (stage `${STAGE:-$USER}`), so AWS credentials are needed.

```sh
cd backend && npm ci
npm run db:deploy && npm run db:migrate # once: personal cluster and schema
npm run auth:deploy                     # once: personal user pool
npm run dev                             # API on http://127.0.0.1:3000
cd frontend && npm ci && npm run dev    # app on http://localhost:5173, proxies /api
```

## Screenshots

The daily Salsa dashboard in Spanish:

![Spanish desktop dashboard with a recommended Salsa lesson, daily streak and learning path](docs/screenshots/desktop-today.png)

Guided Bachata practice on mobile:

<img src="docs/screenshots/mobile-practice.png" alt="Spanish mobile Bachata practice with an eight-count guide, tempo slider and practice controls" width="320" />

## Checks

```sh
cd backend && npm run typecheck && npm test && npm run test:db
cd frontend && npm run test:coverage && npm run build && npm run test:e2e
```

Browser tests use installed Google Chrome and the AWS CLI (they create a confirmed test user in the stage's user pool), with desktop and mobile viewports, and run against a production build on port 4173 with the API from `serverless offline`. If Chrome is unavailable, install it or change `channel` in `playwright.config.ts` to an installed Playwright browser.

## A few details

The practice count is visual. Tutorials follow your selected language: Spanish-speaking tutors Alfonso y Mónica in Spanish mode, and English-language demonstrations in English mode. Each video shows its audio language and a direct source link. Related lessons share full tutorials; changing language stops playback before loading the matching version.

## Deploy

1. Database: `cd backend && STAGE=prod npm run db:deploy && STAGE=prod npm run db:migrate` (needs AWS credentials). The prod cluster has deletion protection.
1. Auth: `STAGE=prod npm run auth:deploy`. The prod app client accepts the Amplify domain as callback and sign-out URL.
1. API: `npm run deploy -- --stage prod`. It reads the cluster endpoint from the data stack and the user pool from the auth stack. Note the HTTP API URL it prints.
1. Amplify: the build uses `amplify.yml` with `appRoot: frontend`, so no extra environment variable is needed. In Rewrites and redirects, add `/api/<*>` to `https://<api-id>.execute-api.<region>.amazonaws.com/api/<*>` as a `200 (Rewrite)`, above the SPA fallback rule.

## Data

Progress, completed lessons, practice days and saved links are stored in Aurora DSQL under an anonymous learner ID kept in the browser. Clearing browser data loses that ID, and with it access to the saved progress, unless you signed in: the first sign-in links the guest progress to your account, and later sign-ins on any device load it. Signing out starts a new, empty guest. The language preference stays in the browser.
