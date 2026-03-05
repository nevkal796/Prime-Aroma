"use client";

import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type Props = { products: Product[]; variant?: "default" | "glass" };

export default function ProductGrid({ products, variant = "default" }: Props) {
  const isGlass = variant === "glass";

  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <p
          className={`font-sans text-xs uppercase tracking-widest ${isGlass ? "text-white/80" : "text-[#0a1628]/70"}`}
        >
          No products yet
        </p>
        <p
          className={`max-w-sm font-sans text-sm ${isGlass ? "text-white/70" : "text-[#0a1628]/80"}`}
        >
          Check back soon for our curated selection.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
