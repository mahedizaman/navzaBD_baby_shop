"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <motion.section
      className="px-4 py-10 pb-20 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <motion.div
        className="relative overflow-hidden bg-[#fdfcfb] border border-gray-100 rounded-3xl px-6 md:px-16 py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Soft blobs */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-[#eeedfe] opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-[#fde8d8] opacity-60 translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-[#eeedfe] flex items-center justify-center mb-4">
            <Mail size={22} className="text-[#7f77dd]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-2">
            Get New Offers First!
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-sm">
            Subscribe and get exclusive discounts and updates on new products.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-[#22c55e] font-semibold bg-[#f0fdf4] px-6 py-3 rounded-full"
              >
                <span className="text-lg">✓</span> Thank you! You're subscribed
                successfully.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="relative flex-1 w-full">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full h-[46px] pl-10 pr-4 text-[13px] border border-gray-200 rounded-full
                      bg-white outline-none focus:border-[#afa9ec] transition-all placeholder:text-gray-400"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 h-[46px] rounded-full bg-[#1e1250] text-white text-[13px] font-semibold w-full sm:w-auto justify-center"
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <>
                      <Send size={14} /> Subscribe
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}
