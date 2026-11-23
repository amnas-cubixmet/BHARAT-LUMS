"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function ProjectCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const syncEdges = () => {
      const start = element.scrollLeft <= 2;
      const end =
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
      setEdges((previous) =>
        previous.start === start && previous.end === end
          ? previous
          : { start, end },
      );
    };
    const observer = new ResizeObserver(syncEdges);
    observer.observe(element);
    element.addEventListener("scroll", syncEdges, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", syncEdges);
    };
  }, []);

  function move(direction: number) {
    const element = track.current;
    if (!element || !element.children[1]) return;
    const first = element.children[0].getBoundingClientRect().x;
    const second = element.children[1].getBoundingClientRect().x;
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
    element.scrollBy({ left: direction * (second - first), behavior });
  }

  return (
    <div className="project-carousel">
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label="Previous projects"
          aria-controls={id}
          disabled={edges.start}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={19} />
        </button>
        <button
          className="icon-button"
          aria-label="Next projects"
          aria-controls={id}
          disabled={edges.end}
          onClick={() => move(1)}
        >
          <ArrowRight size={19} />
        </button>
      </div>
      <div
        className="carousel-track"
        id={id}
        ref={track}
        role="region"
        aria-label="Featured project concepts"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
