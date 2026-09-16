"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

type SiteLogoProps = {
  siteName: string;
};

export function SiteLogo({ siteName }: SiteLogoProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [lockedWidth, setLockedWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.width = "auto";
    const width = el.getBoundingClientRect().width;
    setLockedWidth(width > 0 ? width : null);
  }, [siteName]);

  useGSAP(
    () => {
      const el = titleRef.current;
      if (!el) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const original = siteName;
      let tween: gsap.core.Tween | null = null;

      const onEnter = () => {
        tween?.kill();
        tween = gsap.to(el, {
          duration: 0.7,
          scrambleText: {
            text: original,
            chars: "upperAndLowerCase",
            speed: 0.6,
          },
        });
      };

      const onLeave = () => {
        tween?.kill();
        tween = gsap.to(el, {
          duration: 0.35,
          scrambleText: {
            text: original,
            chars: "upperAndLowerCase",
            speed: 0.4,
          },
        });
      };

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        tween?.kill();
      };
    },
    { dependencies: [siteName] },
  );

  return (
    <Link href="/" className="site-logo-link">
      <span
        ref={titleRef}
        className="site-title"
        data-editable="siteName"
        data-scramble
        style={lockedWidth ? { width: `${lockedWidth}px` } : undefined}
      >
        {siteName}
      </span>
      <span className="site-title-role">ux engineer</span>
    </Link>
  );
}
