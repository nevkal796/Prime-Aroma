"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowser } from "@/lib/supabase";
import type { Order } from "@/lib/types";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [phone, setPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  const supabase = getSupabaseBrowser();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, phone")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data as Profile);
        setPhone((data as Profile).phone ?? "");
      }
    })();
  }, [user, authLoading, router, supabase]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data ?? []) as Order[]);
      setOrdersLoading(false);
    })();
  }, [user, supabase]);

  const savePhone = useCallback(async () => {
    if (!user) return;
    setSavingPhone(true);
    await supabase.from("profiles").update({ phone: phone || null }).eq("id", user.id);
    setSavingPhone(false);
  }, [user, phone, supabase]);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.id, profile?.avatar_url, user?.user_metadata?.avatar_url, user?.user_metadata?.picture]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="font-sans text-sm text-[#0a1628]/70">Loading…</p>
      </div>
    );
  }

  const displayName =
    profile?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Account";
  const displayEmail = profile?.email ?? user.email ?? "";
  const avatarUrl =
    profile?.avatar_url ?? user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-medium tracking-wide text-[#0a1628] sm:text-3xl">
        My Account
      </h1>

      <section className="mt-8 rounded-lg border border-[#0a1628]/10 bg-[#EDE8D0]/50 p-6">
        <div className="flex items-center gap-4">
          {avatarUrl && !avatarError ? (
            <img
              src={avatarUrl}
              alt=""
              width={64}
              height={64}
              onError={() => setAvatarError(true)}
              className="h-16 w-16 rounded-full border border-[#0a1628]/20 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#f5f0e8]/30 bg-[#0a1628] font-serif text-2xl text-[#f5f0e8]">
              {displayName[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <p className="font-serif text-lg text-[#0a1628]">{displayName}</p>
            <p className="font-sans text-sm text-[#0a1628]/70">{displayEmail}</p>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="account-phone" className="block font-sans text-xs font-medium uppercase tracking-widest text-[#0a1628]/70">
            Phone
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="account-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={savePhone}
              className="w-full rounded border border-[#0a1628]/20 bg-white px-3 py-2 font-sans text-sm text-[#0a1628] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c]"
              placeholder="Optional"
            />
            <button
              type="button"
              onClick={savePhone}
              disabled={savingPhone}
              className="shrink-0 rounded border border-[#0a1628]/20 bg-[#0a1628] px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest text-[#EDE8D0] hover:bg-[#0a1628]/90 disabled:opacity-50"
            >
              {savingPhone ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-[#0a1628]/70">
          Order History
        </h2>
        {ordersLoading ? (
          <p className="mt-4 font-sans text-sm text-[#0a1628]/70">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 font-sans text-sm text-[#0a1628]/70">
            You haven’t placed any orders yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-lg border border-[#0a1628]/10 bg-[#EDE8D0]/30 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-sans text-xs text-[#0a1628]/70">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                  <span className="font-sans text-sm font-medium text-[#0a1628]">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <span
                    className={`font-sans text-xs uppercase ${
                      order.fulfilled ? "text-[#0a1628]/70" : "text-[#c9a84c]"
                    }`}
                  >
                    {order.fulfilled ? "Fulfilled" : "Pending"}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 font-sans text-sm text-[#0a1628]/80">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/auth/signout";
          }}
          className="rounded border border-[#0a1628]/20 px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest text-[#0a1628] hover:bg-[#0a1628]/5"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
