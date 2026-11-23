import { ProductsBrowser } from "@/components/browse";
import { PageIntro, QuoteBanner } from "@/components/ui";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Lighting Products", "/products");

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product catalogue"
        title="LED lighting catalogue."
        description="Explore proposed fixtures for commercial, industrial and outdoor projects. Representative imagery illustrates fixture types. Contact our team for confirmed models and specifications."
      />
      <section className="shell section-tight" aria-label="Browse fixtures">
        <ProductsBrowser />
      </section>
      <QuoteBanner />
    </>
  );
}
