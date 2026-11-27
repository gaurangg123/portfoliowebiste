# Visual QA report — DataForge (refinement round)

Rendered-page inspection of the production build, served the way GitHub Pages serves it (`/portfoliowebiste/` subpath, 404 fallback, gzip).

**Method**

- Pages were opened in headless Chromium 1243 through Playwright 1.63.
- Screenshots were captured and inspected by eye, section by section, in both themes.
- Spacing was measured, not estimated: a script finds the last visible content of each section and the first visible content of the next, and reports the empty space between them.
- Every issue below was found in a screenshot, a measurement or a test, then fixed and re-shot.

## Summary

| | |
| --- | --- |
| Refinement passes | **3**: spacing and layout; visuals and motion; mobile and polish |
| Viewports | **9**: 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, 375×812, 360×800 |
| Themes | Dark (default) and light, on the homepage and the case studies |
| Automated layout checks, final run | **9 / 9 viewports clean**: no horizontal overflow, nothing past the edge, no clipped controls, no broken images, no console errors |
| Open visual issues | **0** blocking |

## The spacing problem, measured

The space between one section's last content and the next section's first content, and the page height:

| Viewport | Gaps before | Gaps after | Page before | Page after | Contact → footer |
| --- | --- | --- | --- | --- | --- |
| 1440×900 | 245–314 px | 123–202 px | 13,265 px | 9,507 px | 163 → 111 px |
| 768×1024 | 145–168 px | 112–143 px | 15,480 px | 12,861 px | 513 → 95 px |
| 390×844 | 144–167 px | 87–108 px | 19,535 px | 14,799 px | 492 → 75 px |

**Where the space came from, and what replaced it**

- **Section padding** went up to 128 px on both edges, and heading margins up to 80 px. One spacing system in `tokens.css` replaces them:

  | | Section padding (top; bottom is 72% of it) | Heading → content | Grid gap |
  | --- | --- | --- | --- |
  | Desktop (≥1024) | 88–108 px (compact 64–80 px) | 28–36 px | 18–24 px |
  | Tablet (640–1023) | 72 px (compact 60 px) | 28 px | 18 px |
  | Mobile | 52 px (compact 44 px) | 24 px | 14 px |

- **Reveals** waited until 8% into the screen and travelled 24 px. They now start at 4%, travel 16 px and take about half as long.
- **The hero** on tablets and phones had a full-height band above the text. Its height now follows its content, with the lattice in a band above the text.
- **The contact section** carried a ~300 px decorative panel on phones, and the footer was large. Contact is now a conclusion with its channels beside it, and the footer is one compact row.
- **Projects on phones** were seven full cards stacked (about 5,100 px). They are now a swipeable row with a counter, a progress rail and previous/next buttons (about 1,600 px). Without JavaScript they still stack.

## Pass 1: spacing, layout and transitions

| # | Finding | Fix |
| --- | --- | --- |
| 1 | Gaps of 245–314 px between sections on desktop | Spacing tokens (above) |
| 2 | Disciplines: the four tabs floated apart to match the stage's height | Equal-height tabs that fill the column, 10 px apart |
| 3 | Education: the years ran together ("20212025") and squeezed the degree title into four lines | Years set as one large row above the record; certificates share the record's height |
| 4 | Project showcase cropped the bottom of the illustrations | The showcase letterboxes the illustration (`contain`) instead of cropping it |
| 5 | Mobile project row: shorter cards left a gap above the controls | Cards in the row share one height |
| 6 | The terminal section and its navigation item | Removed; replaced by the engineering workflow |

## Pass 2: visuals and motion

| # | Finding | Fix |
| --- | --- | --- |
| 7 | The site felt plain: sections were text and cards | Stage illustrations (16 inline SVG scenes), a blueprint grid behind the workflow, a framed architecture stream, a layered portrait with an ID card, a career track, an editorial education record, contact signal rings |
| 8 | The hero lattice was the same in both themes and did not respond | Colours read from theme tokens and redrawn on a theme change; nodes near the pointer brighten and reach towards it; firing cascades travel through neighbours |
| 9 | Light theme: amber text on the alternate band was 4.43:1 | Darker amber token (`#A14607`); contrast now unit-tested for both themes |
| 10 | Case-study header lost its meta line and category styles (old class names) | Moved to the explorer's classes; a class audit found no other unstyled content |
| 11 | 404 log colours came from the removed terminal stylesheet | Restored in the case-study stylesheet |
| 12 | Under load, a fast scroll could leave sections hidden until scrolled back to | A catch-up sweep shows anything already reached |

## Pass 3: mobile and polish

| # | Finding | Fix |
| --- | --- | --- |
| 13 | Menu breakpoint left a cramped bar between 900 and 1023 px | The bar shows from 1024 px; the menu sheet below |
| 14 | The wordmark added `#top` to the address | It scrolls to the top without a fragment and keeps Back working; an old `#top` is cleaned on load |
| 15 | Workflow and architecture on phones | Vertical timelines with one stage open, numbered nodes on a line |
| 16 | Hover preview in the explorer could override a keyboard choice after a scroll | Only a mouse that actually moves previews a project |

## Screenshots

- `qa/screenshots/desktop/`, `qa/screenshots/tablet/` and `qa/screenshots/mobile/` hold the curated set:
  - the hero at all nine sizes;
  - every section at 1440×900, 1024×768 and 390×844;
  - the case-study header at three sizes;
  - the mobile navigation, and the light theme.
- The automated checks from the final run are in `qa/screenshots/layout-checks.json`.
- Regenerate with `node qa/capture-screenshots.js qa/screenshots --jpg`, after starting `node tools/serve.js 4173`.

## Known limitations

- **Live site:** `gaurangg123.github.io` is not reachable from this environment, so the deployed site was not inspected visually here.
- **Interrupted view transitions:** Chromium logs "Transition was aborted…" if a second navigation starts while a page-to-page transition is still playing. It cannot be caught from page code and has no visible effect.
