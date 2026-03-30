"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/services/categories";
import type { Category } from "@/services/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

const CATEGORY_CONFIG: Record<
  string,
  { emoji: string; bg: string; border: string; accent: string }
> = {
  Clothing: {
    emoji: "👗",
    bg: "#fef3f0",
    border: "#fcd5b8",
    accent: "#f97316",
  },
  Diapers: { emoji: "🩲", bg: "#eff6ff", border: "#bfdbfe", accent: "#3b82f6" },
  Feeding: { emoji: "🍼", bg: "#f0fdf4", border: "#bbf7d0", accent: "#22c55e" },
  Toys: { emoji: "🧸", bg: "#fdf4ff", border: "#e9d5ff", accent: "#a855f7" },
  Skincare: {
    emoji: "🧴",
    bg: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
  Strollers: {
    emoji: "🛒",
    bg: "#f0f9ff",
    border: "#bae6fd",
    accent: "#0ea5e9",
  },
  Bedding: { emoji: "🛏️", bg: "#fff1f2", border: "#fecdd3", accent: "#f43f5e" },
};

function getCategoryConfig(name: string) {
  const key = Object.keys(CATEGORY_CONFIG).find((k) =>
    name.toLowerCase().includes(k.toLowerCase()),
  ) as keyof typeof CATEGORY_CONFIG | undefined;

  return key
    ? CATEGORY_CONFIG[key]
    : { emoji: "✨", bg: "#f8fafc", border: "#e2e8f0", accent: "#64748b" };
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function CategoryCard({ category }: { category: Category }) {
  const config = getCategoryConfig(category.name);
  const href = `/products?category=${encodeURIComponent(category._id)}`;
  const [imgError, setImgError] = useState(false);
  const hasImage = !!category.image && !imgError;

  return (
    <motion.div variants={cardVariants}>
      <Link href={href} className="block">
        <motion.div
          className="flex flex-col items-center justify-between h-[110px] md:h-[130px] gap-2 p-3 md:p-4 rounded-2xl border-[1.5px] cursor-pointer w-full transition-shadow"
          style={{
            backgroundColor: config.bg,
            borderColor: config.border,
          }}
          whileHover={{ scale: 1.07, y: -5 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
        >
          {/* Image / Emoji */}
          <div
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl md:h-16 md:w-16"
            style={{
              backgroundColor: hasImage ? "#fff" : config.border + "80",
            }}
          >
            {hasImage ? (
              <Image
                src={category.image!}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 56px, 64px"
                className="h-full w-full object-cover p-1"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-2xl md:text-3xl select-none leading-none">
                {config.emoji}
              </span>
            )}
          </div>

          {/* Name */}
          <span
            className="text-[11px] md:text-[12px] font-semibold text-center leading-tight line-clamp-2"
            style={{ color: config.accent }}
          >
            {category.name}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-between h-[110px] md:h-[130px] gap-2 p-3 md:p-4 rounded-2xl border-[1.5px] border-gray-100 bg-gray-50">
      <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-xl" />
      <Skeleton className="h-3 w-16 rounded" />
    </div>
  );
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled)
          setError("Unable to load categories. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tiles = useMemo(() => categories.slice(0, 7), [categories]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8 text-center md:mb-10">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#7f77dd]">
          Categories
        </span>
        <h2 className="mt-1 text-xl font-bold text-[#1a1a2e] md:text-3xl">
          What are you looking for?
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-sm text-gray-400 py-8">{error}</div>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {tiles.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}

          {/* Explore All */}
          <motion.div variants={cardVariants}>
            <Link href="/products" className="block">
              <motion.div
                className="flex flex-col items-center justify-between h-[110px] md:h-[130px] gap-2 p-3 md:p-4 rounded-2xl border-[1.5px] border-dashed border-[#c4b9f5] cursor-pointer w-full bg-[#f5f3ff]"
                whileHover={{ scale: 1.07, y: -5 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 360, damping: 22 }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-[#ede9fe] flex items-center justify-center">
                  <Sparkles size={26} className="text-[#7f77dd]" />
                </div>
                <span className="text-[11px] md:text-[12px] font-semibold text-center text-[#7f77dd] leading-tight line-clamp-2">
                  Explore All
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
