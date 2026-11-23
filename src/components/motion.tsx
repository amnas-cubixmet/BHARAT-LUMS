"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { gsap } from "gsap";

export type MotionTools = { gsap: typeof gsap; media: gsap.MatchMedia };

export function useMotion<T extends HTMLElement>(
  setup: (element: T, tools: MotionTools) => void,
  path?: string,
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;

    async function animate(target: T) {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !target.isConnected) return;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      setup(target, { gsap, media });
    }

    void animate(element);
    return () => {
      cancelled = true;
      media?.revert();
    };
  }, [setup, path]);
  return ref;
}

function animateProgress(element: HTMLElement, { gsap, media }: MotionTools) {
  media.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to(element, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
    });
  });
}

export function SiteMotion() {
  const progress = useMotion<HTMLDivElement>(animateProgress, usePathname());
  return <div className="scroll-progress" ref={progress} aria-hidden="true" />;
}

function animateReveal(element: HTMLElement, { gsap, media }: MotionTools) {
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (element.getBoundingClientRect().top < innerHeight * 0.96) return;
    gsap.from(element, {
      y: 22,
      opacity: 0,
      duration: 0.65,
      clearProps: "all",
      scrollTrigger: { trigger: element, start: "top 96%", once: true },
    });
  });
}

export function Reveal({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "article" | "section";
  className: string;
  children: ReactNode;
}) {
  const ref = useMotion<HTMLElement>(animateReveal);

  return (
    <Tag
      className={className}
      ref={(element) => {
        ref.current = element;
      }}
    >
      {children}
    </Tag>
  );
}
