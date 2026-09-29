# Portfolio — agent notes

Vite + React 18 + TypeScript + Tailwind 3.4 + framer-motion 11 + three.js (raw, no R3F). Deployed on Vercel; `/api/send` (contact form) and `/api/chat` (chatbot) run via a local dev plugin in `vite.config.ts`.

## Commands

- `npm run dev` — dev server on :8080
- `npm run build` — production build
- `npx tsc -b` — typecheck (vite build does NOT typecheck)
- `npm run test` — vitest
- `npx eslint <paths>` — lint; pre-existing noise lives in `src/components/ui/**`

## Architecture

- `src/scene/` — the persistent background engine. **Contract** (documented atop `ExperienceCanvas.tsx`):
  - `ExperienceCanvas` is a default-export component that fills its parent; mounted once in `Index.tsx` inside `fixed inset-0 z-0 pointer-events-none`.
  - `jellyfish.ts` renders the visual: three luminous jellyfish (fresnel-glow bell shader with pulse contraction, bright cores + halo sprites, sine-wave tentacle ribbons). All look/feel constants live in `JELLIES` at the top of that file.
  - `[data-scene]` sections drive an occlusion pause: sections with a transparent own-background (hero, work) reveal the canvas and keep it animating while any is in view; opaque `bg-background` sections cover it and the loop pauses. `visibilitychange` handles tab-hide.
  - Palette is read live from `--background/--foreground/--muted-foreground/--accent` CSS vars (HSL triplets); jelly colours/blending ease on `.dark` flips (additive luminous in dark, slate/normal in light).
  - `prefers-reduced-motion` → one warmed static frame, no loop. Pointer parallax is `pointer: fine` only.
- `quality.ts` handles device tiers + adaptive pixel-ratio; `palette.ts` does CSS-var → THREE.Color reads.
- Sections that should reveal the scene use transparent backgrounds (hero, work); solid `bg-background` elsewhere.

## Design system

- Dark-first (main.tsx applies `dark` before paint). Warm near-black bg, bone fg, ember accent `hsl(16 78% 56%)`.
- Type: Fraunces (display), Instrument Sans (body), IBM Plex Mono (`.meta-label`/`.section-index`). Loaded via `<link>` in index.html.
- Shared CSS utilities in `src/index.css`: `.btn-sweep`, `.link-underline`, `.magnetic`, `.grain`, `.preview-shadow`, `.machine-fallback`.
- Project content lives in `src/components/portfolio/projects.data.ts` — `domain`/`highlights` are derived from real descriptions; do not invent projects.

## Media

Keep project screenshots ≤ ~300KB (JPEG q90, max width 1600 — `sips -s format jpeg -s formatOptions 90 -Z 1600`). The 6 largest PNGs were converted; keep new shots in `.jpg` unless transparency is needed.
