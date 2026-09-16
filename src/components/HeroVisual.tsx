"use client";

import { useEffect, useRef } from "react";
import { HeroModelViewer } from "@/components/HeroModelViewer";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function parseCssLength(raw: string): number {
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return -48;
  if (raw.trim().endsWith("rem")) return value * 16;
  return value;
}

export function HeroVisual() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parallaxRef.current;
    const hero = document.getElementById("hero");
    if (!el || !hero || prefersReducedMotion()) return;

    const styles = getComputedStyle(document.documentElement);
    const parallaxPx = parseCssLength(
      styles.getPropertyValue("--hero-parallax-y").trim() || "-3rem",
    );

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.height <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
      el.style.transform = `translate3d(0, ${progress * parallaxPx}px, 0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      el.style.transform = "";
    };
  }, []);

  return (
    <div id="hero-visual" className="hero-visual">
      <div ref={parallaxRef} className="hero-visual__parallax">
        <div className="hero-visual__bob">
          <HeroModelViewer />
        </div>
      </div>
    </div>
  );
}
