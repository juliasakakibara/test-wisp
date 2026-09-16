"use client";

import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

/** Step 4 — load + idle bob + mouse lerp + drag orbit. */
export function HeroVisual() {
  return (
    <div id="hero-visual" className="hero-visual">
      <div className="hero-visual__bob">
        <HeroModelViewerLazy />
      </div>
    </div>
  );
}
