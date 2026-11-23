import Image from "next/image";
import { Action, PageIntro, QuoteBanner } from "@/components/ui";
import { artwork } from "@/lib/catalogue";
import { brand, metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("About", "/about");

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Bharat Lums"
        title={brand.tagline}
        description="We approach architectural lighting as part of the room itself. A line of light can reveal an edge, guide movement or bring attention to a surface."
      />
      <section className="shell detail-grid section-tight">
        <div className="detail-image" data-reveal>
          <Image
            src={artwork("hero")}
            alt="Suspended linear lighting in a gallery entrance concept"
            fill
            sizes="(max-width: 760px) 100vw, 56vw"
          />
        </div>
        <div className="detail-copy" data-reveal>
          <h2>Our design approach</h2>
          <p>
            Start with what people do in the space and the features they need to
            see. Then choose where to place the light, how warm it should feel
            and how it should meet the architecture.
          </p>
          <h2>Why linear lighting?</h2>
          <p>
            A continuous profile works across worktables, circulation routes and
            ceiling details. Suspended, recessed and surface-mounted
            arrangements each bring a different relationship between fixture and
            room.
          </p>
          <h2>Explore the possibilities</h2>
          <p>
            Use the Light Studio to compare arrangements, or share a drawing and
            tell us what you want the space to feel like.
          </p>
          <Action href="/light-studio" secondary>
            Open the Light Studio
          </Action>
        </div>
      </section>
      <QuoteBanner />
    </>
  );
}
