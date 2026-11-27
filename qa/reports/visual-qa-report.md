# Visual QA report — DataForge

Rendered-page inspection of the production build, served the way GitHub Pages serves it (`/portfoliowebiste/` subpath, 404 fallback, gzip).

**Method**

- Pages were opened in headless Chromium through Playwright (Chromium build 1243).
- Screenshots were captured and then inspected visually, by eye.
- Every issue below was found in a screenshot, a layout check, or a test, and was fixed and re-shot before the next pass.

## Summary

| | |
| --- | --- |
| Visual review passes | **3** (plus a pre-pass on the artwork) |
| Viewports | **9**: 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, 375×812, 360×800 |
| Sections inspected | **15**: 9 homepage sections, 5 case studies, 404 |
| Defects found | **25** (listed below): 24 fixed and re-verified, 1 documented as a Chromium limitation (#18) |
| Automated layout checks, final run | **9 / 9 viewports clean**: no horizontal overflow, nothing past the edge, no clipped controls, no broken images |
| Open visual issues | **0** blocking. See "Known limitations" |

**Final screenshots**

- `qa/screenshots/desktop/`, `qa/screenshots/tablet/` and `qa/screenshots/mobile/` hold the curated set:
  - the hero at all nine sizes;
  - every section at 1440×900 and 390×844;
  - the case-study header at three sizes.
- The automated checks from the final run are in `qa/screenshots/layout-checks.json`.
- Regenerate everything with `node qa/capture-screenshots.js qa/screenshots --jpg`, after starting `node tools/serve.js 4173`.

## Pre-pass: artwork

The seven project covers and the social card were rendered and inspected as a contact sheet.

| # | Defect | Fix |
| --- | --- | --- |
| 1 | Bug Detailer cover: two "Steps" lines drawn on top of each other | Rows are laid out from a running offset |
| 2 | Web App Builder cover: code lost its indentation, and the mono font's ligature turned `=>` into `⇒` | `white-space: pre` and `font-variant-ligatures: none` on code text |
| 3 | A bottom fade hid footnotes and the Knowledge Portal role chips | Fade starts later and is lighter |
| 4 | Social card: the lattice was pushed off the right edge | Canvas moved left |

## Pass 1: layout, visual identity, spacing, typography

Full pages were captured at 1440 and 390, with sections at every viewport.

| # | Viewport | Defect | Fix |
| --- | --- | --- | --- |
| 5 | all | Contact "connection log" card had large blank gaps (the HTML's own line breaks rendered because of `white-space: pre`) | `pre` moved from the card to each line |
| 6 | all | The card's "Illustration" tag sat on top of the label baked into each cover | Labels removed from the cover art; the page's tag is the one label |
| 7 | all | About 320 px between sections, which read as empty | Section padding reduced to `clamp(72px, 8.5vw, 128px)` |
| 8 | ≤ 899 | Menu button not right-aligned in the bar | `margin-left: auto` on the bar's end group on small screens |
| 9 | 375, 360 | Hero buttons pushed a container 3–17 px past the screen edge | Buttons wrap in a flex row; primary full width |
| 10 | ≤ 479 | Hero kicker wrapped to two lines | "· DataForge" suffix hidden on phones |
| 11 | ≤ 479 | Section labels wrapped ("ENGINEERING / MISSIONS") | Label text no longer wraps; the hairline shrinks instead |
| 12 | all | Touch targets: arrow links 23 px tall; architecture use-case links below 24 px | 44 px minimum height; padded list links |
| 13 | ≥ 900 | The lattice's floor grid sat below the frame and was invisible | Floor raised and brightened |

## Pass 2: interactions, animation, images, responsive behaviour

The captured states were:

- the hero mid-animation;
- a domain card hovered;
- the projects filter set to AI / ML;
- an architecture stage selected;
- the terminal after commands;
- the walkthrough dialog playing;
- the mobile menu open;
- full case studies at desktop and mobile;
- the 404 page.

| # | Viewport | Defect | Fix |
| --- | --- | --- | --- |
| 14 | all | Architecture "Connects": the label and the stage name laid out as separate flex columns ("Receives / from") | Text grouped in one inline span |
| 15 | all | Analytics motif: the "FY vs FY" chip sat on the chart's y-axis | Chip moved right |
| 16 | ≤ 899 | Hero content showed faintly through the open menu sheet | Sheet background made opaque |
| 17 | ≤ 479 | Terminal `projects` output wrapped mid-line at phone width | Two-line format: code + title (+ status), then category · contribution |
| 18 | mobile | Chromium logged "Transition was aborted…" when a second navigation interrupted a page transition | Investigated; see "Known limitations" |

**Also verified in pass 2**

- The walkthrough player inherits the new palette: cyan controls and the violet active step, still labelled "Illustrative walkthrough · sample data".
- Explanations on the case studies (capability map, Business Sheet sample, annotated contract, requirement matrix, migration flow) read correctly on the dark theme.
- The case-study table stacks into cards on phones.
- Animation cost: 60 fps in the hero, and no long tasks, even at 4× CPU throttling. See the performance report.

## Pass 3: final polish, consistency, mobile quality

| # | Viewport | Defect | Fix |
| --- | --- | --- | --- |
| 19 | 1024×768 | The lattice crossed the intro paragraph and the tagline | Between 900 and 1199 px the lattice sits further right and is slightly smaller |
| 20 | ≤ 899 | About 160 px of empty space between the hero and About on phones | Hero bottom padding reduced on small screens |
| 21 | ≤ 479 | Mission facts: the label column squeezed values into three short lines | Label above value on phones |
| 22 | — | QA tool defect: section screenshots were clipped at viewport coordinates, not page coordinates | Fixed in `qa/capture-screenshots.js`, and all shots retaken |

**Found by the automated checks, fixed during the passes**

| # | Defect | Fix |
| --- | --- | --- |
| 23 | Unescaped `&` in names from the data files (invalid HTML) | Escaped at the template boundary |
| 24 | `aria-label` on a plain `<span>` (the hero clock) | Visually hidden text instead |
| 25 | Terminal `<form>` had no submit control (WCAG H32) | Visually hidden submit button |

Artifacts that are **not** defects:

- Full-page captures show fixed or sticky elements mid-page: the nav, the skip link, the case-study table of contents.
- I checked the skip link separately: it sits at y = −71 px until focused.

## Known limitations

- **Page-transition console message.** Chromium itself logs `InvalidStateError: Transition was aborted because of invalid state` when a visitor starts a second navigation while a page-to-page transition is still playing (within about 400 ms). Navigation completes normally.
  - The error is raised before page code can attach a handler.
  - Skipping the outgoing transition makes Chromium log the same message, which I tested.
  - The end-to-end tests tolerate exactly this message and fail on any other error.
- **Design reference not reached.** `aliazamkazmi.vercel.app` could not be reached from this environment (DNS failure, including through the fetch tool). The design follows the brief's description instead; nothing was copied.
- **Engines tested.** Visual QA ran in Chromium only. Firefox and WebKit builds are not installed here, and the brief forbids installing other Playwright browsers.
  - The site avoids engine-specific features, except cross-document view transitions, which other engines skip.
  - It relies only on widely supported CSS: `color-mix`, `clip-path`, container queries in the case-study visuals.
