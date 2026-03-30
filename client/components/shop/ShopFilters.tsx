"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Brand, Category } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

function buildNextParams(
  current: URLSearchParams,
  patch: Record<string, string | undefined>,
) {
  const next = new URLSearchParams(current.toString());
  Object.entries(patch).forEach(([k, v]) => {
    if (v === undefined || v === "") next.delete(k);
    else next.set(k, v);
  });
  next.delete("page");
  return next;
}

type PanelProps = {
  categories: Category[];
  brands: Brand[];
  /** Avoid duplicate ids when desktop + mobile panels both mount */
  idPrefix?: string;
};

function ShopFilterPanel({ categories, brands, idPrefix = "" }: PanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [priceMin, setPriceMin] = useState(
    () => searchParams.get("priceMin") ?? "",
  );
  const [priceMax, setPriceMax] = useState(
    () => searchParams.get("priceMax") ?? "",
  );

  const push = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = buildNextParams(searchParams, patch);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const selectedCategory = searchParams.get("category") ?? "";
  const selectedBrand = searchParams.get("brand") ?? "";

  return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
            Category
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => push({ category: undefined })}
                className={`text-left text-sm hover:text-primary ${
                  !selectedCategory
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                }`}
              >
                All categories
              </button>
            </li>
            {categories.map((c) => (
              <li key={c._id} className="flex items-center gap-2">
                <Checkbox
                  id={`${idPrefix}cat-${c._id}`}
                  checked={selectedCategory === c._id}
                  onCheckedChange={(checked) => {
                    if (checked) push({ category: c._id });
                    else if (selectedCategory === c._id)
                      push({ category: undefined });
                  }}
                />
                <label
                  htmlFor={`${idPrefix}cat-${c._id}`}
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                >
                  {c.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
            Brand
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => push({ brand: undefined })}
                className={`text-left text-sm hover:text-primary ${
                  !selectedBrand
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                }`}
              >
                All brands
              </button>
            </li>
            {brands.map((b) => (
              <li key={b._id} className="flex items-center gap-2">
                <Checkbox
                  id={`${idPrefix}brand-${b._id}`}
                  checked={selectedBrand === b._id}
                  onCheckedChange={(checked) => {
                    if (checked) push({ brand: b._id });
                    else if (selectedBrand === b._id)
                      push({ brand: undefined });
                  }}
                />
                <label
                  htmlFor={`${idPrefix}brand-${b._id}`}
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                >
                  {b.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">
            Price range
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label
                htmlFor={`${idPrefix}priceMin`}
                className="text-xs text-muted-foreground"
              >
                Min
              </Label>
              <Input
                id={`${idPrefix}priceMin`}
                type="number"
                min={0}
                placeholder="0"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor={`${idPrefix}priceMax`}
                className="text-xs text-muted-foreground"
              >
                Max
              </Label>
              <Input
                id={`${idPrefix}priceMax`}
                type="number"
                min={0}
                placeholder="Any"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={() =>
              push({
                priceMin: priceMin.trim() || undefined,
                priceMax: priceMax.trim() || undefined,
              })
            }
          >
            Apply price
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setPriceMin("");
            setPriceMax("");
            router.push(pathname);
          }}
        >
          Clear all filters
        </Button>
      </div>
  );
}

export function ShopFiltersSidebar({ categories, brands }: PanelProps) {
  return (
    <aside className="hidden w-full shrink-0 lg:block lg:w-64 lg:pt-1">
      <ShopFilterPanel
        categories={categories}
        brands={brands}
        idPrefix="sidebar-"
      />
    </aside>
  );
}

export function ShopFiltersMobile({ categories, brands }: PanelProps) {
  return (
    <div className="mb-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[min(100vw,20rem)] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ShopFilterPanel
              categories={categories}
              brands={brands}
              idPrefix="sheet-"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
