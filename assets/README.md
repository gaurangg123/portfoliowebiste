# DataForge visual assets

Original artwork made for **DataForge — Engineering Intelligence**, the portfolio of Gaurang Ashava.

- Every image here is drawn in code: SVG, or the hero's canvas renderer.
- Rasters are rendered locally by `tools/render-assets.js` in headless Chromium, using the site's own fonts.
- Nothing is stock photography, nothing is hotlinked, and nothing is AI-generated.
- The project images are **illustrations with sample content, not screenshots** of the real applications. The site labels them as such.

The website uses the extracted files in these folders. `deliverables/dataforge-assets.zip` is a convenience package of the same files, and the site never reads it.

## Folders

| Folder | Files | Used for |
| --- | --- | --- |
| `hero/` | `lattice-poster.webp` (1600×1000), `lattice-square.webp` (1200×1200) | Still frames of the hero's 3D data lattice (same seed and code as the live canvas). The poster is the no-JavaScript fallback behind the hero. |
| `data-engineering/` | `pipeline.svg`, `pipeline.webp` | Domain motif: sources → pipes → transform → data-centre rack. |
| `ai-ml/` | `neural.svg`, `neural.webp` | Domain motif: a layered network emitting tokens. |
| `automation/` | `workflow.svg`, `workflow.webp` | Domain motif: trigger → agent → decision → act / notify. |
| `analytics/` | `chart.svg`, `chart.webp` | Domain motif: FY bars, a trend line and a comparison marker (shape only, no values). |
| `projects/` | `<slug>.svg`, `<slug>-1600.webp`, `<slug>-800.webp` ×7 | Mission covers for Knowledge Portal, Business Sheet, Contract Intelligence, Resume Matching, Data Migration, Bug Detailer and Web App Builder. |
| `diagrams/` | `reference-architecture.svg`, `.webp` | The seven-stage reference architecture (sources → BI). |
| `backgrounds/` | `grid.svg`, `glow.svg` | The engineering grid tile and the page's lighting. |
| `icons/` | `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `logomark.svg` | The DataForge mark: a forged hexagon with a small network inside. |
| `og.jpg` | 1200×630 | Social preview card (Open Graph and X/Twitter). |

Other folders are not part of the artwork package:

| Folder | Contents |
| --- | --- |
| `profile/` | Portrait photograph |
| `fonts/` | Space Grotesk, Inter, JetBrains Mono (SIL OFL 1.1) |
| `walkthroughs/` | The illustrative walkthrough player |
| `css/`, `js/` | Generated bundles |

## On the page

- **Domain motifs** are inlined as SVG so they can animate. They play on hover, on focus, or once when they scroll into view, and never under reduced motion.
- The files here are static exports of the same drawings, with their colours inlined.
- **Covers** load lazily through `srcset`: 800 px for cards, 1600 px for case-study headers.

## Regenerating

```bash
npm install          # Playwright is a dev dependency
npm run build        # the hero stills render from the built script bundle
npm run assets       # tools/render-assets.js, then tools/package-assets.js
```

ImageMagick's `convert` encodes the WebP files.

- **Covers:** edit `tools/art/covers.js`.
- **Diagrams and backgrounds:** edit `tools/art/diagrams.js`.
- **Motifs:** edit `src/components/motifs.js`.
- **Logomark:** edit `src/components/icons.js`.

## Licences

| Item | Licence |
| --- | --- |
| Artwork in this folder | © Gaurang Ashava, made for this portfolio |
| Icon strokes | Drawn in the style of [Lucide](https://lucide.dev) (ISC licence) |
| Fonts | SIL Open Font License 1.1: [Space Grotesk](https://github.com/floriankarsten/space-grotesk), [Inter](https://github.com/rsms/inter), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) |
