// Generates placeholder SVGs into public/images/placeholders/.
// Replace the output with real photography whenever the owner is ready.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Task 5 fills this with the piece slugs; each gets <slug>-1.svg and <slug>-2.svg.
export const PIECE_SLUGS = [
  "gul-e-rana-lehenga",
  "noor-jahan-gharara",
  "mehr-un-nisa-sharara",
  "zarina-peshwas",
  "raat-ki-rani-gown",
  "sitara-anarkali",
  "shabnam-cape-set",
  "meher-jamawar-coat",
  "chandni-kurta-set",
  "gulabi-angarkha",
  "eid-ka-chand-frock",
  "baharan-sharara-set",
];

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "placeholders");

const PORTRAIT = [900, 1200];
const LANDSCAPE = [1920, 1080];

function svg(label, [w, h], tone = 0) {
  const from = tone ? "#6b4f3a" : "#3b2a20";
  const to = tone ? "#efe6da" : "#f7f3ee";
  const size = Math.round(w / 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" filter="url(#n)" opacity="0.12"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" letter-spacing="${Math.round(size / 6)}" fill="#f7f3ee" fill-opacity="0.85">${label}</text>
</svg>
`;
}

const label = (s) => s.replace(/-/g, " ").toUpperCase();

const files = [
  ["hero", LANDSCAPE],
  ["bridal", PORTRAIT],
  ["formal", PORTRAIT],
  ["festive", PORTRAIT],
  ["bespoke", PORTRAIT],
].map(([name, dims]) => [`${name}.svg`, svg(label(name), dims)]);

for (const slug of PIECE_SLUGS) {
  files.push([`${slug}-1.svg`, svg(label(slug), PORTRAIT, 0)]);
  files.push([`${slug}-2.svg`, svg(label(slug), PORTRAIT, 1)]);
}

mkdirSync(outDir, { recursive: true });
for (const [name, content] of files) writeFileSync(join(outDir, name), content);
console.log(`Wrote ${files.length} placeholders to ${outDir}`);
