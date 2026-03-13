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
            className="cursor-pointer mt-8 inline-flex min-h-[44px] items-center justify-center border border-[#0a1628] px-8 font-sans text-xs font-medium uppercase tracking-widest text-[#0a1628] hover:bg-[#0a1628] hover:text-[#EDE8D0]"
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
                      className="cursor-pointer flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-[#0a1628] hover:bg-[#0a1628]/5"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="cursor-pointer flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-lg text-[#0a1628]/70 hover:text-[#0a1628]"
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
  const { user, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const userId = (user as any)?.id as string | undefined;

  const handleCheckout = async () => {
    if (!userId) {
      setShowSignInPrompt(true);
      return;
    }
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
          user_id: userId,
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
        className="cursor-pointer flex w-full min-h-[44px] items-center justify-center bg-[#0a1628] font-sans text-xs font-medium uppercase tracking-widest text-[#EDE8D0] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting…" : "Proceed to checkout"}
      </button>

      {showSignInPrompt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1628]/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sign-in-prompt-title"
        >
          <div
            className="cursor-pointer absolute inset-0"
            onClick={() => setShowSignInPrompt(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm rounded-lg bg-[#0a1628] p-6 text-[#EDE8D0] shadow-xl">
            <button
              type="button"
              onClick={() => setShowSignInPrompt(false)}
              className="cursor-pointer absolute right-3 top-3 text-[#EDE8D0]/70 hover:text-[#EDE8D0]"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <h2 id="sign-in-prompt-title" className="font-serif text-lg font-medium text-[#EDE8D0]">
              Please sign in to complete your purchase
            </h2>
            <p className="mt-3 font-sans text-sm text-[#EDE8D0]/80">
              Sign in with your Google account to proceed to checkout.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSignInPrompt(false);
                signInWithGoogle();
              }}
              className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-[#EDE8D0]/30 bg-[#EDE8D0] py-3 font-sans text-sm font-medium text-[#0a1628] hover:bg-[#EDE8D0]/90"
            >
              <GoogleIcon />
              Sign In with Google
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
