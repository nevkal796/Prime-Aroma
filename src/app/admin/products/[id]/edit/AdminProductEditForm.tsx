"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  background_image_url: string | null;
  stock: number;
  size: string | null;
  brand: string | null;
  top_notes: string | null;
  middle_notes: string | null;
  base_notes: string | null;
  key_notes: string | null;
  fragrance_family: string | null;
  scent_type: string | null;
  seasons: string[] | null;
};

export default function AdminProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [removeBackgroundImage, setRemoveBackgroundImage] = useState(false);
  const SEASON_OPTIONS = [
    { key: "winter", label: "Winter" },
    { key: "spring", label: "Spring" },
    { key: "summer", label: "Summer" },
    { key: "fall", label: "Fall" },
  ] as const;
  const [form, setForm] = useState({
    name: product.name,
    description: product.description ?? "",
    price: String(product.price),
    stock: String(product.stock),
    size: product.size ?? "",
    brand: product.brand ?? "",
    top_notes: product.top_notes ?? "",
    middle_notes: product.middle_notes ?? "",
    base_notes: product.base_notes ?? "",
    key_notes: product.key_notes ?? "",
    fragrance_family: product.fragrance_family ?? "",
    scent_type: product.scent_type ?? "",
  });
  const [seasons, setSeasons] = useState<string[]>(
    Array.isArray(product.seasons)
      ? product.seasons.map((s) => String(s).toLowerCase())
      : []
  );

  function toggleSeason(key: string) {
    setSeasons((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  }

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
      formData.set("id", product.id);
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
      formData.set("seasons", JSON.stringify(seasons));
      if (removeImage) {
        formData.set("removeImage", "1");
      }
      if (removeBackgroundImage) {
        formData.set("removeBackgroundImage", "1");
      }
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formData.set("image", file);
      }
      const bgFile = bgFileInputRef.current?.files?.[0];
      if (bgFile) {
        formData.set("background_image", bgFile);
      }

      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update product");
        return;
      }
      router.refresh();
      router.push("/admin/products");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded border border-[#0a1628]/15 bg-[#EDE8D0] p-6">
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
            Description (scent notes)
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
            Optional. Pyramid shows only when top, middle, and base notes are all filled.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Key notes
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
          <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
            Seasons
          </p>
          <p className="mt-1 font-sans text-xs text-[#0a1628]/60">
            Optional. Choose one or more seasons this fragrance fits.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SEASON_OPTIONS.map(({ key, label }) => {
              const active = seasons.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSeason(key)}
                  className={`rounded-full border px-3 py-1 font-sans text-[10px] uppercase tracking-widest transition-colors ${
                    active
                      ? "border-[#0a1628] bg-[#0a1628] text-[#EDE8D0]"
                      : "border-[#0a1628]/30 bg-transparent text-[#0a1628]/70 hover:bg-[#0a1628]/5"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
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
            Image
          </label>
          {product.image_url && !removeImage && (
            <div className="mt-1 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt=""
                className="h-24 w-24 object-cover border border-[#0a1628]/20"
              />
              <label className="flex items-center gap-2 font-sans text-sm text-[#0a1628]/80">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                  className="h-4 w-4"
                />
                Remove image
              </label>
            </div>
          )}
          <p className="mt-2 font-sans text-xs text-[#0a1628]/60">
            Replace with new file (optional):
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="mt-1 w-full font-sans text-sm text-[#0a1628] file:mr-3 file:min-h-[44px] file:border-0 file:bg-[#0a1628] file:px-4 file:font-sans file:text-[10px] file:uppercase file:tracking-widest file:text-[#EDE8D0]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80">
            Background image (optional)
          </label>
          {product.background_image_url && !removeBackgroundImage && (
            <div className="mt-1 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.background_image_url}
                alt=""
                className="h-16 w-24 object-cover border border-[#0a1628]/20"
              />
              <label className="flex items-center gap-2 font-sans text-sm text-[#0a1628]/80">
                <input
                  type="checkbox"
                  checked={removeBackgroundImage}
                  onChange={(e) => setRemoveBackgroundImage(e.target.checked)}
                  className="h-4 w-4"
                />
                Remove background image
              </label>
            </div>
          )}
          <p className="mt-2 font-sans text-xs text-[#0a1628]/60">
            Replace or add (optional): full-screen background on product page.
          </p>
          <input
            ref={bgFileInputRef}
            type="file"
            accept="image/*"
            className="mt-1 w-full font-sans text-sm text-[#0a1628] file:mr-3 file:min-h-[44px] file:border-0 file:bg-[#0a1628] file:px-4 file:font-sans file:text-[10px] file:uppercase file:tracking-widest file:text-[#EDE8D0]"
          />
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
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
