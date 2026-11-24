"use client";

import { usePathname } from "next/navigation";
import { Action } from "./action";

export function FooterProject() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/products" || pathname === "/contact" || pathname.startsWith("/admin")) return null;

  return (
    <div className="footer-project">
      <h2>Let’s light up your next project.</h2>
      <Action href="/contact">Contact Us</Action>
    </div>
  );
}
