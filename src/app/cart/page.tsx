"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 400 400' fill='none'%3E%3Crect width='400' height='400' fill='%23e8e4de'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='14' fill='%230a1628' opacity='0.3'%3EPRIME AROMA%3C/text%3E%3C/svg%3E";

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#EDE8D0] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs uppercase tracking-widest text-[#0a1628]/70">
            Your cart is empty
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center border border-[#0a1628] px-8 font-sans text-xs font-medium uppercase tracking-widest text-[#0a1628] hover:bg-[#0a1628] hover:text-[#EDE8D0]"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EDE8D0] pb-32 md:pb-16">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-center font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#0a1628] sm:text-xs">
          Your Cart
        </h1>

        <ul className="mt-12 divide-y divide-[#0a1628]/15">
          {cartItems.map((item) => (
            <li key={item.id} className="flex gap-5 py-6 first:pt-0 sm:gap-8 sm:py-8">
              <div className="h-28 w-28 flex-shrink-0 overflow-hidden bg-[#e8e4de] sm:h-32 sm:w-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url || PLACEHOLDER_IMAGE}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg font-medium text-[#0a1628] sm:text-xl">
                  {item.name}
                </p>
                {item.size && (
                  <p className="mt-0.5 font-sans text-xs text-[#0a1628]/70">
                    {item.size}
                  </p>
                )}
                <p className="mt-2 font-sans text-sm font-medium text-[#0a1628]">
                  ${item.price.toFixed(2)}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center border border-[#0a1628]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-[#0a1628] hover:bg-[#0a1628]/5"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-[2.5ch] text-center font-sans text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-[#0a1628] hover:bg-[#0a1628]/5"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-lg text-[#0a1628]/70 hover:text-[#0a1628]"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t border-[#0a1628]/15 pt-8">
          <div className="flex justify-between font-sans">
            <span className="text-xs uppercase tracking-widest text-[#0a1628]/80">
              Subtotal
            </span>
            <span className="text-xl font-medium text-[#0a1628]">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center md:justify-end">
          <div className="hidden w-full max-w-md md:block">
            <CartCheckoutButton />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#0a1628]/10 bg-[#EDE8D0] p-4 md:hidden">
        <div className="mx-auto max-w-4xl">
          <CartCheckoutButton />
        </div>
      </div>
    </main>
  );
}

function CartCheckoutButton() {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url,
          })),
          user_id: user?.id ?? undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Checkout failed");
    } catch (e) {
      console.error(e);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-3 flex justify-between font-sans md:hidden">
        <span className="text-xs uppercase tracking-widest text-[#0a1628]/80">
          Subtotal
        </span>
        <span className="font-medium text-[#0a1628]">
          ${cartTotal.toFixed(2)}
        </span>
      </div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || cartItems.length === 0}
        className="flex w-full min-h-[44px] items-center justify-center bg-[#0a1628] font-sans text-xs font-medium uppercase tracking-widest text-[#EDE8D0] disabled:opacity-70"
      >
        {loading ? "Redirecting…" : "Proceed to checkout"}
      </button>
    </>
  );
}
