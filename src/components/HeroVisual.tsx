"use client";

import { HeroModelViewer } from "@/components/HeroModelViewer";

export function HeroVisual() {
  return (
    <div id="hero-visual" className="hero-visual">
      <div className="hero-visual__bob">
        <HeroModelViewer />
      </div>
    </div>
  );
}
