"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Sumaiya Begum",
    role: "A mother of a 2-year-old",
    review:
      "Amazing quality! No rashes on my baby’s skin. Delivery was super fast. I order every month.",
    rating: 5,
    initials: "SB",
    color: "#fef3f0",
    avatarBg: "#f97316",
  },
  {
    name: "Rafi Hossain",
    role: "First-time dad",
    review:
      "Great value for money with excellent product quality. Customer service is also outstanding. Highly recommended (10/10).",
    rating: 5,
    initials: "RH",
    color: "#eff6ff",
    avatarBg: "#3b82f6",
  },
  {
    name: "Nusrat Jahan",
    role: "Mother of three",
    review:
      "I buy from here for all three kids. The return policy is simple, and the offers are truly incredible!",
    rating: 5,
    initials: "NJ",
    color: "#f0fdf4",
    avatarBg: "#22c55e",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
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
          Reviews
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-1">
          What Parents Are Saying?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: r.color }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            whileHover={{ y: -5 }}
          >
            <Stars />
            <p className="text-[13.5px] text-gray-600 leading-relaxed flex-1">
              {r.review}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-black/5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                style={{ backgroundColor: r.avatarBg }}
              >
                {r.initials}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1a1a2e]">
                  {r.name}
                </p>
                <p className="text-[11px] text-gray-400">{r.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
