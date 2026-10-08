# Portfolio — agent notes

Vite + React 18 + TypeScript + Tailwind 3.4 + Framer Motion 11 + raw Three.js. Vercel hosts the production site; the local Vite plugin serves `/api/send` and `/api/chat` in development.

## Commands

- `npm run dev` — defaults to port 8080
- `npm run build` — production build
- `npx tsc -b` — typecheck; Vite build does not typecheck
- `npm run test` — Vitest
- `npx eslint <paths>` — targeted lint; pre-existing lint noise lives in `src/components/ui/**`

## Architecture

- `src/scene/ExperienceCanvas.tsx` is one lazy transparent canvas. Its fixed parent is at z20, above section backgrounds but below navigation, chat, and dialogs. It never captures pointer input.
- `src/scene/robot.ts` builds an articulated, full-body cloud robot from actual mesh geometry. The cloud shell uses a smoothed signed-distance surface. The rig owns full-body flight, presenting, greetings, blinking, and idle motion.
- `[data-robot-anchor]` elements reserve visible space. `data-robot-pose` selects `hero`, `present`, `quiet`, or `contact`. Keep text outside these spaces.
- On large screens the hero pins for 180svh and the robot rotates a full turn with a flight pose as the visitor scrolls. The four featured chapters pin for 440svh, derived from the chapter count. Scrolling stays native; no wheel interception.
- `RobotInteraction.tsx` forwards drag, arrow-key, and spin events to the canvas. Drag cancels an active spin. On small screens the hero is a normal vertical layout and project chapters use tabs/arrows.
- Rendering pauses offscreen and in hidden tabs; pixel ratio adapts downward on slow devices. `useMediaQuery.ts` subscribes to preference changes, so reduced motion immediately releases pinned sections and uses static poses.
- `public/robot-preview.webp` and `public/robot-preview-mobile.webp` are baked renders of the actual model for desktop and phone camera angles, shown until WebGL renders and after context loss. Regenerate it with `scripts/render-robot-preview.ts` whenever geometry or lighting changes. Live and baked scenes share `presentation.ts`; never substitute a separately drawn robot here. The first live frame begins in the baked resting pose, without a two-image crossfade.
- `WorkSection.tsx` provides four featured chapters (Nudge, Nivra, Recurr, and NotchMeter), a platform-filtered grid of all 18 projects, and a Radix detail dialog with descriptions and screenshot galleries. Dialog focus returns to the opener. Project tabs support arrow keys, Home, and End.
- `ProductShowcase.tsx` gives all 18 projects art-directed covers and animated dialog showcases with source-derived interfaces and generated studio backdrops. Composition metadata stays in `projects.data.ts`. Preserve interface fidelity, original gallery images, and demo provenance notes. See `scripts/project-visuals.md` for assets and regeneration; motion pauses offscreen/in hidden tabs and respects reduced motion. Keep the four featured chapters unless the user requests another selection.
- Facts and screenshots stay in `projects.data.ts`. Do not invent projects, results, metrics, or per-project technology lists. NotchMeter is a desktop application despite its legacy web data discriminator. SaveWise links to its real release, not the generic store links.
- Retain resume, theme, contact, and chatbot functionality. Mock `/api/send` for browser checks to avoid sending test email.

## Design system

- Dark-first midnight background, cool white text, blue/lavender atmosphere, lime accent. The light theme uses a violet accent.
- Space Grotesk display, Instrument Sans body, IBM Plex Mono metadata. Fonts are self-hosted through Fontsource; licenses ship in `public/licenses/`. Google Fonts are blocked by the production CSP.
- `src/index.css` owns the responsive layout, stage compositions, dialogs, and theme tokens. Important shared classes include `.page-shell`, `.eyebrow`, `.pill-button`, `.understated-link`, and `.icon-control`.
- Verify actual rendered desktop and mobile layouts after visual changes. Use normal flow on small/short screens and under reduced motion.

## Media

Prefer project screenshots below roughly 300KB, JPEG quality90 and maximum width1600 unless transparency is necessary. Preserve original image content and descriptive alt text.
