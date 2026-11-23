import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, MessageCircle } from "lucide-react";
import { Gallery } from "@/components/gallery";
import { Action, PageIntro, ProductCard, QuoteBanner } from "@/components/ui";
import {
  catalogueLabel,
  collections,
  publishedProducts,
  relatedProducts,
} from "@/lib/catalogue";
import { brand, metadata as pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return publishedProducts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const item = publishedProducts.find((product) => product.slug === slug);
  return item
    ? pageMetadata(
        item.name,
        `/products/${slug}`,
        item.description,
        item.images[0].src,
      )
    : {};
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const item = publishedProducts.find((product) => product.slug === slug);
  if (!item) notFound();

  const specs =
    item.status === "verified" ? [...(item.specifications ?? [])] : [];
  if (item.status === "verified" && item.wattages?.length) {
    specs.unshift({ name: "Wattage", value: `${item.wattages.join(" / ")} W` });
  }
  const downloads =
    item.status === "verified"
      ? [
          { label: "Download datasheet", href: item.datasheet },
          { label: "Download catalogue", href: item.catalogue },
        ].filter((download) => download.href)
      : [];
  const whatsappNumber = brand.phoneHref.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hello Bharat Lums, I would like more information about ${item.name}. Please share the available options and specifications.`,
  );

  return (
    <>
      <PageIntro
        eyebrow={catalogueLabel(item)}
        title={item.name}
        description={item.description}
      />
      <section
        className="shell detail-grid section-tight"
        aria-label="Fixture details"
      >
        <Gallery images={item.images} />
        <div className="detail-copy">
          <Link className="text-link" href="/products">
            ← All fixtures
          </Link>
          <h2>
            {item.status === "verified"
              ? "Fixture features"
              : "Design features"}
          </h2>
          <ul>
            {item.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <h2>Applications</h2>
          <p>{item.applications}</p>
          <h2>Specifications and downloads</h2>
          {specs.length > 0 ? (
            <table className="product-spec-table">
              <caption className="sr-only">
                Verified fixture specifications
              </caption>
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.name}>
                    <th scope="row">{spec.name}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              Verified specifications are pending. Ask our team for available
              models and technical information for your project.
            </p>
          )}
          {downloads.length > 0 && (
            <div className="product-detail-actions">
              {downloads.map(({ href, label }) => (
                <a download className="text-link" href={href} key={label}>
                  {label} <Download size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
          <div className="filter-pills">
            {collections
              .filter((category) => item.categories.includes(category.slug))
              .map((category) => (
                <Link
                  className="text-link"
                  key={category.slug}
                  href={`/collections/${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
          </div>
          <div className="product-detail-actions">
            <Action href={`/request-quote?product=${slug}`}>
              Request a quote
            </Action>
            <a
              className="button button-outline"
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp enquiry
            </a>
          </div>
        </div>
      </section>
      <section
        className="shell section-tight"
        aria-labelledby="related-fixtures"
      >
        <h2 className="catalogue-section-title" id="related-fixtures">
          Related fixtures
        </h2>
        <div className="card-grid">
          {relatedProducts(item).map((product) => (
            <ProductCard item={product} key={product.slug} />
          ))}
        </div>
      </section>
      <QuoteBanner />
    </>
  );
}
