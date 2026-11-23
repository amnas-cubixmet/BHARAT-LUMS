import { ProductsBrowser } from "@/components/browse";
import { PageIntro, QuoteBanner } from "@/components/ui";
import { publishedProducts } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Lighting Products", "/products");

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product catalogue"
        title="LED lighting catalogue."
        description={
          publishedProducts.length
            ? "Browse verified LED fixtures by lighting category."
            : "Explore lighting categories for commercial, industrial and outdoor projects. For model availability and technical specifications, contact our team."
        }
      />
      <section className="shell section-tight" aria-label="Browse fixtures">
        <ProductsBrowser />
      </section>
      <QuoteBanner />
    </>
  );
}
