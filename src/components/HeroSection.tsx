import type { SiteConfig } from "@/lib/redis";
import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

type HeroSectionProps = {
  config: Pick<SiteConfig, "heroTitle">;
};

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <section id="hero" className="hero-section site-section" aria-labelledby="hero-title">
      <div className="hero-scene">
        <div className="hero-copy">
          <div className="hero-headline">
            <h1 id="hero-title" className="hero-title" data-editable="heroTitle">
              {config.heroTitle}
            </h1>

            <div id="hero-visual" className="hero-visual">
              <HeroModelViewerLazy />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
