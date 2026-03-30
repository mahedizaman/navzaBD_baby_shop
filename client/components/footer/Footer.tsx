import Link from "next/link";
import Container from "../common/Container";
import {
  Facebook,
  Instagram,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const quickShopLinks = [
  { label: "About Us", href: "/about" },
  { label: "Shop All", href: "/products" },
  { label: "Hot Deals", href: "/deals" },
  { label: "New Arrivals", href: "/products?sortOrder=desc" },
];

const supportLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Return Policy", href: "/returns" },
  { label: "Shipping Info", href: "/shipping" },
];

const Footer = () => {
  return (
    <footer className="mt-10 bg-slate-900 text-slate-200">
      <Container className="px-4 py-10 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white">
              nav<span className="text-violet-300">zaBD</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Trusted baby essentials shop with premium quality products for your
              little one.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialIcon href="https://facebook.com" label="Facebook">
                <Facebook size={16} />
              </SocialIcon>
              <SocialIcon href="https://instagram.com" label="Instagram">
                <Instagram size={16} />
              </SocialIcon>
              <SocialIcon href="https://wa.me/8801700000000" label="WhatsApp">
                <MessageCircle size={16} />
              </SocialIcon>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Shop
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickShopLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-violet-300" />
                <span>House 12, Road 7, Mirpur DOHS, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-violet-300" />
                <a href="tel:+8801700000000" className="transition-colors hover:text-white">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-violet-300" />
                <a
                  href="mailto:support@navzabd.com"
                  className="break-all transition-colors hover:text-white"
                >
                  support@navzabd.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-700/70 pt-5 text-center">
          <p className="text-sm text-slate-300">
            Copyright © 2026 NavzaBD. All rights reserved.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1 text-slate-200">
              SSLCommerz
            </span>
            <span className="rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1 text-slate-200">
              bKash
            </span>
            <span className="rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1 text-slate-200">
              Nagad
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-300 transition-colors hover:border-violet-300 hover:text-white"
    >
      {children}
    </a>
  );
}

export default Footer;
