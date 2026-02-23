"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

type Props = { product: Product };

export default function AddToCartBlock({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const maxQty = Math.max(1, product.stock);
  const outOfStock = product.stock < 1;

  const handleAdd = () => {
    addToCart(product, quantity);
  };

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
              className="flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-[#0a1628] hover:bg-[#0a1628]/5"
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
              className="flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-[#0a1628] hover:bg-[#0a1628]/5"
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
        disabled={outOfStock}
        className="w-full min-h-[44px] bg-[#0a1628] font-sans text-xs font-medium uppercase tracking-widest text-[#EDE8D0] disabled:bg-[#0a1628]/40 disabled:text-[#EDE8D0]/70"
        aria-label={outOfStock ? "Out of stock" : `Add ${quantity} to cart`}
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
