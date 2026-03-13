import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f5f0e8] text-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/60">
              Fragrances
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/fragrances"
                  className="font-sans text-sm text-[#0a1628] hover:text-[#c9a84c]"
                >
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link
                  href="/seasonal"
                  className="font-sans text-sm text-[#0a1628] hover:text-[#c9a84c]"
                >
                  Seasonal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/60">
              About Us
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/#philosophy"
                  className="font-sans text-sm text-[#0a1628] hover:text-[#c9a84c]"
                >
                  Our Philosophy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/60">
              Contact Us
            </p>
            <div className="mt-3 font-sans text-sm text-[#0a1628]/90 space-y-1">
              <p>Phone: 832-868-8259</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#0a1628]/20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs text-[#0a1628]/40">
            © 2026 Prime Aroma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
