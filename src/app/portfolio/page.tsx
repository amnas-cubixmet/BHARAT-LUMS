import { ProjectsBrowser } from "@/components/browse";
import { PageIntro, QuoteBanner } from "@/components/ui";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Lighting Projects", "/portfolio");

export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        eyebrow="Concept / inspiration"
        title="Spaces transformed by light."
        description="Explore how linear light, warm accents and directional beams can change the character of a room."
      />
      <section className="shell section-tight" aria-label="Project concepts">
        <ProjectsBrowser />
      </section>
      <QuoteBanner />
    </>
  );
}
