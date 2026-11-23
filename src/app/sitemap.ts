import type { MetadataRoute } from "next";
import { collections, products, projects } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    "/",
    "/collections",
    "/products",
    "/portfolio",
    "/light-studio",
    "/about",
    "/contact",
    "/request-quote",
    ...collections.map((item) => `/collections/${item.slug}`),
    ...products.map((item) => `/products/${item.slug}`),
    ...projects.map((item) => `/portfolio/${item.slug}`),
  ].map((path) => ({ url: new URL(path, siteUrl).href }));
}
