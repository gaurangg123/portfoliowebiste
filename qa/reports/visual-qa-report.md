# Visual QA report — DataForge 2.0

Rendered-page inspection of the production build, served the way GitHub Pages serves it.

**Method**

- Pages were opened in headless Chromium 1243 through Playwright 1.63.
- Screenshots were captured and inspected by eye, in both themes, at desktop, tablet and phone sizes.
- Every issue below was found in a screenshot, a measurement, a test or Lighthouse, then fixed and re-shot.

## What changed, visually

| Area | Before | Now |
| --- | --- | --- |
| Navigation | A horizontal bar across the top | A translucent rail fixed to the right edge, with a monogram, icon links with sliding names, a gliding ink on the current section, a reading-progress line, then Query the Engineer, the theme and the résumé. Phones get a floating button and a full-screen menu that opens as a circle from the button. |
| Opening | Name and tagline over the lattice | An editorial composition: a studio masthead line; the name in two staggered lines; *Engineering Intelligence.* and *Data & AI Engineer.* |
| Between sections | Stacked rectangles | Slanted bands with a blueprint grid; giant outlined chapter numbers behind each heading; a tilted ribbon of tools under the opening |
| About | Photo and text side by side | The portrait set off-grid with a plate and an ID card; *Now* and *Studied* facts; one panel with the path so far beside how I approach the work |
| Expertise | A tab list beside one stage | Four numbered plates in an even grid, each with its own animated illustration |
| Projects | An index beside one showcase | Three labelled groups: the featured project (illustration beside its headline and buttons, the four facts beneath), an even 2×2 grid of the other company projects, and the lab. Large outlined project numbers. On phones the grids become swipeable rows. |
| Experience | Track bars and cards | A compact timeline: big year marks on the left, a line with a node per role, the current role lit |
| Query the Engineer | A terminal section on the homepage | Its own page on one screen (a brief in large stacked type, the conversation beside it, a quiet data network behind; only the conversation scrolls), plus an invitation section on the homepage |

## Pass 1: composition, navigation and spacing

| # | Finding | Fix |
| --- | --- | --- |
| 1 | Content would run under a right-hand rail | `.container` keeps clear of `--rail-space`; a test checks every container against the rail |
| 2 | Query page: the brief column overflowed by 115px on phones (the topic row set its minimum width) | Columns sized `minmax(0, 1fr)` |
| 3 | The tilted ribbon caused 8–29px of horizontal scroll | The ribbon sits in a clipping wrapper |
| 4 | The portrait's running label sat inside the photo | Moved outside the frame |
| 5 | The lead project's illustration was letterboxed in a tall box, leaving empty bands | The illustration keeps its own proportions |
| 6 | Phones: Projects measured 6,304px and About 3,187px | The lead project stays whole and the rest scroll sideways (3,345px); the five approach steps scroll sideways (2,479px) |
| 7 | Case studies and the 404 page kept ~150px of space for the old top bar | Padding matches the new navigation |

## Pass 2: visual identity, animations and transitions

| # | Finding | Fix |
| --- | --- | --- |
| 8 | Light theme: rail, Query page, gallery and architecture | Checked; all on theme tokens. The Query page's network reads the theme colours |
| 9 | Page transitions and print rules still named the old top bar | Moved to the rail and the menu button |
| 10 | Motion | The lattice (pointer and cascades), plate illustrations, the ribbon, the Query network and the contact rings run only while visible, and stop under reduced motion or Pause motion |

## Pass 3: mobile, interaction and polish

| # | Finding | Fix |
| --- | --- | --- |
| 11 | 1024×768: the opening's index collided with the "Currently" line | The index stands at the lattice's foot only at 1280px and wider; below that it flows under the buttons |
| 12 | 1366×768: the scroll cue sat on the "Currently" line | Shown only where there is room |
| 13 | Phones: on the Query page the back-to-top button covered the send button | Hidden there, since the question box owns the bottom of the screen |
| 14 | Phones: the floating menu button covered a question scrolled into view | Questions scroll to clear it |
| 15 | Lighthouse (Query page): `role="log"` on a list, a send button without a name on phones, "See more" links | A `div` log; the button is labelled "Ask"; links say "Case study", "On the homepage", "Write" or "Open", with the item's name for screen readers |
| 16 | A question typed while an answer was still arriving was dropped | Queued |

## Owner review: changes after the first deployment

| # | Feedback | Change |
| --- | --- | --- |
| 17 | The running text on the left of the opening didn't look good | Removed |
| 18 | The index under the opening (enterprise applications · experiments · disciplines) didn't look good | Removed |
| 19 | "Read my resume" appeared twice; the audio channel wasn't wanted | Both removed from About (the résumé stays in the opening, the rail, the menu and Contact); the audio player, its script and file are gone |
| 20 | The path so far and how I approach the work didn't look good | One panel with two matching columns: a dated timeline, and five numbered stages |
| 21 | "In practice" opened a case study; Back then led somewhere else | The approach no longer links away. A case study's "Back to projects" now returns to the exact place on the homepage you left; opened directly, it goes to Projects. |
| 22 | Light theme: the drawings were hard to see | Firmer lines and white panels for the discipline and architecture drawings in the light theme |
| 23 | Projects felt hodgepodge: the lead project appeared without context; uneven gaps and offsets | Three labelled groups. The featured project is balanced. The other cards share one size, rows align and buttons line up. Disciplines are an even grid too. |
| 24 | Query the Engineer should be one page, with no page scrolling and no "Try asking" list | The page fits the screen on desktop and phones; only the conversation scrolls; the list is removed |
| 25 | Revalidate the whole site | Full-page review in both themes on desktop and phone. The thin line down the left margin and the label beside the portrait were also removed, for a cleaner edge. |

## Automated layout checks (final run)

**9 / 9 viewports clean.** The checks found no horizontal overflow, nothing past the edge (the intentional sideways rows excepted), no clipped controls, no broken images, no targets under 24px and no console errors. Details are in `qa/screenshots/layout-checks.json`.

## Screenshots

- `qa/screenshots/requested/`: the 17 views asked for. They cover:
  - desktop hero, right-side navigation, About, Expertise, Projects, Experience, Education, Architecture, Query promo, Contact and the Query page;
  - mobile homepage, mobile navigation, mobile Query page and mobile projects;
  - the light theme.
- `qa/screenshots/desktop/`, `tablet/`, `mobile/`: the hero at all nine sizes, every section at 1440×900, 1024×768 and 390×844, and the case-study head.
- Regenerate them with `node qa/capture-screenshots.js qa/screenshots --jpg`, after starting `node tools/serve.js 4173`.

## Known limitations

- **Live site:** the deployed site was not inspected visually here, because the host is unreachable from this environment.
- **Phone page length:** the homepage is about 17,900px tall on a phone. Every chapter is shown in full except where noted, and there are no empty bands.
