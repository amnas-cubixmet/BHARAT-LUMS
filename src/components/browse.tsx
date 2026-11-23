"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import {
  catalogueCategories,
  catalogueLabel,
  findCollection,
  publishedProducts,
  projectCategories,
  projects,
  type Product,
} from "@/lib/catalogue";
import { Action, CatalogueCategoryCard, ProductCard, ProjectCard } from "./ui";
import { useSiteReducedMotion } from "./use-media-query";

const verifiedWattages = [
  ...new Set(
    publishedProducts.flatMap((product) =>
      product.status === "verified" ? (product.wattages ?? []) : [],
    ),
  ),
].sort((a, b) => a - b);

export function ProductsBrowser({ initialCategory }: { initialCategory: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [wattage, setWattage] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<Product | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = query.trim().toLowerCase();
  const hasFilters = Boolean(query || category || wattage);

  function clearFilters() {
    setQuery("");
    setCategory("");
    setWattage("");
  }

  const visible = publishedProducts.filter(
    (item) =>
      (!category || item.categories.includes(category)) &&
      (!wattage ||
        (item.status === "verified" &&
          item.wattages?.includes(Number(wattage)))) &&
      `${item.name} ${item.description} ${item.categories.map((slug) => findCollection(slug)?.name).join(" ")}`
        .toLowerCase()
        .includes(search),
  );
  const categoryMatches = catalogueCategories.filter(
    (item) =>
      (!category || item.slug === category) &&
      `${item.name} ${item.description}`.toLowerCase().includes(search),
  );
  if (sort === "name")
    categoryMatches.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
  }, [selected]);
  return (
    <>
      <div
        className={
          verifiedWattages.length
            ? "filters catalogue-filters-with-wattage"
            : "filters"
        }
      >
        <label className="catalogue-search">
          <span>Search products</span>
          <span className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. street lights"
            />
          </span>
        </label>
        <label>
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            <optgroup label="LED lighting categories">
              {catalogueCategories.map((item) => (
                <option value={item.slug} key={item.slug}>
                  {item.name}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        {verifiedWattages.length > 0 && (
          <label>
            <span>Wattage</span>
            <select
              value={wattage}
              onChange={(event) => setWattage(event.target.value)}
            >
              <option value="">All wattages</option>
              {verifiedWattages.map((watts) => (
                <option key={watts} value={watts}>
                  {watts} W
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured first</option>
            <option value="name">Name · A to Z</option>
          </select>
        </label>
      </div>
      <div className="catalogue-results">
        <p className="results-count" role="status">
          {publishedProducts.length
            ? `${visible.length} ${visible.length === 1 ? "fixture" : "fixtures"}`
            : `${categoryMatches.length} lighting ${categoryMatches.length === 1 ? "category" : "categories"}`}
        </p>
        {hasFilters && (
          <button type="button" className="text-link" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>
      {visible.length ? (
        <div className="card-grid catalogue-grid-transition" key={category}>
          {visible.map((item) => (
            <ProductCard
              item={item}
              key={item.slug}
              preview={() => setSelected(item)}
            />
          ))}
        </div>
      ) : !publishedProducts.length && categoryMatches.length ? (
        <div className="card-grid catalogue-grid-transition" key={category}>
          {categoryMatches.map((item) => (
            <CatalogueCategoryCard item={item} key={item.slug} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No lighting results match. Try another search or clear the filters.</p>
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
            <p className="eyebrow">{catalogueLabel(selected)}</p>
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
  const reduced = useSiteReducedMotion();
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects are currently listed.</p>
        <Action href="/products">Explore the product catalogue</Action>
      </div>
    );
  }
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
        <MotionConfig reducedMotion={reduced ? "always" : "never"}>
          <motion.div
            initial={false}
            key={category}
            animate={reduced ? { opacity: 1 } : { opacity: [0.75, 1] }}
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
