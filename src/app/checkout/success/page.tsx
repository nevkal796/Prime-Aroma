"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-[#0a1628] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#c9a84c] text-[#c9a84c] sm:h-16 sm:w-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="mt-8 font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a84c] sm:text-xs">
          Order Confirmed
        </p>
        <h1 className="mt-4 font-serif text-3xl font-medium text-[#EDE8D0] sm:text-4xl">
          Thank you for your order
        </h1>
        <p className="mt-6 font-sans text-sm leading-relaxed text-[#EDE8D0]/80">
          We&apos;ll send a confirmation email shortly. Your signature scent is on its way.
        </p>
        <Link
          href="/"
          className="mt-12 inline-flex min-h-[44px] items-center justify-center border border-[#EDE8D0] px-10 font-sans text-[10px] font-medium uppercase tracking-widest text-[#EDE8D0] hover:bg-[#EDE8D0] hover:text-[#0a1628] sm:text-xs"
        >
          Continue shopping →
        </Link>
      </div>
    </main>
  );
}
