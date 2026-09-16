import type { SiteConfig } from "@/lib/redis";
import { HeroVisual } from "@/components/HeroVisual";

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

            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
