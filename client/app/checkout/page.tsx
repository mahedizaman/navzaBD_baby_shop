"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import PriceDisplay from "@/components/common/PriceDisplay";
import {
  getStoredAuthToken,
  initiatePayment,
  type InitiatePaymentBody,
} from "@/services";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const [processing, setProcessing] = useState(false);
  const [shipping, setShipping] = useState({
    street: "",
    city: "",
    country: "Bangladesh",
    postalCode: "",
  });

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines],
  );

  const isEmpty = lines.length === 0;

  async function handlePayNow() {
    if (isEmpty) return;
    const token = getStoredAuthToken();
    if (!token) {
      window.alert(
        "Please log in first. After logging in via the API, save your JWT in localStorage as \"token\" or \"navzabd_token\".",
      );
      return;
    }

    const body: InitiatePaymentBody = {
      amount: total,
      items: lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        price: l.price,
        qty: l.qty,
        image: l.image,
      })),
      shippingAddress: {
        street: shipping.street.trim(),
        city: shipping.city.trim(),
        country: shipping.country.trim(),
        postalCode: shipping.postalCode.trim(),
      },
    };

    if (
      !body.shippingAddress.street ||
      !body.shippingAddress.city ||
      !body.shippingAddress.country ||
      !body.shippingAddress.postalCode
    ) {
      window.alert("Please fill in all shipping address fields.");
      return;
    }

    setProcessing(true);
    try {
      const { url } = await initiatePayment(body, token);
      if (!url) {
        throw new Error("No redirect URL from server");
      }
      window.location.href = url;
    } catch (e) {
      setProcessing(false);
      let message = "Payment could not be started. Please try again.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;
        if (data && typeof data === "object" && "message" in data) {
          message = String((data as { message: string }).message);
        }
      }
      window.alert(message);
    }
  }

  return (
    <Container className="relative px-4 py-8 md:py-10">
      {processing ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/85 backdrop-blur-sm">
          <Loader2
            className="h-12 w-12 animate-spin text-primary"
            aria-hidden
          />
          <p className="text-sm font-medium text-muted-foreground">
            Redirecting to secure payment…
          </p>
        </div>
      ) : null}

      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your shipping details, then pay securely with Stripe Checkout.
        </p>

        {isEmpty ? (
          <div className="mt-8 rounded-2xl border border-dashed p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-6">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold">Shipping address</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2 space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Street
                  </span>
                  <input
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    value={shipping.street}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, street: e.target.value }))
                    }
                    placeholder="House / road / area"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    City
                  </span>
                  <input
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, city: e.target.value }))
                    }
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Postal code
                  </span>
                  <input
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    value={shipping.postalCode}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, postalCode: e.target.value }))
                    }
                  />
                </label>
                <label className="sm:col-span-2 space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Country
                  </span>
                  <input
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    value={shipping.country}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, country: e.target.value }))
                    }
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Order total</span>
                <span className="text-lg font-bold text-primary">
                  <PriceDisplay amountBDT={total} />
                </span>
              </div>
              <Button
                type="button"
                className="mt-5 w-full"
                size="lg"
                onClick={() => void handlePayNow()}
                disabled={processing}
              >
                Pay Now
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 w-full"
                onClick={() => router.push("/cart")}
              >
                Back to cart
              </Button>
            </section>
          </div>
        )}
      </div>
    </Container>
  );
}
