"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    tag: "New Collection",
    title: "Best Outfits for\nYour Little Sunshine",
    offer: "Enjoy 25% Off on All New Items!",
    cta: "Shop Now",
    href: "/products",
    bg: "#fef3f0",
    accent: "#f97316",
    emoji: "👶",
    decorColor: "#fde8d8",
  },
  {
    id: 2,
    tag: "Special Offer",
    title: "Mega Sale on Diaper & Feeding\nProducts",
    offer: "Up to 30% Off — Limited Time!",
    cta: "View Offers",
    href: "/deals",
    bg: "#f0f7ff",
    accent: "#3b82f6",
    emoji: "🍼",
    decorColor: "#dbeafe",
  },
  {
    id: 3,
    tag: "New Arrivals",
    title: "Baby Toys & Learning\nKits",
    offer: "Free Delivery on Orders ৳500+!",
    cta: "Explore the Collection",
    href: "/products?search=toys",
    bg: "#f0fdf4",
    accent: "#22c55e",
    emoji: "🧸",
    decorColor: "#dcfce7",
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 28 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

export default function HeroSlider() {
  const [[current, dir], setCurrent] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const paginate = (newDir: number) => {
    setCurrent(([prev]) => [
      (prev + newDir + slides.length) % slides.length,
      newDir,
    ]);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => paginate(1), 4500);
    return () => clearInterval(id);
  }, [paused, current]);

  const slide = slides[current];

  return (
    <motion.section
      className="relative overflow-hidden w-full"
      style={{ height: "clamp(340px, 55vw, 560px)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex items-center"
          style={{ backgroundColor: slide.bg }}
        >
          {/* Decorative circles */}
          <div
            className="absolute right-[-60px] top-[-60px] w-[340px] h-[340px] rounded-full opacity-40"
            style={{ backgroundColor: slide.decorColor }}
          />
          <div
            className="absolute right-[120px] bottom-[-80px] w-[220px] h-[220px] rounded-full opacity-30"
            style={{ backgroundColor: slide.decorColor }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 w-full flex items-center justify-between gap-8">
            <div className="max-w-xl">
              <motion.span
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                style={{
                  backgroundColor: slide.decorColor,
                  color: slide.accent,
                }}
              >
                {slide.tag}
              </motion.span>

              <motion.h1
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-3xl md:text-5xl font-bold text-[#1a1a2e] leading-tight mb-4 whitespace-pre-line"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-base md:text-lg text-gray-500 mb-8"
              >
                {slide.offer}
              </motion.p>

              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-sm md:text-base transition-all hover:opacity-90 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: slide.accent }}
                >
                  {slide.cta}
                  <span className="text-lg">→</span>
                </Link>
              </motion.div>
            </div>

            {/* Big emoji decoration */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring" as const,
                stiffness: 200,
              }}
              className="hidden md:flex text-[140px] lg:text-[180px] select-none"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.08))" }}
            >
              {slide.emoji}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {[
        { dir: -1, Icon: ChevronLeft, pos: "left-4" },
        { dir: 1, Icon: ChevronRight, pos: "right-4" },
      ].map(({ dir: d, Icon, pos }) => (
        <button
          key={pos}
          onClick={() => paginate(d)}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all`}
        >
          <Icon size={20} />
        </button>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent([i, i > current ? 1 : -1])}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              backgroundColor: i === current ? slide.accent : "#d1d5db",
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}
