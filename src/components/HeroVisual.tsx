"use client";

import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

/** Client wrapper — keeps model-viewer behind dynamic(ssr:false). */
export function HeroVisual() {
  return (
    <div id="hero-visual" className="hero-visual">
      <HeroModelViewerLazy />
    </div>
  );
}
