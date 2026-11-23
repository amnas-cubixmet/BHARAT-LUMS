"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function SiteMotion() {
  const path = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-intro]", {
          y: 14,
          opacity: 0,
          duration: 0.64,
          stagger: 0.09,
          ease: "power2.out",
          clearProps: "all",
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          if (element.getBoundingClientRect().top < innerHeight * 0.96) return;
          gsap.from(element, {
            y: 22,
            opacity: 0,
            duration: 0.65,
            clearProps: "all",
            scrollTrigger: { trigger: element, start: "top 96%", once: true },
          });
        });
        if (progress.current)
          gsap.to(progress.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
          });
        const hero = document.querySelector<HTMLElement>(".hero");
        const art = hero?.querySelector(".hero-art");
        if (!hero || !art) return;
        if (matchMedia("(min-width: 806px)").matches) {
          const entrance = gsap.timeline();
          entrance.set("[data-diffuser]", { opacity: 0 });
          entrance.fromTo(
            ".hero-installation",
            { opacity: 0 },
            { opacity: 1, duration: 0.12 },
            0,
          );
          entrance.fromTo(
            "[data-fixture]",
            { y: -140, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.09,
              ease: "power2.out",
            },
            0,
          );
          entrance.to(
            "[data-diffuser]",
            { opacity: 1, stagger: 0.12, duration: 0.12 },
            0.42,
          );
          entrance.fromTo(
            art,
            { filter: "brightness(.20)" },
            { filter: "brightness(1)", duration: 0.85, ease: "power2.out" },
            0.28,
          );
          entrance.to(
            ".hero-installation",
            { opacity: 0, duration: 0.35 },
            0.76,
          );
        } else {
          gsap.fromTo(
            art,
            { filter: "brightness(.65)" },
            { filter: "brightness(1)", duration: 0.7, ease: "power2.out" },
          );
        }
        gsap.to(art, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        if (!matchMedia("(pointer: fine)").matches) return;
        const move = gsap.quickTo(art, "x", {
          duration: 0.65,
          ease: "power2.out",
        });
        const onMove = (event: PointerEvent) =>
          move((event.clientX / innerWidth - 0.5) * 10);
        const onLeave = () => move(0);
        hero.addEventListener("pointermove", onMove);
        hero.addEventListener("pointerleave", onLeave);
        return () => {
          hero.removeEventListener("pointermove", onMove);
          hero.removeEventListener("pointerleave", onLeave);
        };
      });
      cleanup = () => media.revert();
    }
    void animate();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [path]);
  return <div className="scroll-progress" ref={progress} aria-hidden="true" />;
}
