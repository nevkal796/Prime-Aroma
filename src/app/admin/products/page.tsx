import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import AdminProductForm from "./AdminProductForm";
import AdminProductRow from "./AdminProductRow";

const ADMIN_COOKIE = "admin_session";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value !== "1") {
    redirect("/admin/login");
  }

  const supabase = await createServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, stock, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#EDE8D0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-2xl font-medium text-[#0a1628]">
            Products
          </h1>
          <Link
            href="/"
            className="font-sans text-xs uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
          >
            ← Store
          </Link>
        </div>

        <AdminProductForm />

        <section className="mt-12">
          <h2 className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
            Existing products ({products?.length ?? 0})
          </h2>
          {!products?.length ? (
            <p className="mt-4 font-sans text-sm text-[#0a1628]/70">
              No products yet. Add one above.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#0a1628]/15">
              {products.map((p) => (
                <AdminProductRow key={p.id} product={p} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
