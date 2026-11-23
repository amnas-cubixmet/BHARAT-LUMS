import { notFound } from "next/navigation";
import { Action, PageIntro, ProductCard, QuoteBanner } from "@/components/ui";
import { artwork, collections, products } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ category: string }> };
export function generateStaticParams() {
  return collections.map(({ slug }) => ({ category: slug }));
}
export async function generateMetadata({ params }: Params) {
  const { category } = await params;
  const collection = collections.find(({ slug }) => slug === category);
  return collection
    ? pageMetadata(
        collection.name,
        `/collections/${category}`,
        collection.description,
        artwork(collection.image),
      )
    : {};
}
export default async function CollectionPage({ params }: Params) {
  const { category } = await params;
  const collection = collections.find(({ slug }) => slug === category);
  if (!collection) notFound();
  const matches = products.filter((item) => item.categories.includes(category));
  return (
    <>
      <PageIntro
        eyebrow="Proposed lighting collection"
        title={collection.name}
        description={collection.description}
      />
      <section
        className="shell section-tight"
        aria-label="Demonstration fixtures"
      >
        {matches.length ? (
          <div className="card-grid">
            {matches.map((item) => (
              <ProductCard item={item} key={item.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              This collection is open for project enquiries. Individual fixtures
              are pending catalogue confirmation.
            </p>
            <Action href={`/request-quote?collection=${category}`}>
              Enquire about this collection
            </Action>
          </div>
        )}
      </section>
      <QuoteBanner />
    </>
  );
}
