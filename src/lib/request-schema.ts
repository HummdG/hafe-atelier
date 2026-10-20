import { z } from "zod";

export const MEASUREMENT_KEYS = [
  "shirtLength", "chest", "waist", "hip", "shoulder",
  "sleeveLength", "armhole", "trouserLength", "bottom",
] as const;
export const REQUIRED_MEASUREMENTS = ["shirtLength", "chest", "waist", "hip"] as const;
export const STANDARD_SIZES = ["XS", "S", "M", "L", "XL"] as const;
export const SCRATCH_NAME = "Bespoke from scratch";

export type MeasurementKey = (typeof MEASUREMENT_KEYS)[number];
export type StandardSize = (typeof STANDARD_SIZES)[number];

const measurementValue = z.number().positive().max(300);

export const customisationSchema = z
  .object({
    changes: z.string(),
    colours: z.string(),
    fabric: z.string(),
    occasion: z.string(),
    eventDate: z.string().optional(),
    sizeMode: z.enum(["standard", "custom"]),
    standardSize: z.enum(STANDARD_SIZES).optional(),
    unit: z.enum(["cm", "in"]),
    measurements: z
      .object(Object.fromEntries(MEASUREMENT_KEYS.map((k) => [k, measurementValue.optional()])) as Record<MeasurementKey, z.ZodOptional<typeof measurementValue>>)
      .partial()
      .optional(),
    notes: z.string(),
  })
  .superRefine((c, ctx) => {
    if (c.sizeMode === "standard" && !c.standardSize) {
      ctx.addIssue({ code: "custom", path: ["standardSize"], message: "Choose a size" });
    }
    if (c.sizeMode === "custom") {
      for (const k of REQUIRED_MEASUREMENTS) {
        const v = c.measurements?.[k];
        if (typeof v !== "number" || !(v > 0)) {
          ctx.addIssue({ code: "custom", path: ["measurements", k], message: "Required" });
        }
      }
    }
  });
export type Customisation = z.infer<typeof customisationSchema>;

export const bagItemSchema = z.object({
  id: z.string(),
  pieceSlug: z.string().nullable(),
  pieceName: z.string(),
  customisation: customisationSchema,
});
export type BagItem = z.infer<typeof bagItemSchema>;

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  whatsapp: z.string(),
  country: z.string().min(2),
  preferredContact: z.enum(["email", "whatsapp"]),
});
export type ClientDetails = z.infer<typeof clientSchema>;

export const requestSchema = z.object({
  items: z.array(bagItemSchema).min(1).max(10),
  client: clientSchema,
  website: z.string().optional(),
});
export type RequestPayload = z.infer<typeof requestSchema>;
