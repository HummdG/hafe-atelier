"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { bagReducer, loadBag, saveBag, type BagAction } from "@/lib/bag";
import type { BagItem, Customisation } from "@/lib/request-schema";

type BagContextValue = {
  items: BagItem[];
  count: number;
  hydrated: boolean;
  add(item: Omit<BagItem, "id">): string;
  update(id: string, c: Customisation): void;
  remove(id: string): void;
  clear(): void;
};

const BagContext = createContext<BagContextValue | null>(null);

type ProviderState = { items: BagItem[]; hydrated: boolean };
const initialState: ProviderState = { items: [], hydrated: false };

function providerReducer(state: ProviderState, action: BagAction): ProviderState {
  const items = bagReducer(state.items, action);
  return { items, hydrated: state.hydrated || action.type === "hydrate" };
}

export function RequestBagProvider({ children }: { children: ReactNode }) {
  const [{ items, hydrated }, dispatch] = useReducer(providerReducer, initialState);

  useEffect(() => {
    let loaded: BagItem[] = [];
    try {
      loaded = loadBag(window.localStorage);
    } catch {
      // storage blocked: start empty
    }
    dispatch({ type: "hydrate", items: loaded });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      saveBag(window.localStorage, items);
    } catch {
      // storage blocked
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<BagItem, "id">) => {
    const id = crypto.randomUUID();
    dispatch({ type: "add", item: { ...item, id } });
    return id;
  }, []);
  const update = useCallback((id: string, customisation: Customisation) => dispatch({ type: "update", id, customisation }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo(
    () => ({ items, count: items.length, hydrated, add, update, remove, clear }),
    [items, hydrated, add, update, remove, clear],
  );
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within RequestBagProvider");
  return ctx;
}
