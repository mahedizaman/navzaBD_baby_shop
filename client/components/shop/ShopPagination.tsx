"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  limit: number;
  currentPage: number;
};

export function ShopPagination({ total, limit, currentPage }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const hrefForPage = (page: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Link
        href={hrefForPage(currentPage - 1)}
        className={cn(
          "rounded-md border px-3 py-1.5 text-sm transition-colors",
          currentPage <= 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-muted",
        )}
        aria-disabled={currentPage <= 1}
      >
        Previous
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefForPage(p)}
          className={cn(
            "min-w-[2.25rem] rounded-md border px-3 py-1.5 text-center text-sm transition-colors",
            p === currentPage
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:bg-muted",
          )}
        >
          {p}
        </Link>
      ))}
      <Link
        href={hrefForPage(currentPage + 1)}
        className={cn(
          "rounded-md border px-3 py-1.5 text-sm transition-colors",
          currentPage >= totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-muted",
        )}
        aria-disabled={currentPage >= totalPages}
      >
        Next
      </Link>
    </nav>
  );
}
