import { brand } from "@/lib/site";
import EnquiryForm from "./enquiry-form";
import { Reveal } from "./motion";

export function HomeEnquiry() {
  return (
    <section id="contact-enquiry" className="shell section-tight" aria-labelledby="enquiry-title">
      <Reveal className="mx-auto w-full max-w-3xl">
        <h2 id="enquiry-title" className="mb-6 text-center text-3xl font-bold md:text-5xl">Send an enquiry</h2>
        <EnquiryForm home online email={brand.email} whatsappNumber={brand.phoneHref.replace(/\D/g, "")} />
      </Reveal>
    </section>
  );
}
