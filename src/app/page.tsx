import Image from "next/image";
import { Box } from "lucide-react";
import { Action, ProjectCard, SectionHead } from "@/components/ui";
import { GlobalPresenceSection } from "@/components/global-presence/global-presence";
import { HomeHero } from "@/components/home-hero";
import { HomeFaq } from "@/components/home/faq";
import { ShowcaseCard } from "@/components/home/showcase";
import styles from "@/components/home/home.module.css";
import { Reveal } from "@/components/motion";
import { ProjectCarousel } from "@/components/project-carousel";
import {
  artwork,
  catalogueCategories,
  catalogueDownload,
  projects,
  publishedProducts,
} from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata(
    "LED Lighting",
    "/",
    "Bharat Lums LED lighting solutions for commercial, industrial and outdoor environments.",
  ),
  title: { absolute: "Bharat Lums | Powering a Brighter Tomorrow" },
};

const featured = [
  "led-street-lights",
  "floodlights",
  "high-bay-industrial-lighting",
  "led-industrial-lights",
  "commercial-lighting",
];

export default function Home() {
  return (
    <>
      <HomeHero catalogue={catalogueDownload} />
      <section
        className={styles.showcase}
        id="featured"
        aria-labelledby="showcase-title"
      >
        <div className="shell">
          <Reveal className={styles.showcaseIntro}>
            <p className={styles.sectionKicker}>Lighting solutions</p>
            <h2 id="showcase-title">Built to light the way.</h2>
          </Reveal>
          {featured.map((slug) => {
            const item = catalogueCategories.find(
              (category) => category.slug === slug,
            );
            if (!item) return null;
            const image = publishedProducts.find((product) =>
              product.categories.includes(slug),
            )?.images[0];
            return (
              <ShowcaseCard
                key={slug}
                item={item}
                image={image?.src ?? artwork(item.image)}
                alt={image?.alt ?? `${item.name} application concept`}
                representative={image?.representative ?? true}
              />
            );
          })}
        </div>
      </section>

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
              src={artwork("office")}
              alt="Office lighting application concept"
              fill
              sizes="(max-width: 650px) 92vw, 48vw"
            />
          </div>
        </Reveal>
      </section>

      <GlobalPresenceSection />

      <section className="section shell">
        <SectionHead
          eyebrow="Lighting concepts"
          title="Spaces transformed by light."
          href="/portfolio"
          link="Explore projects"
        />
        <ProjectCarousel>
          {projects.map((item) => (
            <ProjectCard key={item.slug} item={item} />
          ))}
        </ProjectCarousel>
      </section>

      <Reveal as="section" className="shell studio-feature">
        <div className="studio-feature-image">
          <Image
            src={artwork("office")}
            alt="Linear fixtures illuminating a boardroom concept"
            fill
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>
        <div className="studio-feature-copy">
          <p className="eyebrow">
            <Box size={16} /> Interactive 3D
          </p>
          <h2>Design with light.</h2>
          <p>
            Change the colour temperature, brightness and arrangement to see how
            a fixture changes the feel of a room.
          </p>
          <Action href="/light-studio" diagonal>
            Open the Light Studio
          </Action>
        </div>
      </Reveal>

      <HomeFaq catalogue={catalogueDownload} />
    </>
  );
}
