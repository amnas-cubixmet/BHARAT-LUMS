"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import {
  collections,
  products,
  projectCategories,
  projects,
  type Product,
} from "@/lib/catalogue";
import { Action, ProductCard, ProjectCard } from "./ui";

export function ProductsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<Product | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = query.trim().toLowerCase();
  const visible = products.filter(
    (item) =>
      (!category || item.categories.includes(category)) &&
      `${item.name} ${item.description} ${item.categories.map((slug) => collections.find((group) => group.slug === slug)?.name).join(" ")}`
        .toLowerCase()
        .includes(search),
  );
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
  }, [selected]);
  return (
    <>
      <div className="filters">
        <label className="search-field">
          <span className="sr-only">Search products</span>
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lighting products"
          />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {collections.map((item) => (
              <option value={item.slug} key={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured first</option>
            <option value="name">Name · A to Z</option>
          </select>
        </label>
      </div>
      <p className="results-count" role="status">
        {visible.length} {visible.length === 1 ? "fixture" : "fixtures"}
      </p>
      {visible.length ? (
        <div className="card-grid">
          {visible.map((item) => (
            <ProductCard
              item={item}
              key={item.slug}
              preview={() => setSelected(item)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No demonstration fixtures match your search.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setCategory("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <dialog
        className="quick-preview"
        ref={dialog}
        onClose={() => setSelected(null)}
        aria-labelledby="preview-title"
      >
        {selected && (
          <>
            <button
              type="button"
              className="icon-button dialog-close"
              aria-label="Close preview"
              onClick={() => dialog.current?.close()}
            >
              <X size={21} />
            </button>
            <p className="eyebrow">Demonstration fixture</p>
            <h2 id="preview-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <ul>
              {selected.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Action href={`/products/${selected.slug}`}>View details</Action>
          </>
        )}
      </dialog>
    </>
  );
}

export function ProjectsBrowser() {
  const [category, setCategory] = useState("");
  const visible = projects.filter(
    (item) => !category || item.category === category,
  );
  return (
    <>
      <div className="filter-pills" aria-label="Filter project concepts">
        {["", ...projectCategories].map((name) => (
          <button
            key={name}
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
          >
            {name || "All spaces"}
          </button>
        ))}
      </div>
      {visible.length ? (
        <MotionConfig reducedMotion="user">
          <motion.div
            initial={false}
            key={category}
            animate={{ opacity: [0.75, 1] }}
            className="card-grid wide"
          >
            {visible.map((item) => (
              <ProjectCard item={item} key={item.slug} />
            ))}
          </motion.div>
        </MotionConfig>
      ) : (
        <div className="empty-state">
          <p>No concept studies in this category yet.</p>
          <Link className="text-link" href="/request-quote">
            Discuss your project
          </Link>
        </div>
      )}
    </>
  );
}
