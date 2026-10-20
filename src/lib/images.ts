export const MAX_TOTAL_BYTES = 4_000_000;
const FALLBACK_MAX_BYTES = 1_500_000;

export function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

export function fitsBudget(sizes: number[]): boolean {
  return sizes.reduce((a, b) => a + b, 0) <= MAX_TOTAL_BYTES;
}

export async function resizeImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    if (file.size < FALLBACK_MAX_BYTES) return file;
    throw new Error("Could not read this photo");
  }
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    if (file.size < FALLBACK_MAX_BYTES) return file;
    throw new Error("Could not process this photo");
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!blob) {
    if (file.size < FALLBACK_MAX_BYTES) return file;
    throw new Error("Could not process this photo");
  }
  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
