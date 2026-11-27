# Performance report — DataForge

## Lighthouse (measured)

**Setup**

- Lighthouse 12.8.2 in Chrome for Testing 153, headless.
- Production build served locally under `/portfoliowebiste/`, gzipped like GitHub Pages.
- Mobile uses Lighthouse's default simulated throttling: slow 4G and 4× CPU. Desktop uses the desktop preset.

| Page | Form factor | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | Mobile | **96** | **100** | **100** | **100** | 1.2 s | 2.0 s | 190 ms | 0 |
| Homepage | Desktop | **100** | **100** | **100** | **100** | 0.4 s | 0.4 s | 0 ms | 0 |
| Knowledge Portal case study | Mobile | **99** | **100** | **100** | **100** | 1.2 s | 1.8 s | 20 ms | 0 |
| Knowledge Portal case study | Desktop | **100** | **100** | **100** | **100** | 0.3 s | 0.4 s | 0 ms | 0 |

All four results meet the brief's targets: Performance 90+, Accessibility 95+, Best Practices 95+ and SEO 95+.

**The live site needs a separate run.**

- These scores come from a local server.
- GitHub Pages adds its own caching headers and CDN latency, so live numbers will differ somewhat.
- The live site could not be reached from this environment to measure it.

**Remaining Lighthouse suggestions (homepage, mobile):**

| Suggestion | Estimate | Why it remains |
| --- | --- | --- |
| Render-blocking CSS | about 410 ms | One 21 KB gzipped stylesheet. Kept render-blocking so there is no flash of unstyled content. |
| Unused CSS | about 12 KB | One shared bundle serves the homepage and the case studies |
| Unminified CSS and JS | about 3 KB and 7 KB | The build strips CSS comments but does not minify, to stay dependency-free |
| Responsive-image and image-delivery savings | about 70–90 KB | The portrait (WebP at 480, 800 and 1200 px) and the lead cover; AVIF would save more |
| DOM size | 1,574 elements | Nine sections, inline SVG motifs, and the pre-rendered terminal output for visitors without JavaScript |

## Page weight

| | Transfer (gzip) |
| --- | --- |
| HTML (homepage) | 19 KB (101 KB raw) |
| CSS bundle | 21 KB (111 KB raw) |
| JS bundle | 18 KB (59 KB raw) |
| Fonts (3 variable WOFF2, latin) | 100 KB; Space Grotesk and Inter preloaded |
| Homepage total, Lighthouse mobile | 280 KB, 8 requests |
| Case study total, Lighthouse mobile | 158 KB, 8 requests |

**Deferred loads**

- **Covers** (WebP, 10–15 KB at 800 px): lazy.
- **Walkthrough player** (CSS, JS and demo data): only on the first "Watch walkthrough" click.
- **Papercut audio** (3 MB): only on the first Play.

## Animation cost (measured)

Measured over 3 s of the hero animating, with a `requestAnimationFrame` counter and a `longtask` observer in Chromium:

| Run | Frame rate | Worst frame | Long tasks |
| --- | --- | --- | --- |
| Desktop 1440×900, no throttling | 60 fps | 17 ms | 0 |
| Desktop 1440×900, 4× CPU throttling | 59 fps | 33 ms | 0 |
| Phone 390×844, 4× CPU throttling | 60 fps | 17 ms | 0 |

**How the hero stays cheap**

| Technique | Detail |
| --- | --- |
| 2D canvas, no 3D library | Custom renderer of about 6 KB, versus about 150 KB gzipped for Three.js |
| Fewer draw calls | Edges drawn in 4 depth bands, one stroke each |
| Pre-rendered glow | Glow sprites drawn once |
| Less work on smaller devices | 70 instead of 128 nodes, 10 instead of 22 pulses, and 30 fps on low-power devices (≤ 4 cores, ≤ 4 GB memory, or Save-Data) and small screens |
| Device-pixel ratio capped | 2, or 1.25 on low-power devices |
| Runs only when seen | Stops when the hero leaves the screen or the tab is hidden |
| Still frame when motion is off | One still frame under reduced motion or "Pause motion" |

The other moving parts are limited the same way:

- Domain motifs animate only on hover, on focus, or once on first view.
- Architecture packets and contact rings run only while their section is visible.
- Reveals use opacity and transform only, and their classes are removed once settled.
