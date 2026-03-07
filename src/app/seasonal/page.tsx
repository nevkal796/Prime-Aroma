"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";

type SeasonKey = "winter" | "spring" | "summer" | "fall";

const SEASON_BG: Record<SeasonKey, string> = {
  winter:
    "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80",
  spring:
    "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1920&q=80",
  summer:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  fall: 
    "https://images.unsplash.com/photo-1741030705526-946e97d1a3b1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const SEASON_OVERLAY: Record<SeasonKey, string> = {
  winter: "bg-blue-950/60",
  spring: "bg-pink-950/40",
  summer: "bg-amber-950/50",
  fall: "bg-orange-950/55",
};

const SEASONS: {
  key: SeasonKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "winter", label: "Winter", icon: Snowflake },
  { key: "spring", label: "Spring", icon: Flower2 },
  { key: "summer", label: "Summer", icon: Sun },
  { key: "fall", label: "Fall", icon: Leaf },
];

function getCurrentSeason(): SeasonKey {
  const month = new Date().getMonth();
  if (month === 11 || month <= 1) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "fall";
}

export default function SeasonalCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(getCurrentSeason);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("display_order", { ascending: true });
        if (!isMounted) return;
        if (error) {
          console.error("Failed to fetch seasonal products:", error);
          setError("Unable to load products. Please try again later.");
        } else {
          setProducts((data ?? []) as Product[]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch seasonal products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const season = activeSeason;
    return products.filter((p) => {
      const seasons = Array.isArray(p.seasons) ? p.seasons : [];
      return seasons.map((s) => String(s).toLowerCase()).includes(season);
    });
  }, [products, activeSeason]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Full-screen background layer (z-0) */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSeason}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={SEASON_BG[activeSeason]}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Season overlay on top of background */}
        <div
          className={`absolute inset-0 ${SEASON_OVERLAY[activeSeason]}`}
          aria-hidden
        />
      </div>

      {/* Content above background (z-10) */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-white/95 sm:text-xs">
            Seasonal Catalog
          </h1>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {SEASONS.map(({ key, label, icon: Icon }) => {
              const isActive = key === activeSeason;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSeason(key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans text-[10px] uppercase tracking-widest transition-colors sm:text-xs ${
                    isActive
                      ? "border-white bg-white text-gray-900"
                      : "border-white bg-transparent text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-12 sm:mt-16 rounded-3xl bg-white/5 py-10 backdrop-blur-sm sm:py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {loading ? (
                <p className="text-center font-sans text-sm text-white/90">
                  Loading fragrances…
                </p>
              ) : error ? (
                <p className="text-center font-sans text-sm text-red-200">
                  {error}
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center font-sans text-sm text-white/80">
                  No fragrances in this season yet.
                </p>
              ) : (
                <ProductGrid products={filteredProducts} variant="glass" />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
