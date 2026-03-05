"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number | null;
  display_order?: number | null;
  created_at?: string;
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

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-grab text-[#0a1628]/40 hover:text-[#0a1628]/70 active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
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
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
        >
          Edit
        </Link>
        <Link
          href={`/products/${product.id}`}
          className="font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
        >
          View
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="font-sans text-[10px] uppercase tracking-widest text-red-700 hover:text-red-800 disabled:opacity-70"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
