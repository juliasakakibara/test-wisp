"use client";

import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

/** Step 2 — load + idle bob Y. Mouse follow comes next. */
export function HeroVisual() {
  return (
    <div id="hero-visual" className="hero-visual">
      <div className="hero-visual__bob">
        <HeroModelViewerLazy />
      </div>
    </div>
  );
}
