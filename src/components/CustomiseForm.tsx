"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customisationSchema, STANDARD_SIZES, type Customisation } from "@/lib/request-schema";
import { MeasurementsFields, fieldClass, labelClass } from "./MeasurementsFields";

export { fieldClass, labelClass };

export const buttonClass =
  "border border-ink bg-ink px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-umber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";
export const secondaryButtonClass =
  "border border-ink/40 px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-ink transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

export const DEFAULT_CUSTOMISATION: Customisation = {
  changes: "As shown",
  colours: "",
  fabric: "",
  occasion: "",
  sizeMode: "standard",
  standardSize: "M",
  unit: "cm",
  notes: "",
};

type Props = {
  defaultValues?: Partial<Customisation>;
  submitLabel: string;
  onSubmit: (c: Customisation) => void;
};

export function CustomiseForm({ defaultValues, submitLabel, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Customisation>({
    resolver: zodResolver(customisationSchema),
    defaultValues: { ...DEFAULT_CUSTOMISATION, ...defaultValues },
  });
  const sizeMode = useWatch({ control, name: "sizeMode" });
  const unit = useWatch({ control, name: "unit" });

  const submit = (c: Customisation) => {
    const { measurements, standardSize, ...rest } = c;
    const base = { ...rest, eventDate: rest.eventDate || undefined };
    if (c.sizeMode === "standard") onSubmit({ ...base, standardSize });
    else onSubmit({ ...base, measurements });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
      <div>
        <label htmlFor="cf-changes" className={labelClass}>What would you change?</label>
        <textarea id="cf-changes" rows={2} className={fieldClass} {...register("changes")} />
      </div>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-colours" className={labelClass}>Colours</label>
          <input id="cf-colours" className={fieldClass} {...register("colours")} />
        </div>
        <div>
          <label htmlFor="cf-fabric" className={labelClass}>Fabric</label>
          <input id="cf-fabric" className={fieldClass} {...register("fabric")} />
        </div>
        <div>
          <label htmlFor="cf-occasion" className={labelClass}>Occasion</label>
          <input id="cf-occasion" className={fieldClass} {...register("occasion")} />
        </div>
        <div>
          <label htmlFor="cf-date" className={labelClass}>Event date (optional)</label>
          <input id="cf-date" type="date" className={fieldClass} {...register("eventDate")} />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Fit</legend>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {([["standard", "Standard size"], ["custom", "Custom measurements"]] as const).map(([value, text]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input type="radio" value={value} className="peer sr-only" {...register("sizeMode")} />
              <span className="border-b border-transparent pb-0.5 uppercase tracking-[0.2em] text-ink/60 peer-checked:border-gold peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-gold/60">
                {text}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {sizeMode === "standard" ? (
        <div className="max-w-xs">
          <label htmlFor="cf-size" className={labelClass}>Size</label>
          <select id="cf-size" className={fieldClass} aria-invalid={errors.standardSize ? "true" : undefined} {...register("standardSize")}>
            {STANDARD_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.standardSize && <p role="alert" className="text-xs text-red-800">Choose a size</p>}
        </div>
      ) : (
        <MeasurementsFields
          register={register}
          errors={errors.measurements}
          unit={unit}
          onUnitChange={(u) => setValue("unit", u)}
        />
      )}

      <div>
        <label htmlFor="cf-notes" className={labelClass}>Notes</label>
        <textarea id="cf-notes" rows={2} className={fieldClass} {...register("notes")} />
      </div>

      <button type="submit" className={buttonClass}>
        {submitLabel}
      </button>
    </form>
  );
}
