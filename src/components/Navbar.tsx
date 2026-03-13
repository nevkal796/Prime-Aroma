"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const handleSignOut = useCallback(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
    void signOut();
  }, [signOut]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const avatarUrl = user?.image ?? null;

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  const navLinks = [
    { href: "/fragrances", label: "All Fragrances" },
    { href: "/seasonal", label: "Seasonal" },
    { href: "/", label: "Collections" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0a1628]/10 bg-[#EDE8D0] text-[#0a1628]">
      <nav className="relative mx-auto flex h-16 min-h-[44px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: hamburger on mobile, nav links on desktop */}
        <div className="flex min-w-0 flex-1 items-center justify-start gap-6 sm:gap-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#0a1628]/80 hover:text-[#0a1628] md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link
            href="/fragrances"
            className="hidden shrink-0 font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] md:block md:text-xs"
          >
            All Fragrances
          </Link>
          <Link
            href="/seasonal"
            className="hidden shrink-0 font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] md:block md:text-xs"
          >
            Seasonal
          </Link>
          <Link
            href="/#collection"
            className="hidden shrink-0 font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] md:block md:text-xs"
          >
            Bestsellers
          </Link>
        </div>

        {/* Center: logo - centered on mobile via grid/flex, absolute on desktop */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 font-serif text-xl font-medium tracking-[0.2em] text-[#0a1628] md:text-2xl md:text-3xl md:tracking-[0.25em]"
          aria-label="Prime Aroma home"
          onClick={() => setMenuOpen(false)}
        >
          PRIME AROMA
        </Link>

        {/* Right: auth + search + cart on desktop; cart only on mobile */}
        <div className="flex min-w-0 flex-1 justify-end items-center gap-2 sm:gap-4">
          {!isAdminRoute && (
            <>
              {!loading && user ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#0a1628]/20 ring-[#0a1628]/10 focus:ring-2"
                    aria-label="Account menu"
                    aria-expanded={dropdownOpen}
                  >
                    {avatarUrl && !avatarError ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        onError={() => setAvatarError(true)}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f5f0e8]/30 bg-[#0a1628]">
                        <span className="font-sans text-sm font-medium text-[#f5f0e8]">
                          {(user?.email ?? user?.name ?? "?")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-[#0a1628]/10 bg-[#EDE8D0] py-1 shadow-lg">
                      <Link
                        href="/account"
                        className="block px-4 py-2 font-sans text-sm text-[#0a1628] hover:bg-[#0a1628]/5"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left font-sans text-sm text-[#0a1628] hover:bg-[#0a1628]/5"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] md:inline-block md:text-xs"
                  disabled={loading}
                >
                  {loading ? "…" : "Sign In"}
                </button>
              )}
            </>
          )}
          <button
            type="button"
            className="hidden min-h-[44px] min-w-[44px] items-center justify-center text-[#0a1628]/80 hover:text-[#0a1628] md:flex"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <Link
            href="/cart"
            className="relative flex min-h-[44px] min-w-[44px] items-center justify-center text-[#0a1628]"
            aria-label={`Cart, ${cartCount} items`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center bg-[#0a1628] px-1.5 text-[10px] font-medium text-[#EDE8D0]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile hamburger menu: full-screen navy overlay, slide from left */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#0a1628] md:hidden"
            aria-hidden
          >
            <div className="flex h-full flex-col">
                <div className="flex flex-1 flex-col px-6 pt-6">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#EDE8D0] hover:text-white"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <nav className="mt-12 flex flex-1 flex-col gap-2">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="py-4 font-sans text-lg font-medium uppercase tracking-[0.2em] text-[#EDE8D0] hover:text-white"
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t border-[#EDE8D0]/20 pb-8 pt-6">
                    {!isAdminRoute && (
                      <>
                        {!loading && user ? (
                          <div className="flex flex-col gap-2">
                            <p className="font-sans text-sm text-[#EDE8D0]/80">
                              {user.email ?? user.name ?? "Account"}
                            </p>
                            <Link
                              href="/account"
                              onClick={() => setMenuOpen(false)}
                              className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#EDE8D0] hover:text-white"
                            >
                              My Account
                            </Link>
                            <button
                              type="button"
                              onClick={handleSignOut}
                              className="w-full py-3 text-left font-sans text-[10px] font-medium uppercase tracking-widest text-[#EDE8D0] hover:text-white"
                            >
                              Sign Out
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              setAuthModalOpen(true);
                            }}
                            className="w-full py-4 font-sans text-lg font-medium uppercase tracking-[0.2em] text-[#EDE8D0] hover:text-white disabled:opacity-70"
                            disabled={loading}
                          >
                            {loading ? "…" : "Sign In"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {!isAdminRoute && (
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}
    </header>
  );
}
