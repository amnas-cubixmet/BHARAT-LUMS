import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { Action, PageIntro, QuoteBanner } from "@/components/ui";
import { artwork, collections, products } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  return item
    ? pageMetadata(
        item.name,
        `/products/${slug}`,
        item.description,
        artwork(item.image),
      )
    : {};
}
export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageIntro
        eyebrow="Demonstration fixture"
        title={item.name}
        description={item.description}
      />
      <section
        className="shell detail-grid section-tight"
        aria-label="Fixture details"
      >
        <Gallery images={[item.image, ...item.gallery]} name={item.name} />
        <div className="detail-copy">
          <Link className="text-link" href="/products">
            ← All fixtures
          </Link>
          <h2>Design features</h2>
          <ul>
            {item.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <h2>Applications</h2>
          <p>{item.applications}</p>
          <h2>Specifications and options</h2>
          <p>
            Sizes, finishes, colour temperatures and technical datasheets are
            pending catalogue confirmation. Ask our team about the options for
            your project.
          </p>
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
          <Action href={`/request-quote?product=${slug}`}>
            Request a quote
          </Action>
        </div>
      </section>
      <QuoteBanner />
    </>
  );
}
