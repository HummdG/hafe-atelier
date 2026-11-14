// Crops and resizes the raw "How it works" photography into public/images/how-it-works/.
// Run from the repo root once the raw files are present: `npm run how-it-works-images`.
// Raw files are expected in the repo root (or pass a directory as the first argument).
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const srcDir = resolve(process.argv[2] ?? ".");
const outDir = resolve("public/images/how-it-works");
mkdirSync(outDir, { recursive: true });

const LONG_EDGE = 1600;

/** @type {{ src: string; out: string; crop?: { left: number; top: number; width: number; height: number } }[]} */
const jobs = [
  // Step 01: inspiration references. Crop away the retailer's site header and thumbnail strip.
  { src: "Picture 1.jpg", out: "inspiration-silhouette.jpg", crop: { left: 100, top: 64, width: 400, height: 736 } },
  { src: "Picture 1.jpg", out: "inspiration-sharara.jpg", crop: { left: 140, top: 500, width: 330, height: 255 } },
  { src: "Picture 2.png", out: "inspiration-neckline.jpg", crop: { left: 60, top: 20, width: 340, height: 380 } },
  // Step 02
  { src: "02_Video_Call.png", out: "consultation.jpg" },
  // Step 03
  { src: "afb69dd7-9491-4017-8522-e0d620014732.JPG", out: "embroidery-frame.jpg" },
  // Step 04: event photo, plus the accessories triptych split into its three panels.
  { src: "IMG_4392.JPG", out: "finished-look.jpg" },
  { src: "Gold and ivory Pakistani accessories.png", out: "accessory-earrings.jpg", crop: { left: 0, top: 0, width: 1024, height: 500 } },
  { src: "Gold and ivory Pakistani accessories.png", out: "accessory-bangles.jpg", crop: { left: 0, top: 518, width: 1024, height: 478 } },
  { src: "Gold and ivory Pakistani accessories.png", out: "accessory-potli.jpg", crop: { left: 0, top: 1016, width: 1024, height: 520 } },
  // Step 05
  { src: "Packed Ivory Baraat Outfit in Cream Box.png", out: "delivery-box.jpg" },
];

for (const job of jobs) {
  // .rotate() with no args applies EXIF orientation (IMG_4392 is stored landscape, shot portrait).
  let img = sharp(join(srcDir, job.src)).rotate();
  if (job.crop) img = img.extract(job.crop);
  const info = await img
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(outDir, job.out));
  console.log(`${job.out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
