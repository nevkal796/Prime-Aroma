import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import AddToCartBlock from "@/components/AddToCartBlock";
import FragrancePyramid from "@/components/FragrancePyramid";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600' fill='none'%3E%3Crect width='400' height='600' fill='%23e8e4de'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='16' fill='%230a1628' opacity='0.3'%3EPRIME AROMA%3C/text%3E%3C/svg%3E";

function formatScentNotes(description: string | null): string {
  if (!description || !description.trim()) return "";
  return description
    .split(/[,·|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" · ");
}

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  const imageUrl = product.image_url || PLACEHOLDER_IMAGE;
  const bgImageUrl = product.background_image_url?.trim() || null;
  const scentNotes = formatScentNotes(product.description);
  const keyNotesList: string[] = product.key_notes
    ? (product.key_notes as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const hasPyramid =
    product.top_notes?.trim() &&
    product.middle_notes?.trim() &&
    product.base_notes?.trim();

  return (
    <main className="relative min-h-screen pb-28 md:pb-12">
      {bgImageUrl ? (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              backgroundAttachment: "fixed",
            }}
            aria-hidden
          />
          <div className="fixed inset-0 z-0 bg-[#0a1628]/70" aria-hidden />
        </>
      ) : (
        <div className="fixed inset-0 z-0 bg-[#EDE8D0]" aria-hidden />
      )}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`cursor-pointer inline-block min-h-[44px] min-w-[44px] py-3 font-sans text-[10px] uppercase tracking-widest sm:mb-4 ${bgImageUrl ? "text-[#f5f0e8]/90 hover:text-[#f5f0e8]" : "text-[#0a1628]/80 hover:text-[#0a1628]"}`}
        >
          ← Back
        </Link>

        <div className={`grid gap-10 lg:grid-cols-2 lg:gap-16 ${bgImageUrl ? "rounded-lg bg-[#f5f0e8]/10 p-6 backdrop-blur-sm" : ""}`}>
          <div className={`aspect-[3/4] w-full overflow-hidden ${bgImageUrl ? "bg-white/10 backdrop-blur-sm" : "bg-[#e8e4de]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#c9a84c] sm:text-xs">
              {product.brand || "Eau de Parfum"}
            </span>
            <h1 className={`mt-2 font-serif text-3xl font-medium sm:text-4xl md:text-5xl ${bgImageUrl ? "text-[#f5f0e8]" : "text-[#0a1628]"}`}>
              {product.name}
            </h1>
            {product.size && (
              <p
                className={`mt-2 font-sans text-sm font-semibold uppercase tracking-widest sm:text-base ${bgImageUrl ? "text-[#c9a84c]" : "text-[#0a1628]"}`}
                aria-label={`Volume: ${product.size}`}
              >
                {product.size}
              </p>
            )}
            {scentNotes && (
              <p className={`mt-3 font-sans text-sm ${bgImageUrl ? "text-[#f5f0e8]/90" : "text-[#0a1628]/80"}`}>
                {scentNotes}
              </p>
            )}

            {/* Key notes bar: pills + fragrance_family / scent_type badges */}
            {(keyNotesList.length > 0 || product.fragrance_family || product.scent_type) && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {keyNotesList.map((note) => (
                  <span
                    key={note}
                    className={bgImageUrl ? "rounded-full border border-[#c9a84c]/50 bg-white/10 px-3 py-1 font-sans text-xs text-[#f5f0e8] backdrop-blur-sm" : "rounded-full border border-[#0a1628] bg-[#EDE8D0] px-3 py-1 font-sans text-xs text-[#0a1628]"}
                  >
                    {note}
                  </span>
                ))}
                {product.fragrance_family && (
                  <span className={bgImageUrl ? "rounded border border-[#c9a84c]/30 bg-white/10 px-2 py-1 font-sans text-[10px] uppercase tracking-widest text-[#f5f0e8]/90 backdrop-blur-sm" : "rounded border border-[#0a1628]/30 bg-[#EDE8D0]/80 px-2 py-1 font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80"}>
                    <span className={bgImageUrl ? "font-medium text-[#c9a84c]" : "font-medium text-[#0a1628]/60"}>Family:</span>{" "}
                    {product.fragrance_family}
                  </span>
                )}
                {product.scent_type && (
                  <span className={bgImageUrl ? "rounded border border-[#c9a84c]/30 bg-white/10 px-2 py-1 font-sans text-[10px] uppercase tracking-widest text-[#f5f0e8]/90 backdrop-blur-sm" : "rounded border border-[#0a1628]/30 bg-[#EDE8D0]/80 px-2 py-1 font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80"}>
                    <span className={bgImageUrl ? "font-medium text-[#c9a84c]" : "font-medium text-[#0a1628]/60"}>Type:</span>{" "}
                    {product.scent_type}
                  </span>
                )}
              </div>
            )}

            <p className={`mt-6 font-serif text-2xl font-medium sm:text-3xl ${bgImageUrl ? "text-[#c9a84c]" : "text-[#0a1628]"}`}>
              ${Number(product.price).toFixed(2)}
            </p>

            <p className={`mt-4 font-sans text-[10px] uppercase tracking-widest ${bgImageUrl ? "text-[#f5f0e8]/80" : "text-[#0a1628]/70"}`}>
              {product.stock < 1
                ? "Out of stock"
                : `In stock — ${product.stock} decant${product.stock === 1 ? "" : "s"} available`}
            </p>

            <div className="mt-10 hidden md:block">
              <AddToCartBlock product={product} />
            </div>

            {/* Fragrance pyramid: below Add to Cart, only when top/middle/base notes exist */}
            {hasPyramid && (
              <div className="mt-10">
                <FragrancePyramid
                  topNotes={product.top_notes!.trim()}
                  middleNotes={product.middle_notes!.trim()}
                  baseNotes={product.base_notes!.trim()}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile: fixed bottom add-to-cart */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#0a1628]/10 bg-[#EDE8D0] p-4 md:hidden">
          <AddToCartBlock product={product} />
        </div>
      </div>
    </main>
  );
}
