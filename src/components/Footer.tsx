import Link from "next/link";

const shopLinks = [
  { label: "All Fragrances", href: "#" },
  { label: "New Arrivals", href: "#" },
  { label: "Gift Sets", href: "#" },
];

const aboutLinks = [
  { label: "Our Story", href: "#" },
  { label: "Ingredients", href: "#" },
  { label: "Craftsmanship", href: "#" },
  { label: "Sustainability", href: "#" },
];

const supportLinks = [
  { label: "Contact Us", href: "#" },
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
  { label: "FAQ", href: "#" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628]/60">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="font-sans text-sm text-[#0a1628] hover:text-[#c9a84c]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#f5f0e8] text-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-2xl font-medium tracking-wide sm:text-3xl">
              PRIME AROMA
            </p>
            <p className="mt-2 font-sans text-sm font-medium text-[#0a1628]">
              Premium fragrance decants, personally curated.
            </p>
            <p className="mt-3 font-sans text-xs leading-relaxed text-[#0a1628]/70">
              Curated decants for everyone. Timeless, bold, unmistakably yours.
            </p>
          </div>
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="About" links={aboutLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>
      </div>
      <div className="border-t border-[#0a1628]/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-sans text-xs text-[#0a1628]/40">
            © 2026 Prime Aroma. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans text-xs text-[#0a1628]/40">
            <Link href="#" className="hover:text-[#c9a84c]">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#c9a84c]">
              Terms
            </Link>
            <Link href="#" className="hover:text-[#c9a84c]">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
