# Portfolio product visuals

All 18 projects have studio covers and animated product showcases in their
detail dialogs. Only Nudge, Nivra, Recurr, and NotchMeter appear in the four
featured scrolling chapters. Project facts, gallery images, art paths, and
case-study copy live in `src/components/portfolio/projects.data.ts`.

## Assets and provenance

The original three folders contain an optimized `studio.jpg` background and
`cover.jpg` render of the complete composition. The other 15 folders contain
`studio-v1.jpg` and `cover-v1.jpg`. Backgrounds were generated with the built-in
`image_gen` tool. The original three prompts are in
[project-art-prompts.json](project-art-prompts.json); the other 15 exact prompts
and composition recipes are in
[project-showcase-manifest.json](project-showcase-manifest.json). The art contains
no devices or interfaces. Product interfaces are separate, source-derived layers.

- `src/assets/projects/nudge/`: amber optical glass, the original app icon, and
  `island.jpg`, `lock.jpg`, `reminders.jpg`. These are screenshots of the `.screen`
  elements in `~/Projects/Nudge/Marketing/appstore-set.html?shot=1`, `3`, and `5`.
  The island detail is a DOM rendering of the existing SwiftUI/marketing layout.
- `src/assets/projects/nivra/`: violet optical glass, the original app icon, and
  `screen.jpg`, `panel.jpg`, `engine.jpg`. Captured from `#screen`, `#nvPanel`, and
  `.engine-card` in `~/Projects/Nivra/Nivra-Web/`. The browser film was stopped
  while its expanded queue was visible using `window.__nivra.stop()`.
- `src/assets/projects/recurr/`: graphite/mint replay loop and `timeline.jpg`,
  `flow.jpg`, `diff.jpg`. Captured from the actual built UI using a copy of the
  checkout demo store. Incident `RUN-AYMD8N` returns 500; fixed replay
  `RPL-SYWJ07` returns 202. These are demo data, not impact metrics. The
  environment-specific filesystem store chip was hidden for the screenshots.

The other 15 compositions use the existing project screenshots, without
redrawing interfaces or changing the original gallery files:

| Project | Asset folder under `src/assets/projects/` | Art direction / composition |
| --- | --- | --- |
| NotchMeter | `notchmeter` | Ice-blue glass arcs, framed desktop and expanded notch panel |
| SaveWise | `savewise` | Sage/jade glass, three real mobile screens in layered phones |
| Haven Harmony | `havenharmony` | Travertine and brass architecture, hotel and room previews |
| Paylance | `paylance` | Cobalt folded glass, inventory workspace and paper invoice |
| ProcureDesk | `procuredesk` | Steel-blue stepped forms, request and approval workspaces |
| Cliniqo | `cliniqo` | Soft jade glass, clinic dashboard and appointments |
| TimePay PH | `timepay` | Copper clock arc, attendance and payroll workspaces |
| PayMatrix | `paymatrix` | Amethyst precision blocks, stacked payroll/import windows |
| SulitFlights | `sulitflight` | Azure metallic sail, flight search and popular routes |
| Mine Flow | `mineflow` | Teal/chrome loops, commerce dashboard and automation settings |
| AdForge | `adforge` | Coral metal ribbons, dark creative workspaces |
| ServicePass PH | `servicepass` | Amber page fan, layered study workspaces |
| Presyo Pro Calculator | `presyopro` | Champagne glass prisms, calculator and pricing previews |
| Savvy Wallet | `savvywallet` | Seafoam ceramic curves, charts and transaction entry |
| Aniverse Canvas | `aniverse` | Lilac silk/resin brushstroke, layered anime discovery gallery |

NotchMeter's enlarged panel is a CSS framing of its original screenshot; the
uncropped screenshot remains in its gallery. SaveWise's original gallery
screens remain in `taskorbit-mobile/`. Generated originals remain in the
ImageGen output directory; optimized assets are committed alongside the app.

JPEGs use quality 90 with a maximum width of 1600. Phone screens use width 768.
Original app icons retain PNG transparency. The original source projects were
read without changing their application code or data.

## Rendering and motion

`ProductShowcase.tsx` composes source interfaces over the studio art. Each stage
has its own framing and motion: phone/island drift, floating detail windows,
notch emphasis, approval-path pulses, creative orbit breathing, or a replay scan
and verification pulse. Semantic buttons open the featured case studies; dialog
showcases are noninteractive labeled images. CSS animation pauses offscreen and
in hidden tabs. Reduced motion disables animated layers and pointer tilt; the
existing media-query subscription releases scroll pinning.

To regenerate collection covers, open the local portfolio through Playwright,
use a desktop viewport, and enable reduced motion. From the page, import the
development helper `/scripts/render-project-covers.tsx` and call
`await mountProjectCover(projectTitle)`. It mounts the actual composition at
1000×700 and waits for fonts and images. Capture
`#project-cover-export .product-showcase`, then call `unmountProjectCover()`.
Save the result in its asset folder at JPEG quality 90 (`cover-v1.jpg` for the
15 upgraded projects). The original three `cover.jpg` files are retained.
Capture the actual component so product content stays faithful to its source.

Browser QA captures belong in `output/playwright/`. Contact checks must mock
`/api/send`; these visual checks never submit real contact email.
