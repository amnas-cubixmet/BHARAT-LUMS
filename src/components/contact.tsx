import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { brand } from "@/lib/site";
import { deliveryEnabled } from "@/lib/delivery";
import { enquiryEmailHref } from "@/lib/enquiry";
import EnquiryForm from "./enquiry-form";
import styles from "./contact.module.css";

export function ContactSection({
  defaults,
}: {
  defaults?: { interest?: string; message?: string };
}) {
  const whatsappNumber = brand.phoneHref.replace(/\D/g, "");

  return (
    <section
      className={`shell section-tight contact-grid ${styles.layout}`}
      aria-label="Enquiry form and contact details"
    >
      <aside className={styles.panel} aria-labelledby="contact-team">
        <h2 id="contact-team">Contact our team</h2>
        <p className={styles.person}>
          <strong>Suhail Kidangayam</strong>
          Co-founder, Bharat Lums
        </p>
        <ul className={styles.methods}>
          <li>
            <a href={enquiryEmailHref(brand.email)}>
              <Mail size={19} aria-hidden="true" />
              <span>
                <strong>Email</strong>
                {brand.email}
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={brand.phoneHref}>
              <Phone size={19} aria-hidden="true" />
              <span>
                <strong>Call</strong>
                {brand.phone}
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} aria-hidden="true" />
              <span>
                <strong>WhatsApp</strong>
                Chat with our team
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </aside>
      <div className={styles.panel}>
        <h2 className={styles.formHeading} id="enquiry-title">
          Project enquiry
        </h2>
        <EnquiryForm
          online={deliveryEnabled()}
          email={brand.email}
          whatsappNumber={whatsappNumber}
          defaults={defaults}
        />
      </div>
    </section>
  );
}
