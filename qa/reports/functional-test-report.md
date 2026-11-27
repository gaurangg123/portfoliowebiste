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
| `npm run test:e2e` (Playwright and axe-core) | **Pass**: 109 passed, 0 failed, 4 skipped |

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
| Query page direct URL works | **Pass** | `/query-engineer/` returns 200; `/query-engineer` redirects to it, as GitHub Pages does |
| Suggested questions work | **Pass** | Clicking a topic adds the question and a grounded answer (Snowflake, Tata Technologies, contact) |
| Question input works | **Pass** | A typed question gets an answer, the box clears, ↑ recalls it, follow-up chips ask the next one. Questions asked while an answer is still arriving are queued, not dropped (a bug the test found). |
| Answers are grounded in portfolio content | **Pass** | Unit tests: every suggested question matches its topic; links come only from the data; nothing typed is echoed; unknown topics are declined ("Not in this portfolio"); no invented numbers |
| Project links work | **Pass** | An answer's case-study link opens that case study |
| Case studies work | **Pass** | All five load (200) with every section and next/previous links; the back link returns to `#projects`; direct URLs and section fragments work |
| Resume downloads | **Pass (link only)** | Every résumé link is the supplied Google Drive *viewing* URL, opening in a new tab; never a forced download or an embed. Drive's sharing permissions were **not** tested, because Drive is unreachable from the test environment. |
| Theme toggle works | **Pass** | Switches, is remembered across reloads and pages, and passes axe in both themes, on the homepage and on the Query page |
| All social links work | **Pass (targets)** | GitHub, LinkedIn and email `href`s match the supplied profiles. The external sites themselves were not opened, because they are unreachable from here. |
| No broken images | **Pass** | Every rendered image loads with alt text; every referenced image returns 200 |
| No uncaught browser errors | **Pass** | None on the homepage, the case studies, the Query page or the 404 page, across a full scroll |

## Other checks

| Check | Result |
| --- | --- |
| Project filters | **Pass**: the gallery narrows to a category; the lab row hides when no experiment matches; the count is announced |
| Gallery composition | **Pass**: the lead project shows all four facts; projects are numbered 01–07; wide and narrow cards differ in width on desktop; the rest scroll sideways on phones |
| Disciplines | **Pass**: four plates with exactly the approved tool lists |
| How I approach the work | **Pass**: five stages with the agreed lines; every "In practice" link resolves |
| Architecture | **Pass**: seven stages; select by click and keyboard; the agreed description |
| Without JavaScript | **Pass**: the Query page shows pre-rendered answers to the eight suggested questions |
| Old links | **Pass**: `#/trk-0N` opens its case study; `#terminal` opens Query the Engineer |
| Walkthrough and Papercut | **Pass**: the walkthrough opens and closes without touching the Papercut player, whose file is never requested |
| Reduced motion | **Pass**: nothing is held back; the lattice is a still frame |

## Not verified here

- **The live site** on `gaurangg123.github.io`: the host doesn't resolve from this environment, directly or through a fetch agent. Deployment was checked through the GitHub Pages workflow run and by confirming that `main` matches the tested build.
