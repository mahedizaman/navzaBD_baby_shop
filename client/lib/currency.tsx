"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CurrencyCode = "BDT" | "USD";

export type CurrencyState = {
  code: CurrencyCode;
  /**
   * How many BDT equals 1 unit of selected currency.
   * Example: USD -> 120 means 1 USD = 120 BDT.
   */
  rateBdtPerUnit: number;
};

type CurrencyContextValue = CurrencyState & {
  setCurrency: (code: CurrencyCode) => void;
};

const STORAGE_KEY = "navzabd_currency";

const RATES_BDT_PER_UNIT: Record<CurrencyCode, number> = {
  BDT: 1,
  USD: 120,
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>("BDT");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "USD" || raw === "BDT") setCode(raw);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }, [code]);

  const value = useMemo<CurrencyContextValue>(() => {
    return {
      code,
      rateBdtPerUnit: RATES_BDT_PER_UNIT[code],
      setCurrency: (next) => setCode(next),
    };
  }, [code]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}

