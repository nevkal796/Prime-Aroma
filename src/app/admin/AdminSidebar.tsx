"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return null;
  }

  return (
    <aside className="hidden w-52 shrink-0 border-r border-[#0a1628]/15 bg-[#0a1628]/5 md:block">
      <nav className="sticky top-20 flex flex-col gap-1 p-4">
        <Link
          href="/admin/dashboard"
          className={`cursor-pointer rounded px-3 py-2 font-sans text-xs font-medium uppercase tracking-widest transition-colors ${
            pathname === "/admin/dashboard" || pathname === "/admin"
              ? "bg-[#0a1628] text-[#EDE8D0]"
              : "text-[#0a1628]/80 hover:bg-[#0a1628]/10 hover:text-[#0a1628]"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className={`cursor-pointer rounded px-3 py-2 font-sans text-xs font-medium uppercase tracking-widest transition-colors ${
            pathname?.startsWith("/admin/products")
              ? "bg-[#0a1628] text-[#EDE8D0]"
              : "text-[#0a1628]/80 hover:bg-[#0a1628]/10 hover:text-[#0a1628]"
          }`}
        >
          Products
        </Link>
        <Link
          href="/admin/orders"
          className={`cursor-pointer rounded px-3 py-2 font-sans text-xs font-medium uppercase tracking-widest transition-colors ${
            pathname?.startsWith("/admin/orders")
              ? "bg-[#0a1628] text-[#EDE8D0]"
              : "text-[#0a1628]/80 hover:bg-[#0a1628]/10 hover:text-[#0a1628]"
          }`}
        >
          Orders
        </Link>
        <Link
          href="/"
          className="cursor-pointer mt-4 rounded px-3 py-2 font-sans text-xs font-medium uppercase tracking-widest text-[#0a1628]/70 hover:bg-[#0a1628]/10 hover:text-[#0a1628]"
        >
          ← Store
        </Link>
      </nav>
    </aside>
  );
}
