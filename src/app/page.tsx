import Image from "next/image";
import { Action } from "@/components/ui";
import { GlobalPresenceSection } from "@/components/global-presence/global-presence";
import { HomeHero } from "@/components/home-hero";
import { CatalogueSlider } from "@/components/home/catalogue-slider";
import { HomeFaq } from "@/components/home/faq";
import styles from "@/components/home/home.module.css";
import { Reveal } from "@/components/motion";
import conferenceRoom from "../../public/images/about-bharat-lums-conference.webp";
import { catalogueCategories, catalogueDownload } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata(
    "LED Lighting",
    "/",
    "Bharat Lums LED lighting solutions for commercial, industrial and outdoor environments.",
  ),
  title: { absolute: "Bharat Lums | Powering a Brighter Tomorrow" },
};

export default function Home() {
  return (
    <>
      <HomeHero catalogue={catalogueDownload} />
      <section className={styles.about} aria-labelledby="home-about">
        <Reveal className={`shell ${styles.aboutInner}`}>
          <div className={styles.aboutCopy}>
            <p className={styles.sectionKicker}>About Bharat Lums</p>
            <h2 id="home-about">Engineering brighter possibilities.</h2>
            <p>
              Bharat Lums takes a practical approach to LED lighting. Tell us
              how your space is used, what needs to be lit and where the
              fixtures will go so we can help you explore the options.
            </p>
            <Action href="/about">About Bharat Lums</Action>
          </div>
          <div className={styles.aboutArt}>
            <Image
              src={conferenceRoom}
              alt="Lighting application reference showing suspended linear LED fixtures above a conference table"
              loading="lazy"
              sizes="(max-width: 650px) 92vw, (max-width: 1450px) 41vw, 570px"
            />
          </div>
        </Reveal>
      </section>

      <CatalogueSlider categories={catalogueCategories} />

      <GlobalPresenceSection />

      <HomeFaq catalogue={catalogueDownload} />
    </>
  );
}
