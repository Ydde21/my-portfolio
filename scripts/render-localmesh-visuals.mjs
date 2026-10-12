import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Native architecture artwork, derived from LocalMesh's README and contracts.
// No fleet counts, performance metrics, or live dashboard state are invented.
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const option = (name) => args[args.indexOf(name) + 1];
const sharp = require(args.includes("--sharp-module") ? option("--sharp-module") : "sharp");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const folder = path.join(root, "src/assets/projects/localmesh");
await mkdir(folder, { recursive: true });
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const text = (x, y, value, size = 16, color = "#e8ecf4", extra = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${escape(value)}</text>`;
const rect = (x, y, width, height, radius = 12, fill = "#101722", stroke = "#2b3c58") =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
const card = (x, y, width, title, caption, meta, height = 102) =>
  `${rect(x, y, width, height)}<rect x="${x + 20}" y="${y + 20}" width="22" height="22" rx="6" fill="#4f7cff20" stroke="#739aff80"/>` +
  text(x + 56, y + 37, title, 19, "#edf2fc", 'font-weight="600"') +
  text(x + 20, y + 65, caption, 13, "#aab8cf") + text(x + 20, y + 85, meta, 11, "#7386a7", 'class="mono"');
const line = (d) => `<path d="${d}" fill="none" stroke="#537bce" stroke-width="2"/><path d="${d}" fill="none" stroke="#6998ff22" stroke-width="8"/>`;
const styles = `<style>text{font-family:'Space Grotesk',Arial,sans-serif}.mono{font-family:'IBM Plex Mono',Menlo,monospace}</style>`;
const frame = (title, content) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500" viewBox="0 0 1000 500">
  <title>${escape(title)} — LocalMesh architecture illustration</title>
  <defs><radialGradient id="halo"><stop stop-color="#19305a"/><stop offset="1" stop-color="#0b1019"/></radialGradient>
  <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#98b9f52a"/></pattern></defs>
  ${styles}${rect(1, 1, 998, 498, 16, "#0b1019", "#33445e")}
  <rect x="2" y="50" width="996" height="448" fill="url(#halo)"/><rect x="2" y="50" width="996" height="448" fill="url(#grid)"/>
  <path d="M2 50H998" stroke="#26364e"/>
  <circle cx="23" cy="25" r="4" fill="#739bff"/><circle cx="37" cy="25" r="4" fill="#43536e"/><circle cx="51" cy="25" r="4" fill="#43536e"/>
  ${text(76, 30, title, 14)}${text(734, 30, "ARCHITECTURE ILLUSTRATION", 10, "#8d9eba", 'class="mono"')}
  ${content}
  ${text(32, 480, "LOCALMESH / SOURCE-DERIVED DIAGRAM / NOT LIVE TELEMETRY", 9, "#6c7f9c", 'class="mono"')}
</svg>`;

const network = frame("Private inference network",
  line("M285 135C340 135 330 211 385 211") + line("M285 368C350 368 325 279 385 279") +
  line("M655 222C690 222 690 199 725 199") + line("M655 275C700 275 685 368 735 368") +
  line("M520 400V320") +
  card(55, 85, 230, "MacBook", "macOS device agent", "CPU · GPU · RAM") +
  card(55, 317, 230, "Linux GPU", "Linux device agent", "LOCAL MODELS · VRAM") +
  card(725, 148, 225, "Windows PC", "Windows device agent", "HARDWARE · HEALTH") +
  rect(385, 170, 270, 150, 18, "#111f37", "#719aff") +
  text(410, 201, "CONTROL PLANE", 10, "#93b5ff", 'class="mono"') +
  text(410, 238, "LocalMesh", 29, "#f2f6ff", 'font-weight="600"') +
  text(410, 266, "Gateway · scheduler · registry", 14, "#bbc9e2") +
  text(410, 294, "mTLS device connections", 12, "#7793bf", 'class="mono"') +
  card(735, 333, 215, "PostgreSQL", "Control-plane metadata", "NO PROMPT STORAGE", 102) +
  rect(375, 400, 290, 62, 10, "#101824", "#34496c") +
  text(397, 426, "YOUR APP / OPENAI SDK", 10, "#85a6dc", 'class="mono"') +
  text(397, 450, "One compatible endpoint", 18));

const routing = frame("Hardware-aware request routing",
  text(50, 105, "One request. One eligible device.", 31, "#eff4ff", 'font-weight="600"') +
  text(50, 139, "Independent inference workloads; models fit on a single node.", 16, "#9eafcb") +
  line("M277 238H365") + line("M635 238H724") +
  card(50, 187, 227, "OpenAI SDK", "Inference request", "POST /v1/chat/completions") +
  card(365, 187, 270, "Scheduler", "Explainable node selection", "ELIGIBILITY → WEIGHTED SCORING") +
  card(724, 187, 226, "Local node", "Whole-request execution", "OLLAMA ENGINE") +
  rect(50, 328, 900, 105, 14, "#101824", "#2a3a56") +
  text(76, 355, "WHAT THE SCHEDULER CONSIDERS", 10, "#83a5df", 'class="mono"') +
  text(76, 385, "Model availability · loaded state · free RAM / VRAM", 18) +
  text(76, 414, "CPU / GPU utilization · queue depth · latency · node health", 16, "#aebed8"));

const security = frame("A private network, with a trust boundary",
  text(50, 105, "Approve the device. Establish trust.", 31, "#eff4ff", 'font-weight="600"') +
  text(50, 139, "Cross-platform agents join a self-hosted control plane.", 16, "#9eafcb") +
  line("M277 238H365") + line("M635 238H724") +
  card(50, 187, 227, "Enrollment", "Device requests to join", "ENROLLMENT TOKEN") +
  card(365, 187, 270, "Admin approval", "Operator-controlled access", "PENDING → APPROVED") +
  card(724, 187, 226, "mTLS channel", "Encrypted node connection", "PER-NODE CREDENTIALS") +
  rect(50, 328, 435, 105, 14, "#101824", "#2a3a56") +
  text(76, 359, "SCOPED API KEYS", 11, "#83a5df", 'class="mono"') +
  text(76, 395, "Admin · inference · readonly", 19) +
  rect(515, 328, 435, 105, 14, "#101824", "#2a3a56") +
  text(541, 359, "METADATA, NOT PROMPTS", 11, "#83a5df", 'class="mono"') +
  text(541, 395, "Audit logs · no prompt storage", 19));
for (const [name, svg] of Object.entries({ network, routing, security })) {
  await writeFile(path.join(folder, `${name}.svg`), svg);
}

const image = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">${styles}
  <defs><linearGradient id="base" x2="0" y2="1"><stop stop-color="#111114"/><stop offset="1" stop-color="#09090b"/></linearGradient>
  <radialGradient id="key" cx=".72" cy=".62" r=".6"><stop stop-color="#93b5ff" stop-opacity=".16"/><stop offset=".7" stop-color="#93b5ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="top" cx=".5" cy="-.1" r=".8"><stop stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .06 0"/></filter>
  <filter id="shadow" x="-30%" y="-40%" width="170%" height="200%"><feDropShadow dx="10" dy="22" stdDeviation="18" flood-opacity=".65"/></filter>
  <clipPath id="round"><rect width="1000" height="700" rx="24"/></clipPath></defs>
  <g clip-path="url(#round)"><rect width="1000" height="700" fill="url(#base)"/><rect width="1000" height="700" fill="url(#key)"/><rect width="1000" height="700" fill="url(#top)"/><rect width="1000" height="700" filter="url(#grain)" opacity=".4"/>
  <g stroke="#93b5ff" stroke-width="1.6" fill="none"><path d="M65 54L77 47L89 54V68L77 75L65 68Z"/><path d="M77 47V61L89 68M77 61L65 68"/></g>
  ${text(104, 69, "LocalMesh", 21, "#f5f6fb", 'font-weight="500"')}${text(747, 66, "SELF-HOSTED / AI INFRASTRUCTURE", 9, "#b8c3d780", 'class="mono"')}
  ${text(60, 161, "Your hardware.", 42, "#f5f6fb", 'font-weight="500" letter-spacing="-1.7"')}${text(60, 207, "One AI network.", 42, "#f5f6fb", 'font-weight="500" letter-spacing="-1.7"')}
  <g transform="translate(64 255) rotate(-3 370 185)" filter="url(#shadow)"><image href="${image(network)}" width="740" height="370"/></g>
  <g transform="translate(535 439) rotate(3 215 70)" filter="url(#shadow)">${rect(0, 0, 420, 142, 14, "#0b1322", "#7093ca70")}
    ${text(24, 30, "OPENAI-COMPATIBLE GATEWAY", 10, "#91b0e8", 'class="mono"')}
    ${text(24, 65, "POST /v1/chat/completions", 17, "#e8eefb", 'class="mono"')}
    ${text(24, 94, "SDK → gateway → local node", 14, "#9cafcd", 'class="mono"')}
    ${text(24, 123, "PRIVATE / SELF-HOSTED", 10, "#7794bf", 'class="mono"')}
  </g>
  ${text(60, 663, "PRIVATE DEVICES · ONE COMPATIBLE ENDPOINT", 9, "#b8c3d799", 'class="mono"')}
  ${text(792, 663, "Architecture showcase ↗", 12, "#f5f6fb")}</g>
  <rect x=".5" y=".5" width="999" height="699" rx="24" fill="none" stroke="#ffffff20"/>
</svg>`;
await sharp(Buffer.from(cover)).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(folder, "cover-studio-dark.jpg"));
await sharp(Buffer.from(cover)).png().toFile(path.join(root, "output/playwright/localmesh-cover.png"));
console.log("Rendered LocalMesh architecture diagrams and studio cover.");
