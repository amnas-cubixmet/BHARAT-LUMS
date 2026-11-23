import { ContactSection } from "@/components/contact";
import { PageIntro } from "@/components/ui";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Contact", "/contact");

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact Bharat Lums"
        title="Let’s talk lighting."
        description="Ask about a lighting family, discuss an application or share the details of your project."
      />
      <ContactSection />
    </>
  );
}
