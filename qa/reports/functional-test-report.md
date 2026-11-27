# Functional test report — DataForge (refinement round)

The checks below were run on the production build served under `/portfoliowebiste/` by `tools/serve.js`, which mimics GitHub Pages.

**Browser:** Chromium 1243 via Playwright 1.63, in three projects:

- **desktop**: 1440×900
- **mobile**: Pixel 7 emulation, touch, 412 px
- **responsive**: the nine QA viewports, from 1920×1080 down to 360×800

## Commands and results

| Command | Result |
| --- | --- |
| `npm run build` | **Pass**: 8 pages, CSS and JS bundles, sitemap, robots |
| `npm run lint` (ESLint 10) | **Pass**: 0 problems |
| `npm run typecheck` (TypeScript 5.9, `strict`, `checkJs`) | **Pass**: 0 errors |
| `npm run validate:html` (html-validate 9) | **Pass**: 0 errors on all 7 HTML pages |
| `npm run test:unit` (`node:test`) | **Pass**: 15 / 15 |
| `npm run test:e2e` (Playwright and axe-core) | **Pass**: 88 passed, 0 failed, 3 skipped (run twice in a row, both green) |

The three skips are by design:

- The keyboard test runs on desktop only.
- The menu test runs on mobile only.
- The back/forward test uses the desktop navigation bar.

## What changed in the tests

- **Removed:** the terminal tests (`qa/unit/terminal.test.js` and the e2e terminal test).
- **Added (e2e):**
  - the engineering workflow: five stages, one open at a time, keyboard, panel content, and every example link resolves;
  - disciplines with their exact tool lists;
  - the project explorer: one project on show (desktop), the swipeable row with counter and previous/next (mobile), and filters updating both;
  - the wordmark, the floating button and the footer link return to the top without `#top`;
  - an old `#top` address is cleaned on load, and real fragments are kept;
  - back and forward between sections and the top;
  - the theme toggle switches, is remembered across reloads and pages;
  - accessibility (axe) in the light theme;
  - direct case-study URLs, including a section fragment.
- **Added (unit):**
  - no forms anywhere;
  - no terminal or "query the engineer" text left on any page;
  - no `#top` links or ids;
  - the approved discipline tool lists;
  - the architecture description and supported technologies;
  - the workflow's five stage lines and documented examples;
  - text contrast (WCAG AA) for both themes, read from the tokens.

Two problems were found by these tests and fixed in the site, not in the tests:

- **Light-theme amber** text on the alternate band was 4.43:1. The token is now `#A14607`, which passes AA.
- **Held-back sections:** under load, a fast scroll could carry a section past the screen between frames. It then stayed hidden until scrolled back to. A catch-up sweep in `src/scripts/reveal.js` now shows anything already reached.

## Mandatory checks

| Check | Result | How |
| --- | --- | --- |
| Homepage loads | **Pass** | One `h1` with the name and "Engineering Intelligence" in the first screen; no console errors or failed requests across a full scroll (desktop and mobile) |
| Logo returns to the top without `#top` | **Pass** | Scroll position returns to 0, the address has no fragment, and focus lands on the wordmark |
| Navigation | **Pass** | Desktop links scroll to their sections and set `aria-current`; the mobile sheet opens, navigates and closes; no link points at a removed section |
| Mobile menu | **Pass** | Opens, closes with Escape, returns focus, and sets `aria-expanded` |
| Résumé | **Pass** | Every résumé link is the supplied Drive viewing URL, opens in a new tab with `rel=noopener`, and is never a forced download or an embed. Access permissions on Drive were **not** tested (the host is unreachable from the test environment). |
| GitHub, LinkedIn, email | **Pass** | `href`s checked against the supplied profiles; email is a `mailto:` |
| Project filters | **Pass** | Counts update, the index and showcase follow, and the result is announced |
| Case studies | **Pass** | All five load (200) with every section; next/previous links; the back link returns to `#projects` |
| Direct project URLs | **Pass** | `/work/<slug>/` loads directly; `#<section>` fragments scroll to their section |
| 404 | **Pass** | A missing path returns 404 with a link home |
| Architecture | **Pass** | Seven stages; select by click and keyboard; the agreed description is present |
| Workflow | **Pass** | Five stages with the agreed lines; keyboard; examples link to real case studies |
| Contact | **Pass** | Copy email confirms and writes to the clipboard; channels link correctly; no form |
| Dark/light theme | **Pass** | Toggles, is remembered, is applied before paint on every page, and passes axe in both themes |
| Images | **Pass** | Every rendered image loads with alt text; project images on hidden cards are lazy and load when shown; every referenced file returns 200 |
| JavaScript errors | **Pass** | None on the homepage, the case studies or the 404 page |
| Horizontal overflow | **Pass** | None at any of the nine viewports, on the homepage and two case studies |
| Walkthrough and Papercut | **Pass** | The walkthrough opens and closes without touching the Papercut player, whose file is never requested |
| Reduced motion | **Pass** | Nothing is held back; the lattice is a still frame |

## Not verified here

- **The live site** on `gaurangg123.github.io`: the host is not reachable from this test environment. The deployment is checked through the GitHub Pages workflow run instead; see the final report.
