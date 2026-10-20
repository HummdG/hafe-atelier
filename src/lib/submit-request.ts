import type { RequestPayload } from "./request-schema";

// Stub: Task 8 replaces this with the real implementation.
export async function submitRequest(
  ...args: [payload: RequestPayload, files: File[], via: "email" | "whatsapp"]
): Promise<void> {
  void args;
  throw new Error("Not wired yet");
}
