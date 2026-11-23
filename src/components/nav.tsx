"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";

const globalPresence = "/#global-presence";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/products", "Products"],
  [globalPresence, "Global Presence"],
  ["/contact", "Contact"],
];

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getHash() {
  return window.location.hash;
}

function getServerHash() {
  return "";
}

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
      sizes={eager ? "(max-width: 805px) 94px, 104px" : "108px"}
      loading={eager ? "eager" : "lazy"}
    />
  );
}

export default function Header() {
  const path = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === path;
  const atGlobalPresence = path === "/" && hash === "#global-presence";

  function followLink(href: string, preventDefault: () => void) {
    setOpenedAt(null);
    if (path !== "/") return;

    if (href === "/") {
      preventDefault();
      const oldURL = window.location.href;
      if (window.location.hash || window.location.search) {
        window.history.pushState(null, "", "/");
        window.dispatchEvent(
          new HashChangeEvent("hashchange", {
            oldURL,
            newURL: window.location.href,
          }),
        );
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (href === globalPresence) {
      preventDefault();
      // Avoid reloading the WebGL scene when navigating within the homepage.
      const oldURL = window.location.href;
      window.history.pushState(null, "", href);
      window.dispatchEvent(
        new HashChangeEvent("hashchange", {
          oldURL,
          newURL: window.location.href,
        }),
      );
      document.getElementById("global-presence")?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }

  return (
    <header
      className={path === "/" ? "site-header home-header" : "site-header"}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpenedAt(null);
          menuToggle.current?.focus();
        }
      }}
    >
      <div className="shell header-inner">
        <Link
          href="/"
          className="brand-link"
          onNavigate={(event) => followLink("/", event.preventDefault)}
        >
          <BrandMark eager />
        </Link>
        <button
          className="menu-toggle icon-button"
          ref={menuToggle}
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
        >
          {links.map(([href, label]) => {
            const current =
              href === globalPresence
                ? atGlobalPresence
                : path === href && !atGlobalPresence;
            const inSection = href !== "/" && path.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={
                  current
                    ? href === globalPresence
                      ? "location"
                      : "page"
                    : undefined
                }
                className={current || inSection ? "active" : undefined}
                onNavigate={(event) => followLink(href, event.preventDefault)}
              >
                {label}
              </Link>
            );
          })}
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
