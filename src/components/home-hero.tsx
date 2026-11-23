"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { artwork } from "@/lib/catalogue";
import { Action } from "./action";
import { useMotion, type MotionTools } from "./motion";

function animateHero(hero: HTMLElement, { gsap, media }: MotionTools) {
  const art = hero.querySelector(".hero-art");
  if (!art) return;

  const select = gsap.utils.selector(hero);
  media.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(select("[data-intro]"), {
      y: 14,
      opacity: 0,
      duration: 0.64,
      stagger: 0.09,
      ease: "power2.out",
      clearProps: "all",
    });
    if (matchMedia("(min-width: 806px)").matches) {
      const entrance = gsap.timeline();
      entrance.fromTo(
        select("h1"),
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0 0)",
          duration: 0.64,
          ease: "power2.out",
          clearProps: "clipPath",
        },
        0.34,
      );
      entrance.set(select("[data-diffuser]"), { opacity: 0 }, 0);
      entrance.fromTo(
        select(".hero-installation"),
        { opacity: 0 },
        { opacity: 1, duration: 0.12 },
        0,
      );
      entrance.fromTo(
        select("[data-fixture]"),
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
        select("[data-diffuser]"),
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
        select(".hero-installation"),
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
  });

  media.add(
    "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
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
    },
  );
}

export function HomeHero() {
  const hero = useMotion<HTMLElement>(animateHero);
  return (
    <section className="hero" ref={hero}>
      <div className="hero-art">
        <Image src={artwork("hero")} alt="" fill preload sizes="100vw" />
      </div>
      <div className="hero-shade" />
      <div className="hero-installation" aria-hidden="true">
        <svg viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice">
          {[
            [940, 189, 1525, 243],
            [813, 296, 1300, 329],
            [716, 385, 1118, 406],
            [670, 447, 970, 457],
          ].map(([x1, y1, x2, y2]) => (
            <g key={x1} data-fixture>
              <path
                d={`M ${x1 + 65} 0 V ${y1} M ${x2 - 70} 0 V ${y2 - 6}`}
                stroke="#807168"
                opacity=".35"
              />
              <path
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#221d18"
                strokeWidth="13"
              />
              <path
                data-diffuser
                d={`M ${x1} ${y1 + 3} L ${x2} ${y2 + 3}`}
                stroke="#ffe5c6"
                strokeWidth="6"
              />
            </g>
          ))}
        </svg>
      </div>
      <div className="shell hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow" data-intro>
            <span /> Architectural lighting
          </p>
          <h1 data-intro>
            LIGHT BEYOND
            <br />
            <em>LIMITS.</em>
          </h1>
          <p className="hero-description" data-intro>
            Architectural lighting crafted to transform spaces.
          </p>
          <div className="hero-actions" data-intro>
            <Action href="/collections">Explore our collections</Action>
            <Action href="/portfolio" secondary diagonal>
              Discover our projects
            </Action>
          </div>
        </div>
        <div className="hero-footer">
          <a className="hero-scroll" href="#featured">
            <span>
              <ArrowDown size={16} />
            </span>{" "}
            Scroll to explore
          </a>
          <p>
            Suspended linear lighting <span> / </span> Concept installation
          </p>
        </div>
      </div>
    </section>
  );
}
