"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const avatarUrl =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0a1628]/10 bg-[#EDE8D0] text-[#0a1628]">
      <nav className="relative mx-auto flex h-16 min-h-[44px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center justify-start gap-6 sm:gap-10">
          <Link
            href="/#collection"
            className="hidden shrink-0 font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] sm:block sm:text-xs"
          >
            Collections
          </Link>
          <Link
            href="/"
            className="hidden shrink-0 font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] sm:block sm:text-xs"
          >
            New Arrivals
          </Link>
          <Link
            href="/#collection"
            className="hidden shrink-0 font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] sm:block sm:text-xs"
          >
            Bestsellers
          </Link>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-xl font-medium tracking-[0.2em] text-[#0a1628] sm:text-2xl md:text-3xl md:tracking-[0.25em]"
          aria-label="Prime Aroma home"
        >
          PRIME AROMA
        </Link>

        <div className="flex min-w-0 flex-1 justify-end items-center gap-2 sm:gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#0a1628]/20 ring-[#0a1628]/10 focus:ring-2"
                    aria-label="Account menu"
                    aria-expanded={dropdownOpen}
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt=""
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-[#0a1628]/10 font-sans text-xs font-medium text-[#0a1628]">
                        {(user.email ?? user.user_metadata?.name ?? "?")[0].toUpperCase()}
                      </span>
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
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
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
                  className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/80 hover:text-[#0a1628] sm:text-xs"
                >
                  Sign In
                </button>
              )}
            </>
          )}
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#0a1628]/80 hover:text-[#0a1628]"
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
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
