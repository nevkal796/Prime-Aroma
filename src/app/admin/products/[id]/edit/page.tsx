import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import AdminProductEditForm from "./AdminProductEditForm";

const ADMIN_COOKIE = "admin_session";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value !== "1") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const supabase = await createServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  return (
    <main className="min-h-screen bg-[#EDE8D0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-2xl font-medium text-[#0a1628]">
            Edit product
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href={`/products/${product.id}`}
              className="font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
            >
              View on store
            </Link>
            <Link
              href="/admin/products"
              className="font-sans text-[10px] uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
            >
              ← Products
            </Link>
          </div>
        </div>

        <AdminProductEditForm product={product} />
      </div>
    </main>
  );
}
