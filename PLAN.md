# Dance tutor MVP plan

## Tutorial language matching

- [x] Find and verify Spanish-speaking tutors whose demonstrations match the Salsa On1 and Bachata lessons.
- [x] Select the tutorial by interface language, retaining suitable English versions and showing the actual audio language.
- [x] Switching languages changes the tutorial without starting playback automatically; retain direct source links.
- [x] Cover every lesson in both languages with unit/browser checks, verify live players and leave the local server running.
- [x] Update the README with the tutorial language behavior.

## Refactor: video, starting stage and languages

- [x] Provide a verified, relevant video tutorial for every lesson, with an embedded player, attribution and a direct viewing link.
- [x] Let learners choose rhythm, basic steps or combinations as a starting stage, independently per style; skipped lessons remain available and are not marked completed.
- [x] Default to Spanish and translate every interface, lesson, quiz, validation message and accessible label into Spanish and English; persist the language preference.
- [x] Preserve existing progress and saved sources when loading the updated app.
- [x] Extend unit and production browser tests for both languages, videos, stage selection, migration and responsive accessibility; fix failures.
- [x] Update the README and leave the local server running.

## 1. Scaffold

- [x] Set up React, TypeScript and Vite with current stable packages and a lockfile.
- [x] Include .gitignore, minimal README, unit tests and Playwright configuration.

## 2. Build the MVP

- [x] First visit starts with Salsa or Bachata selection; switching styles preserves progress.
- [x] Each style has four small lessons with instruction, guided practice and completion.
- [x] Practice has an animated count, adjustable tempo and a working start/pause/reset timer.
- [x] Daily activity, lesson progress and streaks persist locally without an account.
- [x] Users can add, open and remove web, YouTube and social learning sources by style.
- [x] Responsive, keyboard-accessible UI with clear empty, error and completion states.

## 3. Verify

- [x] Rigorous unit tests cover progress, date boundaries, streaks, storage, source validation and practice controls.
- [x] Playwright covers onboarding, lessons, persistence, switching styles, library CRUD, validation and mobile layouts.
- [x] Type check and production build pass; inspect desktop/mobile screenshots and fix defects.

## 4. Handoff

- [x] Record verification results and concise local run instructions.
- [x] Leave the working development server running and provide its URL.

## Original MVP verification — 29 October 2026

- 40 unit tests passed, including a run with Node 26. Coverage for the progress model and practice component: 100% statements, lines and functions; 98.55% branches.
- 26 Playwright tests passed against the production build in Chrome at desktop and mobile viewports. Both complete lesson paths, repeat practice, source CRUD and persistence were exercised.
- Automated WCAG AA scans passed for onboarding, today, learning path, library, source form, lesson, practice, quiz and completion on both viewports.
- TypeScript and Vite production build passed. Desktop/mobile screenshots inspected; contrast and accessible-label defects fixed.
- Local development server: http://localhost:5173. Progress and links stay in this browser; the practice count is visual.

## Refactor verification — 29 October 2026

- 54 unit tests passed on Node 26 with the Madrid timezone. The covered progress, practice, language and video modules have 99.02% statement coverage and 96.62% branch coverage.
- 50 production Playwright tests passed on desktop and mobile, including English and Spanish accessibility scans across nine screens, all eight tutorial mappings, starting stages, migration and switching languages within a lesson.
- Tutorial IDs and authors verified against public creator pages and YouTube oEmbed. Real embedded player smoke checks supplement the deterministic video-frame tests. Related lessons share full demonstrations with lesson-specific instructions. Videos have English audio.
- Spanish desktop/mobile screenshots reviewed; a missing space on mobile onboarding was corrected and covered by a browser assertion.
- TypeScript and production build pass. README and requirements updated. Existing progress and links migrate without being erased. Local server remains at http://localhost:5173.

## Tutorial language verification — 29 October 2026

- All eight lessons have Spanish and English spoken-language tutorial mappings. Spanish defaults to Alfonso y Mónica’s Salsa On1 and Bachata basics, verified against their own website and YouTube metadata.
- Switching language replaces the tutor, video ID, source link and audio label. Playback stops and the replacement video waits for a new play action.
- Both Spanish videos played successfully in real Chrome embeds (player state 1, playback time advancing, no player error).
- 54 unit tests and 54 production desktop/mobile Playwright tests passed, including audio language metadata, all lesson/video mappings, playback reset, existing journeys and bilingual accessibility scans. TypeScript and the production build passed.
- README updated; local server ready at http://localhost:5173.
