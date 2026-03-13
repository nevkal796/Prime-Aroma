"use client";

import { useState, useCallback, useEffect } from "react";
import { Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

type Props = { product: Product };

export default function AddToCartBlock({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const maxQty = Math.max(1, product.stock);
  const outOfStock = product.stock < 1;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = useCallback(() => {
    if (outOfStock || added) return;
    addToCart(product, quantity);
    setAdded(true);
  }, [addToCart, product, quantity, outOfStock, added]);

  return (
    <div className="flex flex-col gap-6">
      {!outOfStock && (
        <div className="flex items-center gap-4">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/70">
            Quantity
          </span>
          <div className="flex items-center border border-[#0a1628]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="cursor-pointer flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-[#0a1628] hover:bg-[#0a1628]/5 transition-all duration-300"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[3ch] text-center font-sans text-sm font-medium text-[#0a1628]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              className="cursor-pointer flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-[#0a1628] hover:bg-[#0a1628]/5 transition-all duration-300"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock || added}
        className={`cursor-pointer w-full min-h-[44px] font-sans text-xs font-medium uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
          outOfStock
            ? "bg-[#0a1628]/40 text-[#EDE8D0]/70"
            : added
              ? "bg-[#0a1628]/60 text-[#EDE8D0]"
              : "bg-[#0a1628] text-[#EDE8D0] hover:bg-[#0a1628]/90"
        }`}
        aria-label={outOfStock ? "Out of stock" : added ? "Added to cart" : `Add ${quantity} to cart`}
      >
        {outOfStock ? "Out of stock" : added ? (
          <>
            <Check className="h-4 w-4 shrink-0" />
            ADDED TO CART
          </>
        ) : (
          "Add to cart"
        )}
      </button>
    </div>
  );
}
