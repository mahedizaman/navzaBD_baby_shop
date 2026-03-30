"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import Container from "@/components/common/Container";
import { verifyCheckoutSession } from "@/services";
import { useCartStore } from "@/store/useCartStore";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    let cancelled = false;

    if (sessionId) {
      void verifyCheckoutSession(sessionId)
        .then((result) => {
          if (!cancelled && result.success) clearCart();
        })
        .catch(() => {
          /* webhook may still finalize the order */
        });
    }

    const t = setTimeout(() => {
      if (!cancelled) router.push("/");
    }, 3000);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [sessionId, clearCart, router]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600" aria-hidden />
      <h1 className="mt-4 text-xl font-bold text-foreground md:text-2xl">
        Payment Successful!
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
        Your order is being processed.
      </p>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Finalizing your order…
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Redirecting to home in 3 seconds…
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Go home now
      </Link>
    </Container>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[40vh] items-center justify-center px-4 py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </Container>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
