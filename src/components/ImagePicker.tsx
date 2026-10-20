"use client";

import { useId, useState, type ChangeEvent } from "react";
import { PHOTOS_TOO_LARGE, fitsBudget, isImage, resizeImage } from "@/lib/images";
import { labelClass } from "./CustomiseForm";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  resize?: (file: File) => Promise<File>;
};

const NOT_IMAGE = "Only photos can be attached";

export function ImagePicker({ files, onChange, resize = resizeImage }: Props) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const picked = Array.from(input.files ?? []);
    input.value = "";
    if (picked.length === 0) return;
    if (!picked.every(isImage)) {
      setError(NOT_IMAGE);
      return;
    }
    setBusy(true);
    try {
      const resized = await Promise.all(picked.map((f) => resize(f)));
      const next = [...files, ...resized];
      if (!fitsBudget(next.map((f) => f.size))) {
        setError(PHOTOS_TOO_LARGE);
        return;
      }
      setError(null);
      onChange(next);
    } catch {
      setError("We couldn't read that photo. Please try another.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label htmlFor={id} className={labelClass}>Inspiration photos</label>
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={onPick}
        className="mt-2 block w-full text-sm file:mr-4 file:border file:border-ink/40 file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.2em]"
      />
      <div role="status" aria-live="polite">
        {error && <p className="mt-2 text-xs text-red-800">{error}</p>}
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-4">
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] underline decoration-gold underline-offset-4"
                aria-label={`Remove photo ${f.name}`}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
