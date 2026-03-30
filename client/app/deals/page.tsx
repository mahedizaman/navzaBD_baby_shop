"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/services";
import type { ProductListItem } from "@/services";

export default function DealsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDeals = async () => {
      try {
        const { products: allProducts } = await getProducts({ limit: 100 });
        if (!isMounted) return;
        setProducts(allProducts);
      } catch {
        if (!isMounted) return;
        setError("Unable to load deals right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDeals();

    return () => {
      isMounted = false;
    };
  }, []);

  const dealProducts = useMemo(
    () => products.filter((product) => (product.discountPercentage ?? 0) > 0),
    [products],
  );

  return (
    <Container className="px-4 py-10 md:py-12">
      <section className="mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-orange-500 via-rose-500 to-pink-600 px-6 py-10 text-white shadow-lg md:mb-10 md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
          Flash Offer
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
          Limited Time Hot Deals!
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90 md:text-base">
          Grab your favorite baby essentials at special discounted prices before
          stock runs out.
        </p>
      </section>

      {loading ? (
        <DealsSkeletonGrid />
      ) : error ? (
        <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          {error}
        </p>
      ) : dealProducts.length === 0 ? (
        <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          Check back later for exciting offers!
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {dealProducts.map((product) => {
            const discount = product.discountPercentage ?? 0;
            const salePrice =
              typeof product.finalPrice === "number"
                ? product.finalPrice
                : product.price - (product.price * discount) / 100;

            return (
              <li key={product._id}>
                <Link href={`/products/${product._id}`} className="group block h-full">
                  <Card className="h-full overflow-hidden border transition-shadow duration-300 hover:shadow-xl">
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                        -{discount}% OFF
                      </span>
                    </div>

                    <CardContent className="p-4 pb-2">
                      <h2 className="line-clamp-2 min-h-12 text-base font-semibold text-foreground">
                        {product.name}
                      </h2>
                    </CardContent>

                    <CardFooter className="flex items-end gap-2 p-4 pt-0">
                      <span className="text-sm text-muted-foreground line-through">
                        ৳{product.price.toFixed(0)}
                      </span>
                      <span className="text-2xl font-extrabold leading-none text-red-600">
                        ৳{salePrice.toFixed(0)}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

function DealsSkeletonGrid() {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <li key={`deal-skeleton-${index}`}>
          <Card className="h-full overflow-hidden border">
            <Skeleton className="aspect-square w-full rounded-none" />
            <CardContent className="space-y-3 p-4 pb-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </CardContent>
            <CardFooter className="flex gap-2 p-4 pt-0">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-24" />
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
