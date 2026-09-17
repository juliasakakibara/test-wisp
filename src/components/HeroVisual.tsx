"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { HeroModelViewerLazy } from "@/components/HeroModelViewerLazy";

const CLICK_SLOP_PX = 10;
const CURSOR_CSS = `* { cursor: url("/cursors/whoami-cursor.png") 11 0, pointer !important; }`;

/** Step 4 — load + idle bob + mouse lerp + drag orbit + whoami → /about. */
export function HeroVisual() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [whoami, setWhoami] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // model-viewer shadow DOM sets its own cursor — override while whoami is active
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !whoami) return;

    let styleEl: HTMLStyleElement | null = null;
    let cancelled = false;

    const inject = () => {
      if (cancelled) return false;
      const viewer = root.querySelector("model-viewer");
      const shadow = viewer?.shadowRoot;
      if (!shadow) return false;
      styleEl = shadow.getElementById("whoami-cursor-style") as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "whoami-cursor-style";
        shadow.appendChild(styleEl);
      }
      styleEl.textContent = CURSOR_CSS;
      return true;
    };

    if (inject()) {
      return () => {
        cancelled = true;
        styleEl?.remove();
      };
    }

    const timer = window.setInterval(() => {
      if (inject()) window.clearInterval(timer);
    }, 200);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      styleEl?.remove();
    };
  }, [whoami]);

  const onPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!finePointer || event.pointerType !== "mouse") return;
      setWhoami(true);
    },
    [finePointer],
  );

  const onPointerLeave = useCallback(() => {
    setWhoami(false);
    dragStart.current = null;
  }, []);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
  }, []);

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = dragStart.current;
      dragStart.current = null;
      if (!start || event.button !== 0) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.hypot(dx, dy) > CLICK_SLOP_PX) return;

      router.push("/about");
    },
    [router],
  );

  return (
    <div
      ref={rootRef}
      id="hero-visual"
      className={`hero-visual${whoami ? " hero-visual--whoami" : ""}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="hero-visual__bob">
        <HeroModelViewerLazy />
      </div>

      <a href="/about" className="hero-visual__about-link">
        whoami — about
      </a>
    </div>
  );
}
