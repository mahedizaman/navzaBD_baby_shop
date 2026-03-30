"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <XCircle className="h-16 w-16 text-destructive" aria-hidden />
      <h1 className="mt-4 text-xl font-bold text-foreground md:text-2xl">
        Payment Failed!
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
        {reason === "cancelled"
          ? "You cancelled the payment."
          : "Please try again."}
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/checkout">Try Again</Link>
      </Button>
      <Link
        href="/"
        className="mt-4 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Back to home
      </Link>
    </Container>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[40vh] items-center justify-center px-4 py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </Container>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
