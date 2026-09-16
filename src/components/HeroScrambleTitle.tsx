"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const SCRAMBLE_WORDS = ["unconventional", "unusual"] as const;

type HeroScrambleTitleProps = {
  title: string;
};

function splitTitle(title: string): Array<{ text: string; scramble: boolean }> {
  const pattern = new RegExp(`(${SCRAMBLE_WORDS.join("|")})`, "gi");
  return title.split(pattern).filter(Boolean).map((part) => ({
    text: part,
    scramble: SCRAMBLE_WORDS.some((word) => word.toLowerCase() === part.toLowerCase()),
  }));
}

export function HeroScrambleTitle({ title }: HeroScrambleTitleProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const targets = root.querySelectorAll<HTMLElement>("[data-scramble]");
      const cleanups: Array<() => void> = [];

      targets.forEach((el) => {
        const original = el.dataset.scrambleText ?? el.textContent ?? "";
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
        cleanups.push(() => {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
          tween?.kill();
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: rootRef, dependencies: [title] },
  );

  const parts = splitTitle(title);

  return (
    <h1 id="hero-title" className="hero-title" data-editable="heroTitle" ref={rootRef}>
      {parts.map((part, index) =>
        part.scramble ? (
          <span
            key={`${part.text}-${index}`}
            className="hero-title__scramble"
            data-scramble
            data-scramble-text={part.text}
          >
            {part.text}
          </span>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </h1>
  );
}
