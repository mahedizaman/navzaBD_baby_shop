"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCcw, HeadphonesIcon } from "lucide-react";

const signals = [
  {
    Icon: Truck,
    title: "Free Delivery",
    desc: "Free shipping across the country on orders ৳500+",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    Icon: ShieldCheck,
    title: "100% Original",
    desc: "All products are genuine, clean, and safe",
    color: "#22c55e",
    bg: "#f0fdf4",
  },
  {
    Icon: RefreshCcw,
    title: "Easy Returns",
    desc: "Hassle-free returns within 7 days",
    color: "#f97316",
    bg: "#fef3f0",
  },
  {
    Icon: HeadphonesIcon,
    title: "24/7 Support",
    desc: "We’re always here to help whenever you need us",
    color: "#9333ea",
    bg: "#fdf4ff",
  },
];

export default function TrustSignals() {
  return (
    <motion.section
      className="py-14 px-4 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <div className="text-center mb-10">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#7f77dd]">
          Why Choose Us?
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-1">
          Our Promise
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {signals.map((s, i) => (
          <motion.div
            key={s.title}
            className="rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-transparent"
            style={{ backgroundColor: s.bg }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.04, borderColor: s.color + "40" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: s.color + "20" }}
            >
              <s.Icon size={22} style={{ color: s.color }} />
            </div>
            <h3 className="text-[14px] font-bold text-[#1a1a2e]">{s.title}</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
