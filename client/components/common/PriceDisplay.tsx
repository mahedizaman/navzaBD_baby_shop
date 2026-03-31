"use client";

import { useMemo } from "react";
import { useCurrency } from "@/lib/currency";

type Props = {
  /** Base price in BDT (your backend prices are BDT). */
  amountBDT: number;
  className?: string;
};

export default function PriceDisplay({ amountBDT, className }: Props) {
  const { code, rateBdtPerUnit } = useCurrency();

  const { display, locale } = useMemo(() => {
    const safe = Number.isFinite(amountBDT) ? amountBDT : 0;

    if (code === "USD") {
      const usd = rateBdtPerUnit > 0 ? safe / rateBdtPerUnit : 0;
      return { display: usd, locale: "en-US" };
    }
    return { display: safe, locale: "bn-BD" };
  }, [amountBDT, code, rateBdtPerUnit]);

  const formatted = useMemo(() => {
    const maximumFractionDigits = code === "USD" ? 2 : 0;
    const minimumFractionDigits = code === "USD" ? 2 : 0;
    const symbol = code === "USD" ? "$" : "৳";

    const num = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(display);

    return `${symbol}${num}`;
  }, [code, display, locale]);

  return <span className={className}>{formatted}</span>;
}

