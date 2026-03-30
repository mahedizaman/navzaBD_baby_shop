"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/components/common/ToastHost";

type Props = {
  productId: string;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export function AddToCartButton({
  productId,
  name,
  image,
  price,
  stock,
}: Props) {
  const [status, setStatus] = useState<"idle" | "added">("idle");
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const handleClick = () => {
    if (stock <= 0) return;

    addItem({ productId, name, image, price, stock }, 1);
    setStatus("added");
    toast("Product added to cart!");
    window.setTimeout(() => setStatus("idle"), 1000);
  };

  if (stock <= 0) {
    return (
      <Button type="button" size="lg" disabled className="w-full sm:w-auto">
        Out of stock
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="lg"
      className="w-full sm:w-auto"
      onClick={handleClick}
    >
      {status === "added" ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
