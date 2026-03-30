"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { getProducts } from "@/services/products";
import type { ProductListItem } from "@/services/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/components/common/ToastHost";

const PRODUCT_NAME_TRANSLATIONS: Record<string, string> = {
  "সফট বেবি রোমপার": "Soft Baby Romper",
  "অর্গানিক ডায়াপার প্যাক": "Organic Diaper Pack",
  "বেবি ফিডিং বটল সেট": "Baby Feeding Bottle Set",
  "সফট প্লাশ টেডি বিয়ার": "Soft Plush Teddy Bear",
  "বেবি স্কিন লোশন": "Baby Skin Lotion",
  "মাল্টি-কালার বিল্ডিং ব্লক": "Multi-Color Building Blocks",
  "বেবি স্লিপিং ব্যাগ": "Baby Sleeping Bag",
  "ওয়াটারপ্রুফ বিব সেট": "Waterproof Bib Set",
};

function translateProductName(name: string) {
  return PRODUCT_NAME_TRANSLATIONS[name] ?? name;
}

function StarRating({ rating }: { rating: number }) {
  const safe = Number.isFinite(rating) ? rating : 0;
  const rounded = Math.round(safe);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={s <= rounded ? "#fbbf24" : "#e5e7eb"}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductListItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartQty = useCartStore((s) => {
    return s.lines.find((l) => l.productId === product._id)?.qty ?? 0;
  });
  const { toast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const addTimer = useRef<number | null>(null);

  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) =>
    s.productIds.includes(product._id),
  );

  const discountPercentage = product.discountPercentage ?? 0;
  const finalPrice =
    typeof product.finalPrice === "number"
      ? product.finalPrice
      : product.price - (product.price * discountPercentage) / 100;

  const outOfStock = product.stock <= 0;
  const discount = Math.round(discountPercentage);
  const translatedName = translateProductName(product.name);

  useEffect(() => {
    return () => {
      if (addTimer.current) window.clearTimeout(addTimer.current);
    };
  }, []);

  return (
    <Link href={`/products/${product._id}`} className="block">
      <motion.div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
        whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Image area */}
        <div className="relative bg-[#fafaf9] flex items-center justify-center h-44 overflow-hidden">
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src={product.image}
              alt={translatedName}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              priority={false}
            />
          </motion.div>

          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-[#1e1250] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              -{discount}%
            </div>
          )}

          {outOfStock && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              Out of Stock
            </div>
          )}

          {/* Wishlist button */}
          <motion.button
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center border border-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product._id);
            }}
            whileTap={{ scale: 0.85 }}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              size={14}
              fill={isWishlisted ? "#ef4444" : "none"}
              stroke={isWishlisted ? "#ef4444" : "#9ca3af"}
            />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-[13.5px] font-semibold text-[#1a1a2e] mb-1.5 line-clamp-1">
            {translatedName}
          </h3>

          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={product.averageRating ?? 0} />
            <span className="text-[11px] text-gray-400">
              {product.averageRating
                ? `(${product.averageRating.toFixed(1)})`
                : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold text-[#1e1250]">
              ৳{finalPrice.toFixed(0)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.price.toFixed(0)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <motion.button
            disabled={outOfStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (outOfStock) return;
              addItem(
                {
                  productId: product._id,
                  name: translatedName,
                  image: product.image,
                  price: finalPrice,
                  stock: product.stock,
                },
                1,
              );

              setJustAdded(true);
              toast("Product added to cart!");
              if (addTimer.current) window.clearTimeout(addTimer.current);
              addTimer.current = window.setTimeout(() => setJustAdded(false), 1000);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all"
            style={{
              backgroundColor: outOfStock
                ? "#e5e7eb"
                : justAdded
                  ? "#22c55e"
                  : "#1e1250",
              color: outOfStock ? "#6b7280" : "#fff",
              cursor: outOfStock ? "not-allowed" : "pointer",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingCart size={14} />
            {outOfStock
              ? "Out of stock"
              : justAdded
                ? "Added to cart ✓"
                : "Add to cart"}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="relative bg-[#fafaf9] flex items-center justify-center h-44 overflow-hidden">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-4/5 mb-3" />
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

const sectionMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProducts({ page: 1, limit: 8, sortOrder: "desc" });
        if (cancelled) return;
        setProducts(res.products);
      } catch {
        if (!cancelled) setError("Unable to load featured products.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => products.slice(0, 8), [products]);

  return (
    <motion.section
      className="py-14 px-4 max-w-6xl mx-auto"
      variants={sectionMotion}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mb-8 flex items-end justify-between gap-3 md:mb-10">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#7f77dd]">
            Featured
          </span>
          <h2 className="mt-1 text-xl font-bold text-[#1a1a2e] md:text-3xl">
            Best-Selling Products
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-[#7f77dd] hover:text-[#1e1250] transition-colors hidden sm:block"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-sm text-gray-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5">
          {cards.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </motion.section>
  );
}
