# Portfolio product visuals

All 18 projects have studio covers and animated product showcases in their
detail dialogs. Only Nudge, Nivra, Recurr, and NotchMeter appear in the four
featured scrolling chapters. Project facts, gallery images, cover paths, and
case-study copy live in `src/components/portfolio/projects.data.ts`.

## Assets and provenance

Covers have no image backgrounds. `.studio-backdrop` and `.studio-vignette` in
`src/index.css` draw a "studio dark" stage in CSS: a near-black base, a soft
glow in the project's `tone`, a faint top light, fine SVG grain and a floor
shadow under the product. The earlier generated studio art was removed at the
owner's request because it read as AI-made; do not bring it back.

The original three folders contain a `cover.jpg` render of the complete
composition. The other 15 folders contain `cover-v1.jpg`. Product interfaces
are source-derived layers.

- `src/assets/projects/nudge/`: the original app icon and
  `island.jpg`, `lock.jpg`, `reminders.jpg`. These are screenshots of the `.screen`
  elements in `~/Projects/Nudge/Marketing/appstore-set.html?shot=1`, `3`, and `5`.
  The island detail is a DOM rendering of the existing SwiftUI/marketing layout.
- `src/assets/projects/nivra/`: the original app icon and
  `screen.jpg`, `panel.jpg`, `engine.jpg`. Captured from `#screen`, `#nvPanel`, and
  `.engine-card` in `~/Projects/Nivra/Nivra-Web/`. The browser film was stopped
  while its expanded queue was visible using `window.__nivra.stop()`.
- `src/assets/projects/recurr/`: `timeline.jpg`,
  `flow.jpg`, `diff.jpg`. Captured from the actual built UI using a copy of the
  checkout demo store. Incident `RUN-AYMD8N` returns 500; fixed replay
  `RPL-SYWJ07` returns 202. These are demo data, not impact metrics. The
  environment-specific filesystem store chip was hidden for the screenshots.

The other 15 compositions use the existing project screenshots, without
redrawing interfaces or changing the original gallery files:

| Project | Asset folder under `src/assets/projects/` | Composition |
| --- | --- | --- |
| NotchMeter | `notchmeter` | Framed desktop and expanded notch panel |
| SaveWise | `savewise` | Three real mobile screens in layered phones |
| Haven Harmony | `havenharmony` | Hotel and room previews |
| Paylance | `paylance` | Inventory workspace and paper invoice |
| ProcureDesk | `procuredesk` | Request and approval workspaces |
| Cliniqo | `cliniqo` | Clinic dashboard and appointments |
| TimePay PH | `timepay` | Attendance and payroll workspaces |
| PayMatrix | `paymatrix` | Stacked payroll/import windows |
| SulitFlights | `sulitflight` | Flight search and popular routes |
| Mine Flow | `mineflow` | Commerce dashboard and automation settings |
| AdForge | `adforge` | Dark creative workspaces |
| ServicePass PH | `servicepass` | Layered study workspaces |
| Presyo Pro Calculator | `presyopro` | Calculator and pricing previews |
| Savvy Wallet | `savvywallet` | Charts and transaction entry |
| Aniverse Canvas | `aniverse` | Layered anime discovery gallery |

NotchMeter's enlarged panel is a CSS framing of its original screenshot; the
uncropped screenshot remains in its gallery. SaveWise's original gallery
screens remain in `taskorbit-mobile/`.

JPEGs use quality 90 with a maximum width of 1600. Phone screens use width 768.
Original app icons retain PNG transparency. The original source projects were
read without changing their application code or data.

## Rendering and motion

`ProductShowcase.tsx` composes source interfaces over the CSS studio backdrop. Each stage
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
