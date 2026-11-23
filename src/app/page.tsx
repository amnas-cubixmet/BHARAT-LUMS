import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Box, Lightbulb, Rows3 } from "lucide-react";
import {
  Action,
  CollectionCard,
  ProjectCard,
  QuoteBanner,
  SectionHead,
} from "@/components/ui";
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
      <section className="hero">
        <div className="hero-art">
          <Image src={artwork("hero")} alt="" fill preload sizes="100vw" />
        </div>
        <div className="hero-shade" />
        <div className="hero-installation" aria-hidden="true">
          <svg viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice">
            {[
              [940, 189, 1525, 243],
              [813, 296, 1300, 329],
              [716, 385, 1118, 406],
              [670, 447, 970, 457],
            ].map(([x1, y1, x2, y2]) => (
              <g key={x1} data-fixture>
                <path
                  d={`M ${x1 + 65} 0 V ${y1} M ${x2 - 70} 0 V ${y2 - 6}`}
                  stroke="#807168"
                  opacity=".35"
                />
                <path
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  stroke="#221d18"
                  strokeWidth="13"
                />
                <path
                  data-diffuser
                  d={`M ${x1} ${y1 + 3} L ${x2} ${y2 + 3}`}
                  stroke="#ffe5c6"
                  strokeWidth="6"
                />
              </g>
            ))}
          </svg>
        </div>
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow" data-intro>
              <span /> Architectural lighting
            </p>
            <h1 data-intro>
              LIGHT BEYOND
              <br />
              <em>LIMITS.</em>
            </h1>
            <p className="hero-description" data-intro>
              Architectural lighting crafted to transform spaces.
            </p>
            <div className="hero-actions" data-intro>
              <Action href="/collections">Explore our collections</Action>
              <Action href="/portfolio" secondary diagonal>
                Discover our projects
              </Action>
            </div>
          </div>
          <div className="hero-footer">
            <a className="hero-scroll" href="#featured">
              <span>
                <ArrowDown size={16} />
              </span>{" "}
              Scroll to explore
            </a>
            <p>
              Suspended linear lighting <span> / </span> Concept installation
            </p>
          </div>
        </div>
      </section>

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

      <section className="shell studio-feature" data-reveal>
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
      </section>

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
      <QuoteBanner />
    </>
  );
}
