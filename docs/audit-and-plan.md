# DataForge — initial audit and implementation plan

> **Later change:** in the refinement round, the simulated terminal described below was removed and replaced by the
> "Inside my engineering workflow" section, and a light theme was added. See `README.md` and `qa/reports/` for the
> current structure. This document is kept as the record of the first redesign.

Audit of `gaurangg123/portfoliowebiste` taken before the redesign, on branch
`claude/portfolio-redesign-842oy7` at `b0c316c` (same tree as `main` at `c8d0fa5`, PR #20).

## 1. Repository state

| Check | Result |
| --- | --- |
| Current branch | `claude/portfolio-redesign-842oy7`, up to date with its remote |
| Working tree | Clean: no uncommitted or untracked changes to protect |
| Remote | `origin` → `https://github.com/gaurangg123/portfoliowebiste` |
| Latest commits | `b0c316c` Education and Certifications share a screen · `cab8851` Page transitions… · `56db5aa` Merge PR #19 |
| `main` | `c8d0fa5` (merge of PR #20), identical tree to the branch |
| `package.json` | **None.** The project had no npm manifest, dependencies or scripts |
| Repository size | 4.1 MB of tracked files (3.0 MB is `papercut-instrumental.mp3`) |

## 2. Existing technology stack

- **Framework:** none. A zero-dependency Node script (`tools/build.js`, 910 lines) generates static HTML.
- **Output:** `index.html`, `work/<slug>/index.html` ×5, `work/index.html` (redirect), `404.html`, all committed at the repository root.
- **Styling:** one hand-written stylesheet, `portfolio.css` (1,156 lines), with light/dark tokens ("Warm studio" cream and crimson).
- **Behaviour:** vanilla JavaScript, no libraries:
  - `portfolio.js`: theme, nav, scroll spy, reveal, copy email, Papercut audio.
  - `assets/explain.js`: interactive case-study diagrams.
  - `assets/walkthroughs/*`: a lazy-loaded `<dialog>` walkthrough player with five illustrative, silent demos.
- **Fonts:** system font stacks only.
- **Images:** a portrait at 480, 800 and 1200 px in WebP plus a JPEG fallback, an OG image, a favicon and an apple-touch icon.
- **Hosting:** GitHub Pages, "Deploy from a branch" (`main`, root). The run name "pages build and deployment" is GitHub's built-in Jekyll build.
  - There is no `.nojekyll`, so every deploy runs through Jekyll.
  - There is no custom workflow in `.github/`.

## 3. Architecture

```
tools/build.js ──requires──▶ tools/explain.js     (case-study diagrams, HTML strings)
       │          └─────────▶ tools/sculpture.js   (hero record SVG)
       │          └─────────▶ assets/walkthroughs/demos.js (walkthrough titles, steps; shared with the player)
       ▼
index.html · work/*/index.html · 404.html   ──load──▶ portfolio.css, portfolio.js
                                             └─lazy─▶ assets/walkthroughs/{walkthrough.js,css,demos.js}
```

- **Routing:** real folders (`/work/<slug>/`), so direct links and refreshes already work on Pages.
- **404:** `404.html` uses absolute `/portfoliowebiste/` paths so it renders at any depth.
- **Legacy links:** old `#/trk-0N` hashes redirect to the matching case study.
- **Content:** held in the `P` object inside `build.js`, mixed with templates.

## 4. Content inventory: the sources of truth

All of it comes from the existing site, which was reconciled with the owner over earlier rounds.

**Identity**
- Gaurang Ashava, GET – Data and AI Engineer, Tata Technologies, Pune.
- Links:
  - GitHub: `github.com/gaurangg123`
  - LinkedIn: `linkedin.com/in/gaurang-ashava`
  - Email address
  - Résumé: Google Drive viewing URL, to be used unchanged.

**Experience**
- **Tata Technologies**, Oct 2025 – now.
- **Vertisystem**, Training Internship – Data Analytics, Dec 2023 – Jan 2024.
- **Swap Infotech**, Software Developer Intern / L1, Jun – Jul 2023.

**Education**
- B.Tech, Computer Science Engineering, SRM Institute of Science & Technology, 2021 – 2025.
- Big Data Analytics specialization, CGPA 8.68 / 10.

**Certifications**
- Snowflake foundational badges.
- Snowflake Ascent.

**Projects**

| Project | Contribution | Status | Technologies |
| --- | --- | --- | --- |
| Knowledge Portal | Owned build | — | — |
| Business Sheet | Built end to end | — | — |
| Contract Intelligence | Developed | — | — |
| Resume Matching | Original POC | Live in production | — |
| Data Migration | Contributor | Completed | SQL Server, Snowflake, ADF |

Only Data Migration has a confirmed technology list.

**Experiments**
- Bug Detailer and Web App Builder (AI agents), with illustrative sample input and output.

**Owner constraints still in force from earlier rounds**
- Do not invent:
  - metrics
  - adoption figures
  - accuracy figures
  - unconfirmed architecture
  - production dates
  - ownership of team work
  - approval order or leaderboard scoring rules
- Use the résumé URL unchanged.
- No contact form without a working back end.
- Walkthroughs are never autoplayed, and are never labelled as real recordings.

## 5. Reuse vs redesign

**Reusable as is, restyled through tokens**
- Walkthrough player, its five demos and its scoped CSS. It reads theme tokens, so a dark palette is a token mapping.
- Interactive case-study diagrams: `explain.js` markup and `assets/explain.js` behaviour.
- Case-study illustrations.
- Copy-email behaviour.
- Papercut player logic.
- Legacy-hash redirect.
- 404 approach.
- Folder routing.
- Portrait image set.
- View-transition wiring.

**Needs redesign**
- Every visual surface: palette, type, layout and hero.
- Navigation.
- Project presentation: filters, mission cards, the detail-page structure required by the brief.
- Experience (timeline).
- Education and certifications.

**Missing functionality** (new)
- Engineering-domains section.
- Interactive data-architecture diagram.
- Working terminal.
- Project filters.
- Dynamic hero titles.
- Back-to-top control.
- Sitemap and `robots.txt`.
- Custom asset library and asset ZIP.
- `package.json` with lint, typecheck, unit-test, e2e and build scripts.
- README.

**Retired**
- Light theme and theme toggle: the brief specifies one dark palette.
- Record-sculpture hero.
- Viewport-height panels and the resize "keep your place" code they needed.

## 6. Integrations, SEO and responsiveness found

- **Integrations:** none server-side. The links are mailto, GitHub, LinkedIn and Google Drive, with no analytics and no form back end.
- **SEO:**
  - Present: title, description, canonical, Open Graph and Twitter cards on every page, Person JSON-LD on the homepage, `noindex` on the 404 and the redirect.
  - Missing: sitemap and `robots.txt`.
- **Responsive:** breakpoints at 640, 880, 900 and 1024 px plus short-screen rules. The earlier QA covered seven viewport sizes.

## 7. Risks

1. **Stack mismatch with the brief.** The brief prefers React/Vite/Tailwind/Framer Motion, but also says to keep the existing stack wherever practical. A React SPA would:
   - need a new Pages build pipeline (Actions-based Pages changes repository settings), or committed build output;
   - add client-side rendering cost and SPA routing workarounds on Pages;
   - require porting the walkthrough player and diagrams.
2. **Fabrication risk.** The brief asks every project for an architecture diagram, technologies, results, a repository and a live demo. Most of these are not public or not confirmed.
3. **Motion versus performance.** A continuously animated 3D hero can hurt battery life, low-end phones and Lighthouse's Total Blocking Time.
4. **Jekyll.** Branch deploys run Jekyll. New Markdown files (README, QA reports) would be rendered, and `{{ }}` inside them could break the build.
5. **Live verification.** The container cannot reach `gaurangg123.github.io`, `drive.google.com`, LinkedIn or the design reference; DNS and proxy refuse them.
6. **Colour contrast.** The brief's violet `#8B5CF6` on `#05070D` is about 4.3:1, below AA for body-size text.

## 8. Decisions

| Decision | Why |
| --- | --- |
| **Keep the static generator**: no React, Vite or Tailwind runtime | The brief's "maintain the existing stack wherever practical" applies. Static HTML gives the best Lighthouse and SEO results, works without JavaScript, needs no Pages settings change, and keeps every existing feature. |
| **Content separated from presentation** in `src/data/*.js` | Projects, experience, domains, the architecture stages and terminal output are edited in one place each. |
| **Templates as small components** in `src/components/*.js` | Mirrors the brief's `src/components/<section>` layout without a framework. |
| **Styles split by section** in `src/styles/*.css` | Concatenated and comment-stripped at build into `assets/css/dataforge.css`. |
| **Browser code split by feature** in `src/scripts/*.js` | Concatenated at build into `assets/js/dataforge.js`. Type-checked with `tsc --noEmit` (`checkJs`) and linted with ESLint. |
| **Hero 3D: custom canvas renderer** instead of Three.js | A projected 3D lattice with pulses needs about 6 KB of code, versus about 150 KB gzipped for Three.js. It pauses off-screen or in a background tab, uses fewer nodes on low-power devices, shows one still frame under reduced motion, and has a visible pause control. |
| **Motion:** CSS transitions plus IntersectionObserver | Framer Motion needs React. Reduced motion is honoured everywhere. |
| **Fonts:** Space Grotesk, Inter, JetBrains Mono, self-hosted as WOFF2 (OFL) | No third-party request; preloaded. |
| **Dark-only theme** using the brief's palette | Violet text uses a lighter tint, `#A78BFA` (about 7:1); `#8B5CF6` is kept for non-text marks. |
| **No contact form** | No working submission integration exists. Email, a copy button, LinkedIn, GitHub and the résumé instead. |
| **Repository and live demo per project:** labelled "Not public" | They are company projects with no public links. The illustrative walkthrough is offered instead, labelled as illustrative. |
| **"Architecture" per project:** documented functional flows only | Labelled as such. The homepage architecture section is a generic reference model of the domains, explicitly not a specific system's design. |
| **Missing technologies and results:** clearly marked placeholders | No inferred stack, no metrics. |
| **`.nojekyll` added** | Pages publishes the files as they are: faster deploys, and no Markdown or Liquid surprises. Pages settings are unchanged. |
| **Images:** original SVG artwork, rendered to WebP and JPEG where raster is needed | No hotlinks and no stock photos (no reachable licensed source). No fake screenshots: project visuals stay labelled as illustrations. |

## 9. Target structure

```
src/
  data/        site.js · projects.js · experience.js · education.js · domains.js · architecture.js · terminal.js
  components/  head.js · icons.js · navigation.js · hero.js · about.js · expertise.js · projects.js · experience.js
               education.js · architecture.js · terminal.js · contact.js · footer.js · case-study.js · not-found.js
               illustrations.js · explain.js (moved from tools/)
  styles/      tokens.css · base.css · one file per section (navigation.css, hero.css, …) · case-visuals.css · motion.css
  scripts/     core.js · nav.js · hero-lattice.js · titles.js · reveal.js · projects-filter.js · architecture.js
               terminal-core.js · terminal.js · walkthrough-loader.js · copy.js · papercut.js · clock.js
assets/
  css/ js/ fonts/ hero/ data-engineering/ ai-ml/ automation/ analytics/ projects/ profile/ icons/ backgrounds/ diagrams/ walkthroughs/
tools/         build.js · serve.js · render-assets.js · package-assets.js
qa/            playwright/*.spec.ts · unit/*.test.js · reports/*.md · screenshots/{desktop,tablet,mobile}/
```

## 10. Implementation and QA plan

1. Restructure into `src/` and keep the output byte-compatible in routing (same URLs).
2. Build the design system (tokens, fonts, base, nav), then the hero, then the remaining eight sections.
3. Redesign the case-study pages and the 404; restyle the walkthroughs and diagrams through tokens.
4. Create the asset library, WebP renders, OG image, favicon and `dataforge-assets.zip`.
5. Tooling:
   - ESLint 9 flat config
   - `tsc --noEmit` with `checkJs`
   - `node --test` unit tests for the terminal
   - Playwright functional and responsive specs
   - html-validate
6. Visual QA in three passes over the nine viewports from the brief, with screenshots and fixes recorded in `qa/reports/visual-qa-report.md`.
7. Lighthouse on the built site served under the `/portfoliowebiste/` subpath.
8. Commit, push the branch, open a PR, merge, check the Pages run, and verify the live site.
