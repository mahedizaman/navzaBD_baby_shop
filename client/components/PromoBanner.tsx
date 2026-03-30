"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <motion.section
      className="px-4 py-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-[#1e1250] px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-[#7f77dd]/20 pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[200px] w-48 h-48 rounded-full bg-[#f97316]/15 pointer-events-none" />

        <div className="relative z-10 text-center md:text-left">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#afa9ec] mb-3">
            Special Offer
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
            Diaper Category
            <br />
            <span className="text-[#fbbf24]">Up to 30% Off!</span>
          </h2>
          <p className="text-[#afa9ec] text-sm md:text-base max-w-sm">
            Unbeatable deals on top brands like Pampers and Huggies. Offer
            valid for a limited time.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="text-7xl select-none">🩲</div>
          <Link
            href="/products?search=diaper"
            className="px-8 py-3.5 bg-[#f97316] hover:bg-[#ea6c10] text-white font-bold rounded-full text-sm transition-all hover:scale-105 active:scale-95"
          >
            View Offer →
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
}
