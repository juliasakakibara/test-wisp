"use client";

import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

/** Step 3 — load + idle bob + mouse orbit lerp (via HeroModelViewer). */
export function HeroVisual() {
  return (
    <div id="hero-visual" className="hero-visual">
      <div className="hero-visual__bob">
        <HeroModelViewerLazy />
      </div>
    </div>
  );
}
