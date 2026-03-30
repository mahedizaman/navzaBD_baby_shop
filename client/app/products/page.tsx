import { Suspense } from "react";
import type { Metadata } from "next";
import Container from "@/components/common/Container";
import { getBrands, getCategories, getProducts } from "@/services";
import {
  parseShopSearchParams,
  shopQueryToProductParams,
} from "@/lib/shop-query";
import {
  ShopFiltersMobile,
  ShopFiltersSidebar,
} from "@/components/shop/ShopFilters";
import { ShopSearchBar } from "@/components/shop/ShopSearchBar";
import { ShopSortBar } from "@/components/shop/ShopSortBar";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopPagination } from "@/components/shop/ShopPagination";

export const metadata: Metadata = {
  title: "Shop | NavzaBD Baby Shop",
  description: "Browse baby products, filter by category and brand.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = parseShopSearchParams(raw);
  const [categories, brands, { products, total }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(shopQueryToProductParams(parsed)),
  ]);

  return (
    <Container className="px-4 py-8 md:px-4 md:py-10">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Shop
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} product{total === 1 ? "" : "s"} found
        </p>
      </div>

      <Suspense fallback={<ShopPageFallback />}>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <ShopFiltersSidebar categories={categories} brands={brands} />
          <div className="min-w-0 flex-1">
            <ShopSearchBar />
            <ShopFiltersMobile categories={categories} brands={brands} />
            <ShopSortBar />
            {products.length === 0 ? (
              <p className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                No products match your filters. Try adjusting search or filters.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                {products.map((p) => (
                  <li key={p._id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            )}
            <ShopPagination
              total={total}
              limit={parsed.limit}
              currentPage={parsed.page}
            />
          </div>
        </div>
      </Suspense>
    </Container>
  );
}

function ShopPageFallback() {
  return (
    <div className="animate-pulse rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
      Loading shop…
    </div>
  );
}
