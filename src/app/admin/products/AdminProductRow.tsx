"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600' fill='none'%3E%3Crect width='400' height='600' fill='%23e8e4de'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='16' fill='%230a1628' opacity='0.3'%3EPRIME AROMA%3C/text%3E%3C/svg%3E";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number | null;
  display_order?: number | null;
  created_at?: string;
  image_url?: string | null;
  brand?: string | null;
};

export default function AdminProductRow({
  product,
  index,
  total,
}: {
  product: Product;
  index: number;
  total: number;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    boxShadow: isDragging ? "0 10px 25px rgba(15,23,42,0.25)" : undefined,
  };

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(product.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const imageUrl = product.image_url || PLACEHOLDER_IMAGE;

  const dragHandle = (
    <button
      type="button"
      className="touch-none shrink-0 cursor-grab self-start rounded p-2 text-[#0a1628]/40 active:cursor-grabbing active:bg-[#0a1628]/10 md:self-center md:p-1"
      style={{ touchAction: "none" }}
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-6 w-6 min-w-[24px] md:h-4 md:w-4 md:min-w-0" />
    </button>
  );

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
    >
      <div className="flex w-full gap-3">
        {dragHandle}
        <div className="min-w-0 flex-1">
          {/* Mobile card layout */}
          <div className="flex flex-col gap-3 rounded-lg border border-[#0a1628]/15 bg-[#0a1628]/[0.03] p-3 md:hidden">
            <div className="flex gap-3">
              <img
                src={imageUrl}
                alt=""
                className="h-20 w-16 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.id}`}
                  className="cursor-pointer font-serif font-medium text-[#0a1628] hover:underline"
                >
                  {product.name}
                </Link>
                {(product.brand ?? "").trim() && (
                  <p className="font-sans text-xs text-[#0a1628]/70">
                    {product.brand}
                  </p>
                )}
                <p className="font-sans text-sm text-[#0a1628]/70">
                  ${Number(product.price).toFixed(2)}
                  {product.stock != null && ` · ${product.stock} in stock`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-[#0a1628]/10 pt-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="cursor-pointer font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
              >
                Edit
              </Link>
              <Link
                href={`/products/${product.id}`}
                className="cursor-pointer font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
              >
                View
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="cursor-pointer font-sans text-[10px] uppercase tracking-widest text-red-700 hover:text-red-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>

          {/* Desktop row layout */}
          <div className="hidden md:flex md:flex-wrap md:items-center md:justify-between md:gap-2">
            <div>
              <Link
                href={`/products/${product.id}`}
                className="font-serif font-medium text-[#0a1628] hover:underline"
              >
                {product.name}
              </Link>
              <p className="font-sans text-sm text-[#0a1628]/70">
                ${Number(product.price).toFixed(2)}
                {product.stock != null && ` · ${product.stock} in stock`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="cursor-pointer font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
              >
                Edit
              </Link>
              <Link
                href={`/products/${product.id}`}
                className="cursor-pointer font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
              >
                View
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="cursor-pointer font-sans text-[10px] uppercase tracking-widest text-red-700 hover:text-red-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
