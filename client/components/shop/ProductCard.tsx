import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/services/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function getLabel(
  ref: ProductListItem["category"] | ProductListItem["brand"],
): string {
  if (typeof ref === "object" && ref !== null && "name" in ref) return ref.name;
  return "";
}

type Props = {
  product: ProductListItem;
};

export function ProductCard({ product }: Props) {
  const discount = product.discountPercentage ?? 0;
  const hasDiscount = discount > 0;
  const outOfStock = product.stock === 0;
  const finalPrice =
    typeof product.finalPrice === "number"
      ? product.finalPrice
      : product.price - (product.price * discount) / 100;

  return (
    <Link href={`/products/${product._id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {outOfStock ? (
            <Badge className="absolute left-2 top-2 bg-red-600 text-white">
              Out of Stock
            </Badge>
          ) : null}
          {hasDiscount ? (
            <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">
              -{discount}%
            </Badge>
          ) : null}
        </div>
        <CardContent className="px-3 pt-3 pb-1">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-foreground">
            {product.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {getLabel(product.category)}
            {getLabel(product.brand) ? ` · ${getLabel(product.brand)}` : ""}
          </p>
        </CardContent>
        <CardFooter className="flex flex-wrap items-baseline gap-2 px-3 pb-3 pt-0">
          {hasDiscount ? (
            <span className="text-sm text-muted-foreground line-through">
              ৳{product.price.toFixed(0)}
            </span>
          ) : null}
          <span className="text-lg font-semibold text-primary">
            ৳{finalPrice.toFixed(0)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
