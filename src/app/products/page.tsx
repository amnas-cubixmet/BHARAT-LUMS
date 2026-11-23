import { ProductsBrowser } from "@/components/browse";
import { Action } from "@/components/ui";
import { findCollection, publishedProducts } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";
import styles from "./products.module.css";

const description =
  "Explore LED lighting for commercial, industrial and outdoor spaces.";

export const metadata = pageMetadata("Lighting Products", "/products", description);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const initialCategory = findCollection(category)?.slug ?? "";

  return (
    <div className={`shell ${styles.page}`}>
      <section className={styles.intro} aria-labelledby="products-title">
        <div>
          <p className="eyebrow">Product catalogue</p>
          <h1 id="products-title">LED lighting catalogue.</h1>
        </div>
        <p>
          {publishedProducts.length
            ? "Browse verified LED fixtures by lighting category."
            : description}
        </p>
      </section>

      <section className={styles.catalogue} aria-label="Browse LED lighting">
        <ProductsBrowser key={initialCategory} initialCategory={initialCategory} />
      </section>

      <section className={styles.quote} aria-labelledby="products-quote">
        <div>
          <h2 id="products-quote">Need help choosing?</h2>
          <p>Ask our team about fixture availability and specifications.</p>
        </div>
        <Action href="/request-quote" diagonal>
          Request a quote
        </Action>
      </section>
    </div>
  );
}
