"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="bg-[#f5f0e8] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a84c] sm:text-xs">
          Stay Connected
        </p>
        <h2 className="mt-4 font-serif text-3xl font-medium text-[#0a1628] sm:text-4xl">
          Join the Prime Aroma Family
        </h2>
        <p className="mt-4 font-sans text-sm text-[#0a1628]/60">
          Be the first to know about new decants, exclusive offers, and the art
          behind our fragrances.
        </p>
        {submitted ? (
          <p className="mt-8 font-sans text-sm font-medium text-[#0a1628]">
            Thank you for subscribing!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="min-h-[44px] w-full rounded-l border border-[#0a1628] bg-[#EDE8D0] px-4 font-sans text-[#0a1628] placeholder:text-[#0a1628]/60 sm:max-w-xs sm:rounded-r-none sm:border-r-0"
              required
            />
            <button
              type="submit"
              className="min-h-[44px] w-full rounded-r bg-[#0a1628] px-8 font-sans text-[10px] font-medium uppercase tracking-widest text-[#EDE8D0] sm:w-auto sm:rounded-l-none"
            >
              Subscribe →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
