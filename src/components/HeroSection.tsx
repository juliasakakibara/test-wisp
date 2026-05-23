import type { SiteConfig } from "@/lib/redis";
import { HeroCta } from "@/components/HeroCta";
import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";
import { heroPixelFont } from "@/assets/fonts/hero/hero-font";

type HeroSectionProps = {
  config: Pick<SiteConfig, "heroTitle" | "heroDescription" | "githubUrl" | "linkedinUrl">;
};

const MARQUEE_ITEMS = ["Design", "Brand", "Web", "Pixel", "3D", "Portfolio"];

export function HeroSection({ config }: HeroSectionProps) {
  const marqueeText = MARQUEE_ITEMS.map((item) => `${item} ·`).join(" ");

  return (
    <section id="hero" className="hero-section site-section" aria-labelledby="hero-title">
      <div className="hero-scene">
        <div className="hero-copy">
          <div id="hero-meta" className="hero-meta">
            <span className="hero-meta__item">Portfolio 2025</span>
            <span className="hero-meta__sep" aria-hidden="true">
              /
            </span>
            <span className="hero-meta__item">Graphic &amp; Web</span>
          </div>

          <div className="hero-headline">
            <h1
              id="hero-title"
              className={`hero-title ${heroPixelFont.className} hero-type`}
              data-editable="heroTitle"
            >
              {config.heroTitle}
            </h1>

            <div id="hero-visual" className="hero-visual">
              <HeroModelViewerLazy />
            </div>
          </div>

          <p className="hero-lead" data-editable="heroDescription">
            {config.heroDescription}
          </p>

          <HeroCta githubUrl={config.githubUrl} linkedinUrl={config.linkedinUrl} />
        </div>

        <p className="hero-scroll-cue" aria-hidden="true">
          scroll
        </p>
      </div>

      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee__track">
          <span className="hero-marquee__text">{marqueeText}</span>
          <span className="hero-marquee__text">{marqueeText}</span>
        </div>
      </div>
    </section>
  );
}
