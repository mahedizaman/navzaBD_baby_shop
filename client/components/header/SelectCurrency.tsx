"use client"
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

const currencies = [
  {
    value: "usd",
    label: "US Dollar",
    code: "USD",
    symbol: "$",
    locale: "en-US",
  },
  {
    value: "bdt",
    label: "Bangladeshi Taka",
    code: "BDT",
    symbol: "৳",
    locale: "bn-BD",
  },
  { value: "eur", label: "Euro", code: "EUR", symbol: "€", locale: "de-DE" },
  {
    value: "gbp",
    label: "British Pound",
    code: "GBP",
    symbol: "£",
    locale: "en-GB",
  },
  {
    value: "inr",
    label: "Indian Rupee",
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
  },
  {
    value: "sar",
    label: "Saudi Riyal",
    code: "SAR",
    symbol: "﷼",
    locale: "ar-SA",
  },
  {
    value: "aed",
    label: "UAE Dirham",
    code: "AED",
    symbol: "د.إ",
    locale: "ar-AE",
  },
  {
    value: "jpy",
    label: "Japanese Yen",
    code: "JPY",
    symbol: "¥",
    locale: "ja-JP",
  },
  {
    value: "cad",
    label: "Canadian Dollar",
    code: "CAD",
    symbol: "CA$",
    locale: "en-CA",
  },
  {
    value: "aud",
    label: "Australian Dollar",
    code: "AUD",
    symbol: "A$",
    locale: "en-AU",
  },
  {
    value: "cny",
    label: "Chinese Yuan",
    code: "CNY",
    symbol: "¥",
    locale: "zh-CN",
  },
  {
    value: "pkr",
    label: "Pakistani Rupee",
    code: "PKR",
    symbol: "₨",
    locale: "en-PK",
  },
];

const SelectCurrency = () => {
  const [selected, setSelected] = useState(currencies[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = currencies.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block font-mono">
      {/* Trigger */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setSearch("");
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 min-w-40 px-3 py-2 text-white border rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer select-none
          ${
            open
              ? "bg-white/[0.07] border-white/25 rounded-b-none border-b-transparent"
              : "bg-white/4 border-white/12 hover:bg-white/8 hover:border-white/22"
          }`}
      >
        <Globe size={14} className="shrink-0 text-violet-400/70" />
        <span className="w-5 text-center text-sm font-medium text-violet-400">
          {selected.symbol}
        </span>
        <span className="flex-1 text-left text-sm font-medium tracking-wide">
          {selected.code}
        </span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 min-w-55 overflow-hidden rounded-b-xl border border-t-0 border-white/12 bg-[#1a1a2e] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          style={{ animation: "dropIn 0.18s cubic-bezier(0.4,0,0.2,1)" }}
        >
          <style>{`
            @keyframes dropIn {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Search */}
          <div className="border-b border-white/[0.07] px-3 py-2">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search currency…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-md border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-colors duration-150 focus:border-violet-400/50"
            />
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-xs text-white/30">
                No currencies found
              </p>
            ) : (
              filtered.map((currency) => {
                const isActive = selected.value === currency.value;
                return (
                  <div
                    key={currency.value}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setSelected(currency);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`flex cursor-pointer items-center gap-2.5 px-3.5 py-2 transition-colors duration-100
                      ${
                        isActive
                          ? "bg-violet-500/8 text-violet-400"
                          : "text-white/75 hover:bg-violet-500/10 hover:text-white"
                      }`}
                  >
                    <span className="w-5 text-center text-sm text-violet-400/80">
                      {currency.symbol}
                    </span>
                    <span className="w-8 text-xs font-semibold tracking-widest">
                      {currency.code}
                    </span>
                    <span className="flex-1 truncate text-xs text-white/50">
                      {currency.label}
                    </span>
                    {isActive && (
                      <Check size={12} className="shrink-0 text-violet-400" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectCurrency;
