"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/useCartStore";

function formatBDT(amount: number) {
  const v = Number.isFinite(amount) ? amount : 0;
  return `৳${v.toFixed(0)}`;
}

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const updateQty = useCartStore((s) => s.updateQty);

  const total = useMemo(() => {
    return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  }, [lines]);

  const isEmpty = lines.length === 0;

  return (
    <Container className="px-4 py-8 md:px-4 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="mb-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Cart
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your items and adjust quantities.
          </p>
        </div>
      </motion.div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-dashed bg-white/60 p-10 text-center"
        >
          <p className="text-muted-foreground font-medium">Your cart is empty.</p>
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white/60">
              <table className="min-w-[680px] w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-muted-foreground">
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Quantity</th>
                    <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => (
                    <motion.tr
                      key={line.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.02 }}
                      className="border-t border-gray-100"
                      whileHover={{ backgroundColor: "rgba(99,102,241,0.03)" }}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-black/5 bg-white">
                            <Image
                              src={line.image}
                              alt={line.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1a1a2e] truncate">
                              {line.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-[#1a1a2e] font-semibold">
                          {formatBDT(line.price)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateQty(line.productId, line.qty - 1)}
                            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </motion.button>

                          <span className="min-w-[20px] text-center font-semibold text-[#1a1a2e]">
                            {line.qty}
                          </span>

                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const max = typeof line.stock === "number" ? line.stock : undefined;
                              if (max !== undefined && line.qty >= max) {
                                window.alert("Maximum stock reached");
                                return;
                              }
                              updateQty(line.productId, line.qty + 1);
                            }}
                            disabled={
                              typeof line.stock === "number" ? line.qty >= line.stock : false
                            }
                            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            +
                          </motion.button>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <span className="text-[#1e1250] font-bold">
                          {formatBDT(line.price * line.qty)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:sticky lg:top-24"
            >
              <div className="rounded-2xl border border-gray-100 bg-white/60 p-5 md:p-6">
                <h2 className="text-lg font-bold text-[#1a1a2e]">
                  Summary
                </h2>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total items</span>
                  <span className="font-semibold text-[#1a1a2e]">
                    {lines.reduce((sum, l) => sum + l.qty, 0)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total price</span>
                  <span className="font-bold text-[#1e1250]">
                    {formatBDT(total)}
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-[#1e1250] px-4 py-3">
                  <p className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                    Checkout
                  </p>
                  <p className="text-white font-bold mt-1">
                    {formatBDT(total)}
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#1e1250] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d1f6e]"
                >
                  Proceed to checkout
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </Container>
  );
}

