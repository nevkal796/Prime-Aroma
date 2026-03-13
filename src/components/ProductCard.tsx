"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600' fill='none'%3E%3Crect width='400' height='600' fill='%23e8e4de'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='16' fill='%230a1628' opacity='0.3'%3EPRIME AROMA%3C/text%3E%3C/svg%3E";

function formatScentNotes(description: string | null): string {
  if (!description || !description.trim()) return "";
  return description
    .split(/[,·|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" · ");
}

type Props = { product: Product; variant?: "default" | "glass" };

export default function ProductCard({ product, variant = "default" }: Props) {
  const imageUrl = product.image_url || PLACEHOLDER_IMAGE;
  const scentNotes = formatScentNotes(product.description);
  const typeLabel = product.brand || "Eau de Parfum";
  const isGlass = variant === "glass";

  return (
    <article
      className={`group flex flex-col ${isGlass ? "rounded-2xl bg-white/10 p-4 backdrop-blur-sm" : ""}`}
    >
      <Link
        href={`/products/${product.id}`}
        className={`cursor-pointer block aspect-[3/4] w-full overflow-hidden ${isGlass ? "rounded-lg bg-white/5" : "bg-[#e8e4de]"}`}
        aria-label={`View ${product.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 pt-5">
        <span
          className={`font-sans text-[10px] font-medium uppercase tracking-widest sm:text-xs ${isGlass ? "text-[#EDE8D0]" : "text-[#c9a84c]"}`}
        >
          {typeLabel}
        </span>
        <Link href={`/products/${product.id}`} className="cursor-pointer mt-1">
          <h2
            className={`font-serif text-2xl font-medium sm:text-3xl ${isGlass ? "text-white" : "text-[#0a1628]"}`}
          >
            {product.name}
          </h2>
        </Link>
        {product.size && (
          <p
            className={`mt-0.5 font-sans text-xs font-semibold uppercase tracking-widest sm:text-sm ${isGlass ? "text-[#EDE8D0]" : "text-[#0a1628]"}`}
            aria-label={`Volume: ${product.size}`}
          >
            {product.size}
          </p>
        )}
        {scentNotes && (
          <p
            className={`mt-1 font-sans text-xs sm:text-sm ${isGlass ? "text-white/80" : "text-[#0a1628]/70"}`}
          >
            {scentNotes}
          </p>
        )}
        <p
          className={`mt-3 font-sans text-sm font-medium ${isGlass ? "text-white" : "text-[#0a1628]"}`}
        >
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </article>
  );
}
