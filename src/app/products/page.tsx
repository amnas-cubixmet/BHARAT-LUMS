import { ProductsBrowser } from "@/components/browse";
import { PageIntro, QuoteBanner } from "@/components/ui";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Lighting Products", "/products");

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product catalogue"
        title="Find your fixture."
        description="Browse demonstration fixtures by application, profile and mounting style. Contact us for confirmed product availability and specifications."
      />
      <section className="shell section-tight" aria-label="Browse fixtures">
        <ProductsBrowser />
      </section>
      <QuoteBanner />
    </>
  );
}
