"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { orderId: string };

export default function MarkFulfilledButton({ orderId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch {
      alert("Failed to mark as fulfilled. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="cursor-pointer rounded border border-[#0a1628] bg-[#0a1628] px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-widest text-[#EDE8D0] hover:bg-[#0a1628]/90 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Updating…" : "Mark as Fulfilled"}
    </button>
  );
}
