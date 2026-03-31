"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import type { ProductListItem } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PriceDisplay from "@/components/common/PriceDisplay";

export type ProductDetailData = ProductListItem & { finalPrice?: number };

function label(
  ref: ProductDetailData["category"] | ProductDetailData["brand"],
): string {
  if (typeof ref === "object" && ref !== null && "name" in ref) return ref.name;
  return "";
}

type Props = {
  product: ProductDetailData;
};

export function ProductDetailView({ product }: Props) {
  const discount = product.discountPercentage ?? 0;
  const hasDiscount = discount > 0;
  const finalPrice =
    typeof product.finalPrice === "number"
      ? product.finalPrice
      : product.price - (product.price * discount) / 100;

  return (
    <Container className="px-4 py-8 md:px-4 md:py-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-primary">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="relative w-full shrink-0 lg:max-w-[min(100%,32rem)] lg:flex-1">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {hasDiscount ? (
              <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground">
                -{discount}%
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {label(product.category)}
              {label(product.brand) ? ` · ${label(product.brand)}` : ""}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            {hasDiscount ? (
              <span className="text-lg text-muted-foreground line-through">
                <PriceDisplay amountBDT={product.price} />
              </span>
            ) : null}
            <span className="text-3xl font-semibold text-primary">
              <PriceDisplay amountBDT={finalPrice} />
            </span>
          </div>

          <Separator />

          <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">Details</p>
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>

          <p className="text-sm">
            <span className="text-muted-foreground">Stock: </span>
            <span className="font-medium text-foreground">{product.stock}</span>
          </p>

          <div className="pt-2">
            <AddToCartButton
              productId={product._id}
              name={product.name}
              image={product.image}
              price={finalPrice}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
