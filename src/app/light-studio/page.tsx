import Studio from "@/components/studio";
import { PageIntro } from "@/components/ui";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Light Studio", "/light-studio");

export default function StudioPage() {
  return (
    <>
      <PageIntro
        eyebrow="Interactive Light Studio"
        title="Design with light."
        description="One light. Infinite possibilities. Compare linear arrangements, adjust the light and preview your choices in four room environments."
      />
      <div className="shell section-tight">
        <Studio />
      </div>
    </>
  );
}
