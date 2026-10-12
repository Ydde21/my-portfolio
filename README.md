# Eddy Casas — Portfolio

Personal portfolio for Eddy Casas, a software developer in Bacolod City, Philippines.

React 18, TypeScript, Vite, Tailwind, Framer Motion, and Three.js. Deployed on Vercel with contact and chat endpoints.

## Develop

```sh
npm install
npm run dev
```

The development server defaults to port 8080. Use `.env.example` for the existing API configuration. The local Vite plugin serves `/api/send` and `/api/chat`.

```sh
npx tsc -b
npm run test
npm run build
npm run preview
```

## Experience

A full-body cloud robot greets visitors, floats, blinks, and responds to the pointer. Drag it, use the arrow keys, or choose **Take a spin** to explore it. The character is actual articulated Three.js geometry with a sculpted cloud shell, ceramic panels, glass visor, cyan eyes, and a small flight pack.

On large screens, scrolling the hero guides the robot through a spring-smoothed glide and gentle flight turn, then brings it back toward the visitor while the headline transitions. Four featured projects then appear in a pinned showcase: Nudge, Nivra, Recurr, and NotchMeter. Each has CSS studio-dark backdrops, source-derived product previews, and an animated composition. Tabs and arrow controls let visitors jump directly between chapters. Scrolling remains native.

All 19 projects have art-directed collection covers, with their own palette, studio-dark backdrop, and layered product interfaces or source-derived architecture diagrams. The Web, Mobile, and Desktop filters remain available. Each opens an accessible dialog with an animated product showcase, its original description, highlights, screenshot gallery, and actual project or release link where available. Nudge, Nivra, Recurr, and LocalMesh also include challenge and approach narratives. Nudge has no invented store or release link.

LocalMesh adds a source-backed case study for a self-hosted AI network, with a studio-dark cover and explicitly labeled architecture diagrams for its device topology, request routing, and enrollment security. These illustrate documented behavior rather than live fleet telemetry. The chatbot also includes LocalMesh in its project context.

Phones use a vertical hero and manually controlled project showcase. Reduced motion removes pinning and automatic movement, including when the preference changes while the site is open. Navigation, project details, and contact remain ordinary HTML.

## Implementation

- `src/scene/robot.ts` owns the character geometry and articulated rig. `director.ts` owns choreography and drag momentum; `springs.ts` provides weighted motion for the root and joints.
- `ExperienceCanvas.tsx` mounts one transparent canvas aligned with `data-robot-anchor` elements. It pauses offscreen or in hidden tabs and lowers pixel ratio on slow devices.
- `RobotInteraction.tsx` forwards accessible HTML controls to the canvas. A baked render of the same model covers loading and unavailable or lost WebGL contexts. It hands off directly to the first live frame.
- `scripts/render-robot-preview.ts` regenerates `public/robot-preview.webp` and `public/robot-preview-mobile.webp` from the actual geometry and shared `presentation.ts` lighting. Start the development server, open the hero at 1440×960 and scroll to the top, then import this script through Vite and save the WebP data URL returned by `renderRobotPreview()` as the desktop portrait. Repeat at 390×844 for the mobile portrait, matching that camera angle. Regenerate this portrait whenever model geometry or lighting changes.
- `projects.data.ts` remains the source of truth for all 19 projects and screenshots. Featured projects are Nudge, Nivra, Recurr, and NotchMeter. SaveWise, ProcureDesk, and PayMatrix remain in the full project collection.
- `ProductShowcase.tsx` renders all 19 product stages using phone, notch, editorial, invoice, workflow, dashboard, stacked-window, campaign, calculator, gallery, and network compositions. Motion pauses offscreen or in hidden tabs and respects reduced motion. Asset sources and cover-rendering instructions are documented in [scripts/project-visuals.md](scripts/project-visuals.md).
- Space Grotesk, Instrument Sans, and IBM Plex Mono are self-hosted. Font licenses are in `public/licenses/`.
- Both themes, resume, contact form, and chatbot remain available. The redesign does not alter the email/chat backend contracts.

## Checks

Unit checks cover full-body flight, model stability, reduced motion, WebGL fallback, project preservation, filtering, keyboard chapter selection, and screenshot browsing. Browser checks cover desktop/tablet/phone layouts, both themes, real scrolling, drag and spin, galleries, dialogs, keyboard focus, and motion preferences. Contact submission should use a mocked endpoint during UI verification.
