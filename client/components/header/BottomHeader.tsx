"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  Search,
  ChevronDown,
  Menu,
  X,
  Home,
  LayoutGrid,
  Tag,
  Percent,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Container from "../common/Container";
import { useCartStore, cartItemCount } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

const navLinks = [
  { title: "Home", href: "/", icon: Home },
  { title: "Products", href: "/products", icon: ShoppingBag },
  { title: "Categories", href: "/categories", icon: LayoutGrid },
  { title: "Deals", href: "/deals", icon: Percent },
  { title: "About", href: "/about", icon: Info },
];

const mockUser = {
  name: "Mahedi",
  isLoggedIn: true,
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// ─── Framer Motion variants ───────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 32 },
  },
  exit: {
    x: "-100%",
    transition: { type: "spring" as const, stiffness: 320, damping: 32 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06 + 0.15, duration: 0.28 },
  }),
};

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

const MobileDrawer = ({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) => {
  const cartCount = useCartStore((s) => cartItemCount(s.lines));
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  // body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.aside
            className="fixed top-0 left-0 z-50 h-full w-[280px] bg-white flex flex-col shadow-2xl"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link
                href="/"
                onClick={onClose}
                className="font-bold text-[20px] text-[#1e1250] tracking-tight"
              >
                nav<span className="text-[#7f77dd]">zaBD</span>
              </Link>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1e1250] hover:bg-[#f4f3ff] transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Search inside drawer */}
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search products…"
                  className="w-full h-[38px] pl-8 pr-3 text-[13px] border border-gray-200 rounded-[10px]
                    bg-gray-50 outline-none focus:border-[#afa9ec] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">
                Menu
              </p>
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-[14px] font-medium transition-all
                        ${
                          isActive
                            ? "text-[#1e1250] bg-[#eeedfe]"
                            : "text-gray-600 hover:text-[#1e1250] hover:bg-[#f4f3ff]"
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isActive ? "bg-[#1e1250]" : "bg-gray-100"}`}
                      >
                        <Icon
                          size={15}
                          className={isActive ? "text-white" : "text-gray-500"}
                        />
                      </div>
                      {link.title}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7f77dd]"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="my-3 border-t border-gray-100" />

              {/* Wishlist & Cart links in drawer */}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">
                Shopping
              </p>

              {[
                {
                  title: "Wishlist",
                  href: "/wishlist",
                  icon: Heart,
                  count: wishlistCount,
                },
                {
                  title: "Cart",
                  href: "/cart",
                  icon: ShoppingCart,
                  count: cartCount,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    custom={navLinks.length + i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-[14px] font-medium
                        text-gray-600 hover:text-[#1e1250] hover:bg-[#f4f3ff] transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-gray-500" />
                      </div>
                      {item.title}
                      {item.count > 0 && (
                        <span className="ml-auto text-[11px] font-semibold bg-[#1e1250] text-white px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Drawer Footer: User */}
            <div className="px-4 py-4 border-t border-gray-100">
              {mockUser.isLoggedIn ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f4f3ff] border border-[#eeedfe]">
                  <div
                    className="w-9 h-9 rounded-full bg-[#1e1250] flex items-center justify-center
                    text-white text-[12px] font-semibold flex-shrink-0"
                  >
                    {getInitials(mockUser.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1e1250] truncate">
                      {mockUser.name}
                    </p>
                    <p className="text-[11px] text-gray-400">View profile</p>
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 flex-shrink-0"
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center text-[13px] font-medium py-2.5 rounded-xl
                    bg-[#1e1250] text-white hover:bg-[#2d1f6e] transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const BottomHeader = () => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartCount = useCartStore((s) => cartItemCount(s.lines));
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  return (
    <>
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />

      <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-30">
        <Container>
          <div className="flex items-center justify-between gap-4 h-[64px] md:h-[68px]">
            {/* Left: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger — only on mobile */}
              <motion.button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200
                  bg-gray-50 text-gray-500 hover:bg-[#f4f3ff] hover:border-[#afa9ec] hover:text-[#1e1250] transition-all"
                onClick={() => setDrawerOpen(true)}
                whileTap={{ scale: 0.92 }}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </motion.button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <span className="font-bold text-[20px] text-[#1e1250] tracking-tight">
                  nav<span className="text-[#7f77dd]">zaBD</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13.5px] font-medium px-3.5 py-2 rounded-lg transition-all duration-150
                    ${
                      pathname === link.href
                        ? "text-[#1e1250] bg-[#eeedfe]"
                        : "text-gray-500 hover:text-[#1e1250] hover:bg-[#f4f3ff]"
                    }`}
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Search — hidden on small mobile */}
            <div className="relative hidden sm:flex flex-1 max-w-xs">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search products…"
                className="w-full h-[38px] pl-9 pr-3 text-[13px] border border-gray-200 rounded-[10px]
                  bg-gray-50 outline-none focus:border-[#afa9ec] focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-[10px] border border-gray-200
                  bg-gray-50 text-gray-500 hover:text-[#1e1250] hover:bg-[#f4f3ff] hover:border-[#afa9ec] transition-all"
              >
                <Heart size={16} strokeWidth={1.8} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#1e1250] text-white
                    text-[9px] font-semibold rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-[10px] border border-gray-200
                  bg-gray-50 text-gray-500 hover:text-[#1e1250] hover:bg-[#f4f3ff] hover:border-[#afa9ec] transition-all"
              >
                <ShoppingCart size={16} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#1e1250] text-white
                    text-[9px] font-semibold rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="w-px h-6 bg-gray-200 mx-0.5" />

              {/* User / Login */}
              {mockUser.isLoggedIn ? (
                <motion.div
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-gray-200
                    bg-gray-50 hover:bg-[#f4f3ff] hover:border-[#afa9ec] transition-all cursor-pointer"
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className="w-[28px] h-[28px] md:w-[30px] md:h-[30px] rounded-full bg-[#1e1250] flex items-center justify-center
                    text-white text-[10px] md:text-[11px] font-semibold tracking-wide flex-shrink-0"
                  >
                    {getInitials(mockUser.name)}
                  </div>
                  <span className="hidden sm:block text-[13px] font-medium text-[#1e1250] max-w-[90px] truncate">
                    {mockUser.name}
                  </span>
                  <ChevronDown
                    size={12}
                    className="text-gray-400 hidden sm:block"
                  />
                </motion.div>
              ) : (
                <Link
                  href="/login"
                  className="text-[13px] font-medium px-3.5 py-2 rounded-full bg-[#1e1250] text-white
                    hover:bg-[#2d1f6e] transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default BottomHeader;
