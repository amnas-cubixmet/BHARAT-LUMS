import { Mail, Phone } from "lucide-react";
import { brand } from "@/lib/site";
import { deliveryEnabled } from "@/lib/delivery";
import EnquiryForm from "./enquiry-form";

export function ContactSection({
  defaults,
}: {
  defaults?: { interest?: string; message?: string };
}) {
  return (
    <section
      className="shell section-tight contact-grid"
      aria-label="Enquiry form and contact details"
    >
      <aside className="contact-panel">
        <h2>Contact our team</h2>
        <p>
          Suhail Kidangayam
          <br />
          Co-founder, Bharat Lums
        </p>
        <a className="text-link" href={`mailto:${brand.email}`}>
          <Mail size={16} />
          {brand.email}
        </a>
        <a className="text-link" href={brand.phoneHref}>
          <Phone size={16} />
          {brand.phone}
        </a>
      </aside>
      <EnquiryForm
        online={deliveryEnabled()}
        email={brand.email}
        whatsappNumber={brand.phoneHref.replace(/\D/g, "")}
        defaults={defaults}
      />
    </section>
  );
}
