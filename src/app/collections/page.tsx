import { CollectionCard, PageIntro, QuoteBanner } from "@/components/ui";
import { collections } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

const description =
  "Explore LED lighting solutions for commercial, industrial and outdoor applications.";

export const metadata = pageMetadata(
  "Professional LED Lighting",
  "/collections",
  description,
);

export default function CollectionsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product catalogue"
        title="Professional LED Lighting."
        description={description}
      />
      <section
        className="shell section-tight card-grid"
        aria-label="LED lighting categories"
      >
        {collections.map((item) => (
          <CollectionCard item={item} key={item.slug} />
        ))}
      </section>
      <QuoteBanner />
    </>
  );
}
