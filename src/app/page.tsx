import { createServerClient } from "@/lib/supabase";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Philosophy from "@/components/Philosophy";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createServerClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error);
    return (
      <main className="min-h-[50vh] px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center font-sans text-sm text-[#0a1628]/80">
          Unable to load products. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Product grid: cream, OUR COLLECTION */}
      <section id="collection" className="bg-[#EDE8D0] py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#0a1628]/90 sm:text-xs">
            Our Collection
          </h2>
          <div className="mt-12 sm:mt-16">
            <ProductGrid products={products ?? []} />
          </div>
        </div>
      </section>

      <Philosophy />
      <Newsletter />
      <Footer />
    </main>
  );
}
