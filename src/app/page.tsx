import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box, Lightbulb, Rows3 } from "lucide-react";
import {
  Action,
  CollectionCard,
  ProjectCard,
  QuoteBanner,
  SectionHead,
} from "@/components/ui";
import { GlobalPresenceSection } from "@/components/global-presence/global-presence";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/motion";
import { ProjectCarousel } from "@/components/project-carousel";
import { artwork, featuredCollections, projects } from "@/lib/catalogue";
import { metadata as pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata("Architectural Lighting", "/", undefined, "/images/og.webp"),
  title: { absolute: "Bharat Lums | Architectural Lighting" },
};

export default function Home() {
  return (
    <>
      <HomeHero />

      <div className="feature-strip">
        <div className="shell feature-inner">
          <Link href="/collections/linear-led-lighting">
            <Rows3 size={20} /> Linear LED systems <ArrowUpRight size={13} />
          </Link>
          <Link href="/portfolio">
            <Lightbulb size={20} /> Architectural applications{" "}
            <ArrowUpRight size={13} />
          </Link>
          <Link href="/light-studio">
            <Box size={20} /> Interactive Light Studio{" "}
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      <section className="section shell" id="featured">
        <SectionHead
          eyebrow="Lighting collections"
          title="Made to shape a space."
          href="/collections"
          link="View all collections"
        />
        <div className="card-grid">
          {featuredCollections.map((item) => (
            <CollectionCard key={item.slug} item={item} />
          ))}
        </div>
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
            Change the colour temperature, brightness and arrangement. See how
            the same fixture can change the feel of a room.
          </p>
          <Action href="/light-studio" diagonal>
            Open the Light Studio
          </Action>
        </div>
      </Reveal>

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
      <GlobalPresenceSection />
      <QuoteBanner />
    </>
  );
}
