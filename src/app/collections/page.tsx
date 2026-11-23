import { CollectionCard, PageIntro, QuoteBanner } from "@/components/ui";
import { collections } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Lighting Collections", "/collections");

export default function CollectionsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Global catalogue"
        title="Lighting collections."
        description="Explore 16 lighting families, from straight LED profiles to directional track and outdoor concepts. This catalogue outlines proposed collections."
      />
      <section
        className="shell section-tight card-grid"
        aria-label="Lighting families"
      >
        {collections.map((item) => (
          <CollectionCard item={item} key={item.slug} />
        ))}
      </section>
      <QuoteBanner />
    </>
  );
}
