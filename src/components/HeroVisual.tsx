"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HeroVisual() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = parallaxRef.current;
      if (!el) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const styles = getComputedStyle(document.documentElement);
      const parallaxY = styles.getPropertyValue("--hero-parallax-y").trim() || "-3rem";

      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: parallaxY,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [] },
  );

  return (
    <div id="hero-visual" className="hero-visual">
      <div ref={parallaxRef} className="hero-visual__parallax">
        <HeroModelViewerLazy />
      </div>
    </div>
  );
}
