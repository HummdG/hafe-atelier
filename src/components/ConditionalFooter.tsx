"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SLIDER_ROUTES } from "@/lib/slider-routes";

/** Slider pages render their own footer slide, so skip the layout one there. */
export function ConditionalFooter({ children }: { children: ReactNode }) {
  return SLIDER_ROUTES.includes(usePathname()) ? null : <>{children}</>;
}
