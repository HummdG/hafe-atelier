"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** The home slider renders its own footer, so skip the layout one on "/". */
export function ConditionalFooter({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : <>{children}</>;
}
