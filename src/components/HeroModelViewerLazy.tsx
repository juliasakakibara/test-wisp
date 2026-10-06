"use client";

import dynamic from "next/dynamic";
import type { HeroModel } from "@/components/HeroModelViewer";

const HeroModelViewer = dynamic(
  () =>
    import("@/components/HeroModelViewer").then((mod) => mod.HeroModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="hero-viewer hero-viewer--placeholder" aria-hidden="true">
        <span className="hero-viewer__loading-label">Loading 3D…</span>
      </div>
    ),
  }
);

export function HeroModelViewerLazy({ model }: { model?: HeroModel }) {
  return <HeroModelViewer model={model} />;
}
