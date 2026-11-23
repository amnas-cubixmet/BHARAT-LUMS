"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["/about", "About"],
  ["/products", "Products"],
  ["/collections", "Catalogue"],
  ["/#global-presence", "Global Presence"],
  ["/contact", "Contact"],
];

export function BrandMark({
  variant = "dark",
  eager = false,
}: {
  variant?: "light" | "dark";
  eager?: boolean;
}) {
  return (
    <Image
      className="brand-logo"
      src={`/images/logo/bharat-lums-${variant === "light" ? "blue" : "white"}.png`}
      alt="Bharat Lums — Powering a Brighter Tomorrow"
      width={432}
      height={237}
      sizes="104px"
      loading={eager ? "eager" : "lazy"}
    />
  );
}

export default function Header() {
  const path = usePathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === path;
  return (
    <header
      className={path === "/" ? "site-header home-header" : "site-header"}
    >
      <div className="shell header-inner">
        <Link href="/" className="brand-link" onClick={() => setOpenedAt(null)}>
          <BrandMark variant={path === "/" ? "light" : "dark"} eager />
        </Link>
        <button
          className="menu-toggle icon-button"
          aria-controls="site-navigation"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenedAt(open ? null : path)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="site-navigation"
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpenedAt(null);
              document
                .querySelector<HTMLButtonElement>(".menu-toggle")
                ?.focus();
            }
          }}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={path.startsWith(href) ? "active" : undefined}
              onClick={() => setOpenedAt(null)}
            >
              {label}
            </Link>
          ))}
          <Link
            className="button button-outline mobile-quote"
            href="/request-quote"
            onClick={() => setOpenedAt(null)}
          >
            Request a quote <ArrowUpRight size={15} />
          </Link>
        </nav>
        <Link
          className="button button-outline header-quote"
          href="/request-quote"
        >
          Request a quote <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}
