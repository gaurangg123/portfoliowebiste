# Functional test report — DataForge

The checks below were run on the production build served under `/portfoliowebiste/` (`tools/serve.js`, which mimics GitHub Pages).

**Browser:** Chromium 1243 via Playwright 1.63, on two projects:

- **desktop**: 1440×900
- **mobile**: Pixel 7 emulation, touch, 412 px

## Commands and results

| Command | Result |
| --- | --- |
| `npm run build` | **Pass**: 8 pages, CSS and JS bundles, sitemap, robots |
| `npm run lint` (ESLint 10, `@eslint/js` recommended) | **Pass**: 0 problems |
| `npm run typecheck` (TypeScript 5.9, `strict`, `checkJs`) | **Pass**: 0 errors |
| `npm run validate:html` (html-validate 9, recommended preset) | **Pass**: 0 errors on all 7 HTML pages |
| `npm run test:unit` (`node:test`) | **Pass**: 18 / 18 |
| `npm run test:e2e` (Playwright and axe-core) | **Pass**: 73 passed, 0 failed, 2 skipped |

The two skips are by design:

- The keyboard test runs on desktop only.
- The menu test runs on mobile only.

**html-validate configuration.** The recommended preset is used, with these rule changes:

- `no-inline-style` off: inline `--i` custom properties set animation order.
- `no-trailing-whitespace` off: generated whitespace.
- `long-title` off: SEO titles.
- `no-redundant-role` off: explicit table roles keep semantics on tables restyled as grids.
- `aria-label-misuse` allows names on namable roles: lists, navs and groups.

## Mandatory checks

| Check | Result | How |
| --- | --- | --- |
| Website loads | **Pass** | One `h1` with the name and "Engineering Intelligence" in the first screen; no console errors and no failed requests across a full scroll (desktop and mobile) |
| Navigation works | **Pass** | Desktop links scroll to their sections and set `aria-current`; the indicator moves |
| Hero buttons work | **Pass** | Explore My Work goes to `#projects`, Contact Me to `#contact`; Download Resume points to the supplied Drive URL in a new tab with `rel=noopener` |
| Resume downloads correctly | **Blocked** (link verified) | Every résumé link is exactly the supplied Drive viewing URL, checked by unit and e2e tests. `drive.google.com` is unreachable from this environment (proxy 403), so the file itself could not be opened. The URL is not converted into a forced download, by instruction. |
| GitHub link opens correctly | **Pass** (target verified) | `https://github.com/gaurangg123`, new tab, `noopener`. Loading github.com from here returns a proxy 403. |
| LinkedIn link opens correctly | **Pass** (target verified) | `https://www.linkedin.com/in/gaurang-ashava/`, new tab. LinkedIn is unreachable from here. |
| Email link works | **Pass** | `mailto:gaurangashava@gmail.com` in the hero, contact section, terminal and footer; Copy email writes it to the clipboard (verified by reading the clipboard back) |
| Project filters work | **Pass** | Data Engineering shows 1, Automation 3, All 7; `aria-pressed` updates; the count is announced; one card leads |
| Project detail navigation works | **Pass** | A mission title opens its case study; all 8 sections are present; back link returns to `#projects`; previous/next cards; all 5 case studies return 200 with no errors |
| Architecture diagram interactions work | **Pass** | Seven tabs, one panel; click selects; ←/→/Home/End move and select; neighbours marked as linked |
| Terminal accepts commands | **Pass** | Commands answer from portfolio data; Tab completes (`educ` → `education`); ↑/↓ recall history; command chips run and refocus the prompt; typed HTML is printed as text, never rendered |
| Terminal `clear` works | **Pass** | Output empties; Ctrl+L also clears |
| Contact form works if implemented | **N/A** | Not implemented: there is no working submission integration. A unit test asserts that the only form is the terminal prompt. |
| Mobile menu opens | **Pass** | `aria-expanded="true"`; sheet visible; page scroll locked; focus moves to the first link |
| Mobile menu closes | **Pass** | Escape closes and returns focus to the button; choosing a link closes it and navigates; widening past 900 px closes it |
| Smooth scrolling works | **Pass** | `scroll-behavior: smooth` (off under reduced motion); anchors land below the floating bar (`scroll-padding-top`) |
| Back-to-top works | **Pass** | Appears after one screen of scrolling with a reading-progress ring; returns to the top |
| Images load correctly | **Pass** | Every image completes with a non-zero natural size after a full scroll (lazy loading respected); every `img` has `alt` |
| No broken local asset paths | **Pass** | No same-origin 4xx or failed request on the homepage, all case studies and the walkthrough |
| No uncaught browser errors | **Pass** | Asserted in every page test. One exception is tolerated: Chromium's own "Transition was aborted…" message when a test navigates twice within ~400 ms (see the visual QA report). |
| No major accessibility failures | **Pass** | axe-core (WCAG 2.0, 2.1 and 2.2 A/AA): 0 serious or critical violations on desktop and mobile; Lighthouse Accessibility 100 |

## Further checks

| Check | Result |
| --- | --- |
| Keyboard | Skip link is the first stop and becomes visible; every one of the next 14 stops shows a 2 px or wider focus outline |
| Reduced motion | Nothing is held back by reveals; the motion toggle is hidden; the lattice is a still frame (two screenshots 600 ms apart are identical) |
| Pause motion | Stops the typing and the lattice; remembered after reload |
| Walkthrough | Opens from a card, plays silently, closes with Escape; Papercut stays untouched (no `src`, paused) |
| 404 | Missing paths at any depth return status 404 with the branded page and a working link home |
| `/work/` | Redirects to the projects section |
| Legacy links | `#/trk-05` redirects to the Data Migration case study |
| Responsive, at all nine QA viewports | No horizontal overflow and no element past the edge (homepage and two case studies); name, tagline and primary action in the first screen; desktop links at 900 px and up, Menu button below; images keep their proportions; every button at least 24 px |

## Content guardrails (`qa/unit/content.test.js`)

These run on every `npm test`:

- **Résumé:** the supplied Drive URL, everywhere. No forced-download or embedded Drive viewer.
- **Verified facts:** designation, employer, CGPA, specialization, certifications.
- **Statuses:** only the confirmed two (Live in production, Completed).
- **No inventions:** no percentages, impact metrics, production dates or UAT wording in project content, and no skill percentages.
- **Technologies:** only Data Migration lists them; the other case studies say "Stack details not yet published".
- **Repositories and demos:** no public repository or live-demo claims for company projects.
- **Walkthroughs and audio:** walkthroughs are never called recordings; nothing autoplays; Papercut is not requested before Play.
- **Forms:** no contact form without a back end.
