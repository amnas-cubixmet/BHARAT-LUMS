import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import {
  artwork,
  collections,
  type Collection,
  type Product,
  type Project,
} from "@/lib/catalogue";
import { brand } from "@/lib/site";
import { BrandMark } from "./nav";

import { Action } from "./action";
import { Reveal } from "./motion";

export { Action };

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro shell">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro-copy">{description}</p>
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  href,
  link,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <Reveal className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-link">
          {link}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </Reveal>
  );
}

export function CollectionCard({ item }: { item: Collection }) {
  return (
    <Reveal as="article" className="media-card">
      <Link
        href={`/collections/${item.slug}`}
        className="image-link"
        aria-label={`Explore ${item.name}`}
      >
        <Image
          src={artwork(item.image)}
          alt=""
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 34vw"
        />
        <span className="card-icon">
          <ArrowUpRight size={19} />
        </span>
      </Link>
      <div className="card-body">
        <h3>
          <Link href={`/collections/${item.slug}`}>{item.name}</Link>
        </h3>
        <p>{item.description}</p>
      </div>
    </Reveal>
  );
}

export function ProductCard({
  item,
  preview,
}: {
  item: Product;
  preview?: () => void;
}) {
  return (
    <article className="media-card">
      <Link
        href={`/products/${item.slug}`}
        className="image-link"
        aria-label={`View ${item.name}`}
      >
        <Image
          src={artwork(item.image)}
          alt=""
          fill
          sizes="(max-width: 680px) 100vw, 34vw"
        />
        <span className="card-icon">
          <ArrowUpRight size={19} />
        </span>
      </Link>
      <div className="card-body">
        <p className="label">
          {collections.find(({ slug }) => slug === item.categories[0])?.name} ·
          Demonstration
        </p>
        <h3>
          <Link href={`/products/${item.slug}`}>{item.name}</Link>
        </h3>
        <p>{item.description}</p>
        <div className="card-actions">
          <Link className="text-link" href={`/products/${item.slug}`}>
            View details <ArrowRight size={13} />
          </Link>
          <Link
            className="text-link"
            href={`/request-quote?product=${item.slug}`}
          >
            Request quote <ArrowUpRight size={13} />
          </Link>
          {preview && (
            <button className="text-link" onClick={preview}>
              Quick preview
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectCard({ item }: { item: Project }) {
  return (
    <article className="media-card project-card">
      <Link
        href={`/portfolio/${item.slug}`}
        className="image-link"
        aria-label={`View ${item.name}`}
      >
        <Image
          src={artwork(item.image)}
          alt=""
          fill
          sizes="(max-width: 680px) 100vw, 48vw"
        />
        <span className="card-icon">
          <ArrowUpRight size={19} />
        </span>
      </Link>
      <div className="card-body">
        <p className="label">{item.category} · Concept / inspiration</p>
        <h3>
          <Link href={`/portfolio/${item.slug}`}>{item.name}</Link>
        </h3>
      </div>
    </article>
  );
}

export function QuoteBanner() {
  return (
    <section className="quote-banner">
      <div className="shell quote-inner">
        <div>
          <p className="eyebrow">Work with us</p>
          <h2>Have a space in mind?</h2>
          <p>
            Tell us what you’re working on. We’ll help you explore the lighting
            options.
          </p>
        </div>
        <Action href="/request-quote" diagonal>
          Request a quote
        </Action>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div>
            <Link href="/" className="brand-link">
              <BrandMark />
            </Link>
            <p>Architectural lighting for spaces with purpose.</p>
          </div>
          <div>
            <h2>Explore</h2>
            <Link href="/collections">Collections</Link>
            <Link href="/products">Products</Link>
            <Link href="/light-studio">Light Studio</Link>
          </div>
          <div>
            <h2>Company</h2>
            <Link href="/portfolio">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h2>Get in touch</h2>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={brand.phoneHref}>{brand.phone}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bharat Lums</span>
          <a href="#top">
            Back to top <ArrowDown size={14} className="rotate-180" />
          </a>
        </div>
      </div>
    </footer>
  );
}
