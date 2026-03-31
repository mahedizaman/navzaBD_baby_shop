"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/common/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { getProductById } from "@/services/products";
import type { ProductListItem } from "@/services/types";
import PriceDisplay from "@/components/common/PriceDisplay";

type WishlistProduct = ProductListItem & { finalPrice?: number };

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uniqueIds = useMemo(() => [...new Set(productIds)], [productIds]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (uniqueIds.length === 0) {
        setProducts([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled(
          uniqueIds.map((id) => getProductById(id)),
        );

        const fulfilled = results
          .filter((r): r is PromiseFulfilledResult<WishlistProduct> => r.status === "fulfilled")
          .map((r) => r.value);

        if (!cancelled) setProducts(fulfilled);
      } catch {
        if (!cancelled) setError("Unable to load wishlist items.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [uniqueIds]);

  const isEmpty = uniqueIds.length === 0;

  return (
    <Container className="px-4 py-8 md:px-4 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1e1250] text-white flex items-center justify-center">
            <Heart size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Wishlist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Save your favorite items and move them to cart anytime.
            </p>
          </div>
        </div>
      </motion.div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-dashed bg-white/60 p-10 text-center"
        >
          <p className="text-muted-foreground font-medium">
            Your wishlist is empty.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#1e1250] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1f6e] transition-colors"
            >
              Browse products
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {error ? (
            <div className="text-center text-sm text-gray-500">{error}</div>
          ) : null}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: Math.min(9, uniqueIds.length) }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white/60 overflow-hidden"
                >
                  <div className="relative h-40 bg-[#fafaf9]">
                    <Skeleton className="absolute inset-0" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-4/5 mb-3" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-9 w-24 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {products.map((p) => {
                const discount = p.discountPercentage ?? 0;
                const finalPrice =
                  typeof p.finalPrice === "number"
                    ? p.finalPrice
                    : p.price - (p.price * discount) / 100;

                return (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
                    className="rounded-2xl border border-gray-100 bg-white/60 overflow-hidden"
                  >
                    <div className="relative h-44 bg-[#fafaf9]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 border border-black/5 flex items-center justify-center text-[#1e1250]">
                        <Heart size={16} fill="none" />
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-[14px] font-semibold text-[#1a1a2e] line-clamp-1">
                        {p.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[#1e1250] font-bold">
                          <PriceDisplay amountBDT={finalPrice} />
                        </span>
                        {discount > 0 ? (
                          <span className="text-gray-400 text-xs line-through">
                            <PriceDisplay amountBDT={p.price} />
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            addItem(
                              {
                                productId: p._id,
                                name: p.name,
                                image: p.image,
                                price: finalPrice,
                                stock: p.stock,
                              },
                              1,
                            );
                            removeFromWishlist(p._id);
                          }}
                          className="w-full rounded-xl bg-[#1e1250] hover:bg-[#2d1f6e] text-white text-sm font-semibold py-2.5 transition-colors"
                        >
                          Move to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
}

