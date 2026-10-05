import type { ReactNode } from "react";
import type { SiteConfig } from "@/lib/redis";
import { HeroVisual } from "@/components/HeroVisual";

type HeroSectionProps = {
  config: Pick<SiteConfig, "heroTitle">;
};

const EMPHASIS_PATTERN = /(unconventional|unusual)/gi;

function renderHeroTitle(title: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(EMPHASIS_PATTERN.source, EMPHASIS_PATTERN.flags);

  while ((match = pattern.exec(title)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(title.slice(lastIndex, match.index));
    }
    nodes.push(
      <em key={`${match[0]}-${match.index}`} className="hero-title__emphasis">
        {match[0]}
      </em>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < title.length) {
    nodes.push(title.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [title];
}

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <section id="hero" className="hero-section site-section" aria-labelledby="hero-title">
      <div className="hero-scene">
        <div className="hero-copy">
          <div className="hero-headline">
            <h1 id="hero-title" className="hero-title" data-editable="heroTitle">
              {renderHeroTitle(config.heroTitle)}
            </h1>

            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
