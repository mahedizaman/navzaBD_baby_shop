"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WishlistState = {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clear: () => void;
};

const WISHLIST_STORAGE_KEY = "navza_wishlist";

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

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggleWishlist: (productId) => {
        const exists = get().productIds.includes(productId);
        if (exists) {
          set({ productIds: get().productIds.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...get().productIds, productId] });
        }
      },

      removeFromWishlist: (productId) =>
        set({ productIds: get().productIds.filter((id) => id !== productId) }),

      clear: () => set({ productIds: [] }),
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      storage,
      version: 1,
    },
  ),
);

