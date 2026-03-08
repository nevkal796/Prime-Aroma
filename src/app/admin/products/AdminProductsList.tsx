"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import AdminProductRow from "./AdminProductRow";

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

type Props = {
  initialProducts: Product[];
};

export default function AdminProductsList({ initialProducts }: Props) {
  const [items, setItems] = useState<Product[]>(() => [...initialProducts]);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    // Persist new display_order based on array index
    const payload = reordered.map((p, index) => ({
      id: p.id,
      display_order: index,
    }));

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // eslint-disable-next-line no-alert
        alert(data.error || "Failed to save new order");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!items.length) {
    return (
      <p className="mt-4 font-sans text-sm text-[#0a1628]/70">
        No products yet. Add one above.
      </p>
    );
  }

  // On the server and during the first client render, render a static list
  // so that SSR markup matches and avoids hydration mismatches from dnd-kit.
  if (!isClient) {
    return (
      <ul className="mt-4 divide-y divide-[#0a1628]/15">
        {items.map((p, index) => (
          <AdminProductRow
            key={p.id}
            product={p}
            index={index}
            total={items.length}
          />
        ))}
      </ul>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <ul className="mt-4 divide-y divide-[#0a1628]/15">
          {items.map((p, index) => (
            <AdminProductRow
              key={p.id}
              product={p}
              index={index}
              total={items.length}
            />
          ))}
        </ul>
      </SortableContext>
      {saving && (
        <p className="mt-2 text-xs font-sans text-[#0a1628]/60">
          Saving order…
        </p>
      )}
    </DndContext>
  );
}

