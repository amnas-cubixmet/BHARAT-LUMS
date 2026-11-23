"use client";

import Image from "next/image";
import { useState } from "react";
import { artwork } from "@/lib/catalogue";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div className="detail-image">
        <Image
          src={artwork(images[index])}
          alt={`${name} lighting concept, view ${index + 1}`}
          fill
          sizes="(max-width: 760px) 100vw, 55vw"
          priority
        />
      </div>
      <div className="gallery-controls" aria-label="Image gallery">
        {images.map((image, position) => (
          <button
            type="button"
            key={image}
            aria-label={`Show view ${position + 1}`}
            aria-pressed={position === index}
            onClick={() => setIndex(position)}
          >
            <Image fill sizes="110px" src={artwork(image)} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
