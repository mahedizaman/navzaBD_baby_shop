"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  name: string;
  image: string;
  price: number; // final price for the selected discount state
  /** Optional: used for client-side max-qty UI guards */
  stock?: number;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  addItem: (line: Omit<CartLine, "qty">, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CART_STORAGE_KEY = "navza_cart";

const storage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    // Safe no-op storage for SSR/build-time evaluation.
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    } as unknown as Storage;
  }

  return window.localStorage;
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (line, qty = 1) => {
        const safeQty = Math.max(0, qty);
        if (safeQty === 0) return;

        const nextLine: CartLine = { ...line, qty: safeQty };
        const existingIdx = get().lines.findIndex((l) => l.productId === line.productId);

        if (existingIdx >= 0) {
          const nextLines = get().lines.slice();
          nextLines[existingIdx] = {
            ...nextLines[existingIdx],
            qty: nextLines[existingIdx].qty + safeQty,
            stock:
              typeof line.stock === "number" ? line.stock : nextLines[existingIdx].stock,
          };
          set({ lines: nextLines });
        } else {
          set({ lines: [...get().lines, nextLine] });
        }
      },

      removeItem: (productId) =>
        set({ lines: get().lines.filter((l) => l.productId !== productId) }),

      updateQty: (productId, qty) => {
        const nextQty = Math.floor(qty);
        if (nextQty <= 0) {
          set({ lines: get().lines.filter((l) => l.productId !== productId) });
          return;
        }

        const nextLines = get().lines.map((l) =>
          l.productId === productId ? { ...l, qty: nextQty } : l,
        );
        set({ lines: nextLines });
      },

      clear: () => set({ lines: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      storage,
      version: 1,
    },
  ),
);

export function cartItemCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

