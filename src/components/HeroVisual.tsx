"use client";

import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";
import type { HeroModel } from "@/components/HeroModelViewer";

/** Hero 3D figure: load + idle bob; drag to orbit (model-viewer). Not a link (whoami → about removed). */
export function HeroVisual({ model }: { model?: HeroModel }) {
  return (
    <div className={`hero-visual${model === "dancing" ? " hero-visual--dancing" : ""}`}>
      <div className="hero-visual__bob">
        <HeroModelViewerLazy model={model} />
      </div>
    </div>
  );
}
