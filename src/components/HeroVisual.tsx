"use client";

import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

/** Hero 3D figure: load + idle bob; drag to orbit (model-viewer). Not a link (whoami → about removed). */
export function HeroVisual() {
  return (
    <div id="hero-visual" className="hero-visual">
      <div className="hero-visual__bob">
        <HeroModelViewerLazy />
      </div>
    </div>
  );
}
