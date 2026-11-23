"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CatalogueCategory } from "@/lib/catalogue";
import styles from "./catalogue-slider.module.css";

export function CatalogueSlider({
  categories,
}: {
  categories: readonly CatalogueCategory[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const updateEdges = () => {
      const start = track.scrollLeft <= 2;
      const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      setEdges((previous) =>
        previous.start === start && previous.end === end
          ? previous
          : { start, end },
      );
    };

    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    track.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateEdges);
    };
  }, []);

  function step(direction: -1 | 1) {
    const track = trackRef.current;
    const first = track?.children[0];
    const second = track?.children[1];
    if (!track || !first || !second) return;
    const distance = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    track.scrollBy({ left: direction * distance });
  }

  return (
    <section className={`shell ${styles.section}`} aria-labelledby="catalogue-slider-title">
      <div className={styles.heading}>
        <h2 id="catalogue-slider-title">LED Lighting</h2>
        <Link href="/products" className={styles.allProducts}>
          All Products <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <ul
        id="catalogue-slider-track"
        ref={trackRef}
        className={styles.track}
        role="list"
        aria-label="LED lighting categories"
        tabIndex={0}
      >
        {categories.map(({ slug, name, image }) => (
          <li key={slug}>
            <Link
              href={{ pathname: "/products", query: { category: slug } }}
              prefetch={false}
              className={styles.card}
            >
              <span className={styles.image}>
                <Image
                  src={`/images/${image}.webp`}
                  alt=""
                  fill
                  sizes="(max-width: 560px) 82vw, (max-width: 900px) 43vw, (max-width: 1450px) 29vw, 425px"
                />
              </span>
              <span className={styles.label}>
                {name} <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button
          type="button"
          aria-label="Previous category"
          aria-controls="catalogue-slider-track"
          disabled={edges.start}
          onClick={() => step(-1)}
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next category"
          aria-controls="catalogue-slider-track"
          disabled={edges.end}
          onClick={() => step(1)}
        >
          <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
