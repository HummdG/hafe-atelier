import { bagItemSchema, type BagItem, type Customisation } from "./request-schema";

export type BagAction =
  | { type: "add"; item: BagItem }
  | { type: "update"; id: string; customisation: Customisation }
  | { type: "remove"; id: string }
  | { type: "clear" };

export const BAG_KEY = "hafe-bag-v1";

export function bagReducer(state: BagItem[], action: BagAction): BagItem[] {
  switch (action.type) {
    case "add":
      return [...state, action.item];
    case "update":
      return state.map((i) => (i.id === action.id ? { ...i, customisation: action.customisation } : i));
    case "remove":
      return state.filter((i) => i.id !== action.id);
    case "clear":
      return [];
  }
}

export function loadBag(storage: Pick<Storage, "getItem">): BagItem[] {
  try {
    const raw = storage.getItem(BAG_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const items: BagItem[] = [];
    for (const entry of data) {
      const r = bagItemSchema.safeParse(entry);
      if (r.success) items.push(r.data);
    }
    return items;
  } catch {
    return [];
  }
}

export function saveBag(storage: Pick<Storage, "setItem">, items: BagItem[]): void {
  try {
    storage.setItem(BAG_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable or full: ignore
  }
}
