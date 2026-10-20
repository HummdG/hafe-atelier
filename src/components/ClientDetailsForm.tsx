import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ClientDetails } from "@/lib/request-schema";
import { fieldClass, labelClass } from "./CustomiseForm";

type Props = {
  register: UseFormRegister<ClientDetails>;
  errors: FieldErrors<ClientDetails>;
};

function FieldError({ show, message }: { show: boolean; message: string }) {
  return show ? <p role="alert" className="text-xs text-red-800">{message}</p> : null;
}

export function ClientDetailsForm({ register, errors }: Props) {
  return (
    <fieldset className="space-y-6">
      <legend className="font-serif text-2xl">Your details</legend>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cd-name" className={labelClass}>Name</label>
          <input id="cd-name" autoComplete="name" className={fieldClass} aria-invalid={errors.name ? "true" : undefined} {...register("name")} />
          <FieldError show={!!errors.name} message="Please enter your name" />
        </div>
        <div>
          <label htmlFor="cd-email" className={labelClass}>Email</label>
          <input id="cd-email" type="email" autoComplete="email" className={fieldClass} aria-invalid={errors.email ? "true" : undefined} {...register("email")} />
          <FieldError show={!!errors.email} message="Please enter a valid email" />
        </div>
        <div>
          <label htmlFor="cd-whatsapp" className={labelClass}>WhatsApp number (optional)</label>
          <input id="cd-whatsapp" type="tel" autoComplete="tel" className={fieldClass} {...register("whatsapp")} />
        </div>
        <div>
          <label htmlFor="cd-country" className={labelClass}>Country</label>
          <input id="cd-country" autoComplete="country-name" className={fieldClass} aria-invalid={errors.country ? "true" : undefined} {...register("country")} />
          <FieldError show={!!errors.country} message="Please enter your country" />
        </div>
      </div>
      <div>
        <label htmlFor="cd-contact" className={labelClass}>Preferred contact</label>
        <select id="cd-contact" className={`${fieldClass} max-w-xs`} {...register("preferredContact")}>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>
    </fieldset>
  );
}
