import { ContactSection } from "@/components/contact";
import { PageIntro } from "@/components/ui";
import { collections, products } from "@/lib/catalogue";
import { studioSchema } from "@/lib/enquiry";
import { metadata as pageMetadata } from "@/lib/site";
import { summarizeSetup } from "@/lib/studio";

export const metadata = pageMetadata("Request a Quote", "/request-quote");

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const configuration = studioSchema.safeParse(query);
  const product = products.find((item) => item.slug === query.product);
  const collection = collections.find((item) => item.slug === query.collection);
  const defaults = configuration.success
    ? {
        interest: "Linear LED Lighting",
        message: `Light Studio configuration\n${summarizeSetup(configuration.data)}\n\nProject details\n`,
      }
    : { interest: product?.name ?? collection?.name };
  return (
    <>
      <PageIntro
        eyebrow="Project enquiry"
        title="Request a quote."
        description="Share what you are planning and the lighting you need. Include quantities and project location where available."
      />
      {configuration.success && (
        <div className="shell" style={{ marginBottom: 22 }}>
          <div className="empty-state">
            <strong>Light Studio configuration</strong>
            <p>{summarizeSetup(configuration.data)}</p>
          </div>
        </div>
      )}
      <ContactSection defaults={defaults} />
    </>
  );
}
