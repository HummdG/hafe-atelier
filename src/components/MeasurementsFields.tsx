"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  MEASUREMENT_KEYS,
  REQUIRED_MEASUREMENTS,
  type Customisation,
  type MeasurementKey,
} from "@/lib/request-schema";

export const MEASUREMENT_LABELS: Record<MeasurementKey, string> = {
  shirtLength: "Shirt length",
  chest: "Chest",
  waist: "Waist",
  hip: "Hip",
  shoulder: "Shoulder",
  sleeveLength: "Sleeve length",
  armhole: "Armhole",
  trouserLength: "Trouser length",
  bottom: "Trouser bottom",
};

export const labelClass = "block text-xs font-light uppercase tracking-[0.2em] text-ink/60";
export const fieldClass =
  "mt-2 block w-full rounded-none border-0 border-b border-ink/30 bg-transparent px-0 py-2 font-sans text-base text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory aria-[invalid=true]:border-red-800";

type Unit = "cm" | "in";

type Props = {
  register: UseFormRegister<Customisation>;
  errors?: FieldErrors<Customisation>["measurements"];
  unit: Unit;
  onUnitChange: (u: Unit) => void;
};

export function MeasurementsFields({ register, errors, unit, onUnitChange }: Props) {
  const required = new Set<MeasurementKey>(REQUIRED_MEASUREMENTS);
  return (
    <fieldset className="mt-6">
      <legend className={labelClass}>Measurements</legend>
      <div role="radiogroup" aria-label="Unit" className="mt-3 flex gap-6 text-sm">
        {(["cm", "in"] as const).map((u) => (
          <label key={u} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="measurement-unit"
              value={u}
              checked={unit === u}
              onChange={() => onUnitChange(u)}
              className="peer sr-only"
            />
            <span className="border-b border-transparent pb-0.5 uppercase tracking-[0.2em] text-ink/60 peer-checked:border-gold peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-gold/60">
              {u}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {MEASUREMENT_KEYS.map((k) => {
          const id = `m-${k}`;
          const err = errors?.[k];
          return (
            <div key={k}>
              <label
                htmlFor={id}
                className={`${labelClass}${required.has(k) ? " after:content-['_*']" : ""}`}
              >
                {MEASUREMENT_LABELS[k]}
              </label>
              <input
                id={id}
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                aria-invalid={err ? "true" : undefined}
                aria-describedby={err ? `${id}-err` : undefined}
                className={fieldClass}
                {...register(`measurements.${k}`, {
                  setValueAs: (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? undefined : Number(v)),
                })}
              />
              <p className="mt-1 text-xs text-ink/50">{unit}</p>
              {err && (
                <p id={`${id}-err`} role="alert" className="text-xs text-red-800">
                  {MEASUREMENT_LABELS[k]} is required
                </p>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
