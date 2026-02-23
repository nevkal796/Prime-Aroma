"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    size: "",
    brand: "",
    top_notes: "",
    middle_notes: "",
    base_notes: "",
    key_notes: "",
    fragrance_family: "",
    scent_type: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const price = parseFloat(form.price);
      if (Number.isNaN(price) || price < 0) {
        setError("Enter a valid price.");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("description", form.description);
      formData.set("price", String(price));
      formData.set("stock", form.stock);
      formData.set("size", form.size);
      formData.set("brand", form.brand);
      formData.set("top_notes", form.top_notes);
      formData.set("middle_notes", form.middle_notes);
      formData.set("base_notes", form.base_notes);
      formData.set("key_notes", form.key_notes);
      formData.set("fragrance_family", form.fragrance_family);
      formData.set("scent_type", form.scent_type);
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formData.set("image", file);
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add product");
        return;
      }
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "0",
        size: "",
        brand: "",
        top_notes: "",
        middle_notes: "",
        base_notes: "",
        key_notes: "",
        fragrance_family: "",
        scent_type: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded border border-[#0a1628]/15 bg-[#EDE8D0] p-6">
      <h2 className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
        Add product
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Description (scent notes, e.g. Oud · Amber · Leather)
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
          />
        </div>
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            required
          />
        </div>
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Stock
          </label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
          />
        </div>
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Size
          </label>
          <input
            type="text"
            value={form.size}
            onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="e.g. 100ml"
          />
        </div>
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Brand
          </label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="e.g. PRIME AROMA"
          />
        </div>
        <div className="sm:col-span-2">
          <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
            Scent / Fragrance pyramid
          </p>
          <p className="mt-1 font-sans text-xs text-[#0a1628]/60">
            Optional. Comma-separated. Pyramid shows only when top, middle, and base notes are all filled.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Key notes (e.g. Mint - Orange Blossom - Vanilla)
          </label>
          <input
            type="text"
            value={form.key_notes}
            onChange={(e) => setForm((f) => ({ ...f, key_notes: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="Mint, Orange Blossom, Vanilla"
          />
        </div>
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Fragrance family
          </label>
          <input
            type="text"
            value={form.fragrance_family}
            onChange={(e) => setForm((f) => ({ ...f, fragrance_family: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="e.g. Warm & Spicy"
          />
        </div>
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Scent type
          </label>
          <input
            type="text"
            value={form.scent_type}
            onChange={(e) => setForm((f) => ({ ...f, scent_type: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="e.g. Cool Spices"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Top notes (comma separated)
          </label>
          <input
            type="text"
            value={form.top_notes}
            onChange={(e) => setForm((f) => ({ ...f, top_notes: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="e.g. Mint, Green Apple, Lemon"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Middle notes (comma separated)
          </label>
          <input
            type="text"
            value={form.middle_notes}
            onChange={(e) => setForm((f) => ({ ...f, middle_notes: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="e.g. Orange Blossom, Jasmine"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Base notes (comma separated)
          </label>
          <input
            type="text"
            value={form.base_notes}
            onChange={(e) => setForm((f) => ({ ...f, base_notes: e.target.value }))}
            className="mt-1 min-h-[44px] w-full border border-[#0a1628]/30 bg-transparent px-3 font-sans text-[#0a1628]"
            placeholder="e.g. Vanilla, Musk, Sandalwood"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Image (file upload)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="mt-1 w-full font-sans text-sm text-[#0a1628] file:mr-3 file:min-h-[44px] file:border-0 file:bg-[#0a1628] file:px-4 file:font-sans file:text-[10px] file:uppercase file:tracking-widest file:text-[#EDE8D0]"
          />
          <p className="mt-1 font-sans text-xs text-[#0a1628]/60">
            Optional. JPG, PNG, WebP, etc. Stored in Supabase Storage.
          </p>
        </div>
      </div>
      {error && (
        <p className="font-sans text-sm text-red-700">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="min-h-[44px] w-full bg-[#0a1628] font-sans text-xs font-medium uppercase tracking-widest text-[#EDE8D0] disabled:opacity-70 sm:w-auto sm:px-8"
      >
        {loading ? "Adding…" : "Add product"}
      </button>
    </form>
  );
}
