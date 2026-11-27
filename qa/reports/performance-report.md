# Performance report — DataForge 2.0

## Lighthouse (measured)

**Setup**

- Lighthouse 12.8.2 in Chromium 1243 (Playwright's build), headless.
- Production build served locally under `/portfoliowebiste/`, gzipped like GitHub Pages.
- Mobile uses Lighthouse's default simulated throttling: slow 4G and 4× CPU. Desktop uses the desktop preset.

| Page | Form factor | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | Mobile | **96** | **100** | **100** | **100** | 1.2 s | 2.0 s | 200 ms | 0 |
| Homepage | Desktop | **100** | **100** | **100** | **100** | 0.3 s | 0.5 s | 0 ms | 0 |
| Query the Engineer | Mobile | **99** | **100** | **100** | **100** | 1.2 s | 1.8 s | 10 ms | 0 |
| Query the Engineer | Desktop | **100** | **100** | **100** | **100** | 0.3 s | 0.4 s | 0 ms | 0 |
| Knowledge Portal case study | Mobile | **99** | **100** | **100** | **100** | 1.2 s | 2.0 s | 50 ms | 0 |
| Knowledge Portal case study | Desktop | **100** | **100** | **100** | **100** | 0.3 s | 0.4 s | 0 ms | 0 |

The Query page's first run scored 89 (mobile) and 95 (desktop) for accessibility, and 91 for SEO. That run found three issues:

- `role="log"` was placed on a list;
- the send button had no name on phones;
- some answer links said only "See more".

All three are fixed, and the page now has its own axe tests in both themes.

All six results meet the brief's targets: Performance 90+, Accessibility 95+, Best Practices 95+ and SEO 95+.

**The live site needs a separate run.**

- These scores come from a local server.
- GitHub Pages adds its own caching headers and CDN latency, so live numbers will differ somewhat.
- The live site could not be reached from this environment to measure it.

**Remaining Lighthouse suggestions (homepage, mobile):**

| Suggestion | Estimate | Why it remains |
| --- | --- | --- |
| Render-blocking CSS | about 400 ms | One 27 KB gzipped stylesheet. Kept render-blocking so there is no flash of unstyled content (or of the wrong theme). |
| Unused CSS | about 12 KB | One shared bundle serves the homepage and the case studies |
| Unminified CSS and JS | about 3 KB and 7 KB | The build strips CSS comments but does not minify, to stay dependency-free |
| Responsive-image and image-delivery savings | about 70–90 KB | The portrait (WebP at 480, 800 and 1200 px) and the lead cover; AVIF would save more |
| DOM size | 2,095 elements | Nine sections, inline SVG illustrations for 16 stages, and every stage's content in the page so it reads without JavaScript |

## Page weight

| | Transfer (gzip) |
| --- | --- |
| HTML (homepage) | 22 KB gzip |
| CSS bundle (shared) | 27 KB gzip |
| JS bundle (shared) | 17 KB gzip |
| Query page bundle (engine, conversation, background) | 10 KB gzip, loaded only on `/query-engineer/` |
| Query page knowledge base | Inline JSON in the page, built from `src/data/` |

**Deferred loads**

- **Covers** (WebP, 10–15 KB at 800 px): lazy.
- **Walkthrough player** (CSS, JS and demo data): only on the first "Watch walkthrough" click.
- **Papercut audio** (3 MB): only on the first Play.

## Animation cost (measured)

Measured over 3 s of the hero animating, with the pointer moving across the lattice (so cascades and pointer threads are active). A `requestAnimationFrame` counter and a `longtask` observer ran in Chromium:

| Run | Frame rate | Worst frame | Long tasks |
| --- | --- | --- | --- |
| Desktop 1440×900, no throttling | 60 fps | 17 ms | 0 |
| Desktop 1440×900, 4× CPU throttling | 57 fps | 50 ms | 0 |
| Phone 390×844, 4× CPU throttling | 60 fps | 17 ms | 0 |

**How the hero stays cheap**

| Technique | Detail |
| --- | --- |
| 2D canvas, no 3D library | Custom renderer of about 6 KB, versus about 150 KB gzipped for Three.js |
| Fewer draw calls | Edges drawn in 4 depth bands, one stroke each; only edges carrying a cascade get their own stroke |
| Cheap interaction | Pointer proximity is computed during the projection pass that already runs; at most four pointer threads |
| Pre-rendered glow | Glow sprites drawn once |
| Less work on smaller devices | 70 instead of 128 nodes, 10 instead of 22 pulses, and 30 fps on low-power devices (≤ 4 cores, ≤ 4 GB memory, or Save-Data) and small screens |
| Device-pixel ratio capped | 2, or 1.25 on low-power devices |
| Runs only when seen | Stops when the hero leaves the screen or the tab is hidden |
| Still frame when motion is off | One still frame under reduced motion or "Pause motion" |

The other moving parts are limited the same way:

- Discipline motifs animate only while their discipline is open and on screen, or on hover.
- The workflow and architecture tracks draw once when first seen; their pulse and stream loops are gated by reduced motion and Pause motion.
- Contact rings run only while the section is visible.
- The Query page's network runs at 30 fps, pauses in background tabs, and is a still frame under reduced motion.
- The ribbon of tools pauses on hover and is still under reduced motion.
- The theme toggle redraws the lattice once with the new colours when it is not animating.
- Reveals use opacity and transform only, and their classes are removed once settled.
