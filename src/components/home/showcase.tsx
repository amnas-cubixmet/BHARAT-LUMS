"use client";

import Image from "next/image";
import { Action } from "../action";
import { useMotion, type MotionTools } from "../motion";
import type { Collection } from "@/lib/catalogue";
import styles from "./home.module.css";

function animateCard(element: HTMLElement, { gsap, media }: MotionTools) {
  const photo = element.querySelector("img");
  const copy = element.querySelector("[data-showcase-copy]");
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (copy)
      gsap.from(copy.children, {
        opacity: 0,
        y: 18,
        stagger: 0.11,
        duration: 0.65,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: element, start: "top 86%", once: true },
      });
    if (photo)
      gsap.fromTo(
        photo,
        { scale: 1.16, yPercent: -4 },
        {
          scale: 1.04,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
  });
}

export function ShowcaseCard({
  item,
  image,
  alt,
  representative,
}: {
  item: Collection;
  image: string;
  alt: string;
  representative: boolean;
}) {
  const ref = useMotion<HTMLElement>(animateCard);
  return (
    <article className={styles.showcaseItem} ref={ref}>
      <div className={styles.showcaseCopy} data-showcase-copy>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <Action href={`/collections/${item.slug}`}>View Products</Action>
      </div>
      <figure className={styles.showcaseArt}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 650px) 92vw, 51vw"
        />
        {representative && <figcaption>Application concept</figcaption>}
      </figure>
    </article>
  );
}
