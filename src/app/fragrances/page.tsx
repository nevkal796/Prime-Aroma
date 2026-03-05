import { createServerClient } from "@/lib/supabase";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 60;

export default async function FragrancesPage() {
  const supabase = await createServerClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch products:", error);
    return (
      <main className="min-h-[50vh] px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center font-sans text-sm text-[#0a1628]/80">
          Unable to load fragrances. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EDE8D0]">
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#0a1628]/90 sm:text-xs">
            All Fragrances
          </h1>
          <div className="mt-12 sm:mt-16">
            <ProductGrid products={products ?? []} />
          </div>
        </div>
      </section>
    </main>
  );
}

