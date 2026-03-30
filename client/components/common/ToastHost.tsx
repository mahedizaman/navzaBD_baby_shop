"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastFn = (message: string) => void;

const ToastContext = createContext<ToastFn | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  return useMemo(
    () => ({
      toast: (message: string) => {
        if (!ctx) {
          // Fallback (should not happen if ToastHost is mounted in layout)
          window.alert(message);
          return;
        }
        ctx(message);
      },
    }),
    [ctx],
  );
}

export function ToastHost({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(null), 1800);
    return () => window.clearTimeout(id);
  }, [message]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed right-4 top-4 z-[100] pointer-events-none">
        <AnimatePresence>
          {message ? (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none rounded-xl bg-[#1e1250] text-white px-4 py-3 shadow-xl border border-white/10 text-sm font-semibold"
            >
              {message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

