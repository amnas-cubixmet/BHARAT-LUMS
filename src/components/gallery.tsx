"use client";

import { ZoomIn, X } from "lucide-react";
import { useRef, useState } from "react";
import type { ProductImage } from "@/lib/catalogue";
import { CatalogueImage } from "./catalogue-image";

export function Gallery({
  images,
}: {
  images: [ProductImage, ...ProductImage[]];
}) {
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const image = images[index];

  function openImage() {
    setZoom(false);
    setOpened(true);
    dialog.current?.showModal();
  }

  return (
    <div className="product-gallery">
      <button
        className="detail-image product-gallery-image"
        type="button"
        onClick={openImage}
        aria-label="Open full-size fixture image"
      >
        <span className="gallery-image-transition" key={image.src}>
          <CatalogueImage
            {...image}
            sizes="(max-width: 805px) 94vw, 55vw"
          />
        </span>
        <span className="card-icon">
          <ZoomIn size={19} aria-hidden="true" />
        </span>
      </button>
      {image.representative && (
        <p className="product-photo-caption">Representative imagery</p>
      )}
      {images.length > 1 && (
        <div
          className="gallery-controls"
          role="group"
          aria-label="Image gallery"
        >
          {images.map((view, position) => (
            <button
              type="button"
              key={view.src}
              aria-label={`Show ${view.label.toLowerCase()}`}
              aria-pressed={position === index}
              onClick={() => setIndex(position)}
            >
              <CatalogueImage src={view.src} alt="" sizes="110px" />
            </button>
          ))}
        </div>
      )}
      <dialog
        className="product-lightbox"
        ref={dialog}
        onClose={() => setOpened(false)}
        aria-labelledby="product-image-title"
      >
        <header>
          <h2 id="product-image-title">{image.label}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close fixture image"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </header>
        <button
          type="button"
          className="lightbox-image"
          aria-pressed={zoom}
          aria-label="Magnify fixture"
          onClick={() => setZoom(!zoom)}
        >
          <span className={zoom ? "image-magnified" : undefined}>
            {opened && (
              <CatalogueImage
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 700px) 94vw, 850px"
              />
            )}
          </span>
        </button>
      </dialog>
    </div>
  );
}
