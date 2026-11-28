# Functional test report — DataForge 2.0

The checks below ran on the production build. It was served under `/portfoliowebiste/` by `tools/serve.js`, which mimics GitHub Pages: folder URLs serve `index.html`, a path without its trailing slash redirects, and missing paths get `404.html`.

**Browser:** Chromium 1243 via Playwright 1.63, in three projects:

- **desktop**: 1440×900
- **mobile**: Pixel 7 emulation, touch, 412px
- **responsive**: the nine QA viewports, from 1920×1080 down to 360×800

## Commands and results

| Command | Result |
| --- | --- |
| `npm run build` | **Pass**: 9 pages (with `query-engineer/`), the shared CSS and JS bundles, the Query page bundle, sitemap, robots |
| `npm run lint` (ESLint 10) | **Pass**: 0 problems |
| `npm run typecheck` (TypeScript 5.9, `strict`, `checkJs`) | **Pass**: 0 errors |
| `npm run validate:html` (html-validate 9) | **Pass**: 0 errors on all 8 HTML pages |
| `npm run test:unit` (`node:test`) | **Pass**: 22 / 22 |
| `npm run test:e2e` (Playwright and axe-core) | **Pass**: 115 passed, 0 failed, 4 skipped |

The four skips are by design:

- The keyboard test and the rail-overlap test run on desktop only.
- The menu test runs on mobile only.
- The back/forward test uses the desktop rail.

## The requested checklist

| Check | Result | How it was tested |
| --- | --- | --- |
| Right-side navigation works | **Pass** | Rail links scroll to their sections; each name appears on hover and keyboard focus |
| Active section indicator updates | **Pass** | `aria-current="location"` moves to the section being read; the ink sits on that link to within 3px; the progress line fills |
| Navigation does not overlap content | **Pass** | Every `.container` on the page ends left of the rail; at all nine viewports, no element runs past the screen edge |
| Mobile navigation works | **Pass** | The floating button opens the full-screen menu; a link navigates and closes it; Escape closes it and returns focus; Tab stays inside |
| Logo returns to homepage top | **Pass** | The rail's mark (desktop) and the masthead (mobile) scroll to the top and take focus |
| No unnecessary `#top` fragment | **Pass** | The address has no fragment after the mark, Home, back-to-top or the footer link; no link on any page points at `#top`; an old `#top` address is cleaned on load |
| Query the Engineer opens a separate page | **Pass** | From the homepage invitation, the rail, the small-screen menu and the footer, each lands on `/query-engineer/` |
| Query page refresh works | **Pass** | Reloaded; still answers |
| Query page fits one screen | **Pass** | The page never scrolls at 1440×900, 1366×768, 390×844 or 360×640; only the conversation scrolls, and the question box stays on screen. There is no "Try asking" list. |
| Query page direct URL works | **Pass** | `/query-engineer/` returns 200; `/query-engineer` redirects to it, as GitHub Pages does |
| Suggested questions work | **Pass** | The suggestions inside the conversation add the question and a grounded answer (Snowflake, Tata Technologies) |
| Question input works | **Pass** | A typed question gets an answer, the box clears, ↑ recalls it, follow-up chips ask the next one. Questions asked while an answer is still arriving are queued, not dropped (a bug the test found). |
| Answers are grounded in portfolio content | **Pass** | Unit tests: every suggested question matches its topic; links come only from the data; nothing typed is echoed; unknown topics are declined ("Not in this portfolio"); no invented numbers |
| Project links work | **Pass** | An answer's case-study link opens that case study |
| Case studies work | **Pass** | All five load (200) with every section and next/previous links; direct URLs and section fragments work. "Back to projects" returns to the place on the homepage you came from, or to Projects when the case study was opened directly. |
| Resume downloads | **Pass (link only)** | Every résumé link is the supplied Google Drive *viewing* URL, opening in a new tab; never a forced download or an embed. Drive's sharing permissions were **not** tested, because Drive is unreachable from the test environment. |
| Theme toggle works | **Pass** | Switches, is remembered across reloads and pages, and passes axe in both themes, on the homepage and on the Query page |
| All social links work | **Pass (targets)** | GitHub, LinkedIn and email `href`s match the supplied profiles. The external sites themselves were not opened, because they are unreachable from here. |
| No broken images | **Pass** | Every rendered image loads with alt text; every referenced image returns 200 |
| No uncaught browser errors | **Pass** | None on the homepage, the case studies, the Query page or the 404 page, across a full scroll |

## Other checks

| Check | Result |
| --- | --- |
| Project filters | **Pass**: the gallery narrows to a category; the lab row hides when no experiment matches; the count is announced |
| Gallery composition | **Pass**: three labelled groups (Featured project, More from Tata Technologies, The lab); the featured project shows all four facts; projects are numbered 01–07; the four company cards share one width, rows line up, and their buttons sit on one line; the rest scroll sideways on phones |
| Disciplines | **Pass**: four plates in an even grid, with exactly the approved tool lists |
| About | **Pass**: the path so far beside how I approach the work in one panel, with the five agreed lines; no links lead away from it; no résumé button or audio player |
| Opening | **Pass**: no running side text and no index |
| Architecture | **Pass**: seven stages; select by click and keyboard; the agreed description |
| Without JavaScript | **Pass**: the Query page shows pre-rendered answers to the eight suggested questions |
| Old links | **Pass**: `#/trk-0N` opens its case study; `#terminal` opens Query the Engineer |
| Walkthrough | **Pass**: opens and closes; nothing plays audio, and there is no audio player on the page |
| Reduced motion | **Pass**: nothing is held back; the lattice is a still frame |

## Not verified here

- **The live site** on `gaurangg123.github.io`: the host doesn't resolve from this environment, directly or through a fetch agent. Deployment was checked through the GitHub Pages workflow run and by confirming that `main` matches the tested build.
