import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Action, PageIntro, QuoteBanner } from "@/components/ui";
import { artwork } from "@/lib/catalogue";
import { brand, metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("About", "/about");

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow={brand.tagline}
        title="Engineering brighter possibilities."
        description="Bharat Lums offers LED lighting solutions for commercial, industrial and outdoor environments."
      />
      <section className="shell detail-grid section-tight">
        <Reveal className="detail-image">
          <Image
            src={artwork("about-bharat-lums-conference")}
            alt="Suspended linear lighting above a conference table"
            fill
            loading="lazy"
            sizes="(max-width: 760px) 100vw, 56vw"
          />
        </Reveal>
        <Reveal className="detail-copy">
          <h2>Our design approach</h2>
          <p>
            Start with what people do in the space and the features they need to
            see. Then choose where to place the light, how warm it should feel
            and how it should meet the architecture.
          </p>
          <Action href="/products" secondary>
            Explore LED lighting
          </Action>
        </Reveal>
      </section>
      <QuoteBanner />
    </>
  );
}
