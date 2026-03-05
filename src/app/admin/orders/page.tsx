import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import MarkFulfilledButton from "./MarkFulfilledButton";

const ADMIN_COOKIE = "admin_session_v2";

type OrderRow = {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string | null;
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
  fulfilled: boolean;
  created_at: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatItems(items: { name: string; quantity: number }[]): string {
  return items
    .map((i) => `${i.name} × ${i.quantity}`)
    .join(", ");
}

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value !== "1") {
    redirect("/admin/login");
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, stripe_session_id, customer_email, customer_name, items, total, status, fulfilled, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
    return (
      <main className="min-h-screen bg-[#EDE8D0] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-sans text-sm text-[#0a1628]/80">
            Failed to load orders. Try again later.
          </p>
        </div>
      </main>
    );
  }

  const rows = (orders ?? []) as OrderRow[];

  return (
    <main className="min-h-screen bg-[#EDE8D0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-2xl font-medium text-[#0a1628]">
            Orders
          </h1>
          <Link
            href="/"
            className="font-sans text-xs uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628]"
          >
            ← Store
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className="mt-8 font-sans text-sm text-[#0a1628]/70">
            No orders yet.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-lg border border-[#0a1628]/15">
            <table className="w-full min-w-[800px] border-collapse font-sans text-sm text-[#0a1628]">
              <thead>
                <tr className="border-b border-[#0a1628]/15 bg-[#0a1628]/5">
                  <th className="px-4 py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Items
                  </th>
                  <th className="px-4 py-3 text-right font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80">
                    Fulfilled
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#0a1628]/10 hover:bg-[#0a1628]/[0.03]"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#0a1628]/80">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      {order.customer_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#0a1628]/90">
                      {order.customer_email}
                    </td>
                    <td className="px-4 py-3 text-[#0a1628]/80">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="max-w-[220px] px-4 py-3 text-[#0a1628]/80">
                      {formatItems(order.items)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 capitalize text-[#0a1628]/80">
                      {order.status}
                    </td>
                    <td className="px-4 py-3">
                      {order.fulfilled ? (
                        <span className="inline-flex rounded bg-emerald-600/20 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest text-emerald-800">
                          Fulfilled
                        </span>
                      ) : (
                        <MarkFulfilledButton orderId={order.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
