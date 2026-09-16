import type { SiteConfig } from "@/lib/redis";
import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";
import { HeroScrambleTitle } from "@/components/HeroScrambleTitle";

type HeroSectionProps = {
  config: Pick<SiteConfig, "heroTitle">;
};

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <section id="hero" className="hero-section site-section" aria-labelledby="hero-title">
      <div className="hero-scene">
        <div className="hero-copy">
          <div className="hero-headline">
            <HeroScrambleTitle title={config.heroTitle} />

            <div id="hero-visual" className="hero-visual">
              <HeroModelViewerLazy />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
