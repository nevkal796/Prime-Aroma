"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/", label: "← Store" },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    setOpen(false);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#0a1628]/15 bg-[#EDE8D0] px-4 md:hidden">
        <span className="font-serif text-lg font-medium text-[#0a1628]">
          Admin
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer flex h-10 w-10 items-center justify-center rounded text-[#0a1628] hover:bg-[#0a1628]/10"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#0a1628] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          <div className="flex flex-col h-full">
            <div className="flex h-14 items-center justify-end border-b border-[#0a1628]/20 px-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded text-[#EDE8D0] hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`cursor-pointer rounded-lg px-4 py-3 font-sans text-sm font-medium uppercase tracking-widest ${
                    pathname === href || (href !== "/" && pathname?.startsWith(href))
                      ? "bg-[#EDE8D0] text-[#0a1628]"
                      : "text-[#EDE8D0] hover:bg-[#EDE8D0]/10"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={handleSignOut}
                className="cursor-pointer mt-4 rounded-lg px-4 py-3 text-left font-sans text-sm font-medium uppercase tracking-widest text-[#EDE8D0] hover:bg-[#EDE8D0]/10"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
