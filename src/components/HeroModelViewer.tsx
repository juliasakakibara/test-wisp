"use client";

import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

const MODEL_SRC = "/models/hero.glb";

/** Step 4 — load + bob + mouse lerp + camera-controls on drag. */
const BASE_THETA = 0;
const BASE_PHI = 80;
const BASE_RADIUS = 135;
const POINTER_THETA_RANGE = 20;
/** Vertical orbit follow — inverted so mouse up tilts the expected way */
const POINTER_PHI_RANGE = 20;
const LERP = 0.01;

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string;
  exposure: number;
  shadowIntensity: number;
  environmentImage: string;
  addEventListener(
    type: "progress" | "load",
    listener: EventListenerOrEventListenerObject,
  ): void;
  removeEventListener(
    type: "progress" | "load",
    listener: EventListenerOrEventListenerObject,
  ): void;
};

const LIGHTING = {
  light: {
    exposure: 1.5,
    shadowIntensity: 0.9,
    /** Local 1k HDR — Poly Haven brown_photostudio_02 (warm-neutral softbox, not white/yellow) */
    environmentImage: "/environments/hero-light.hdr",
  },
  dark: {
    exposure: 0.85,
    shadowIntensity: 1.8,
    /** Local 1k HDR — indoor workshop bounce for cooler face light in dark mode */
    environmentImage: "/environments/hero-dark.hdr",
  },
} as const;

function getDocumentColorMode(): "light" | "dark" {
  const fun = document.documentElement.getAttribute("data-fun-theme");
  if (fun === "matrix" || fun === "virtualboy") return "dark";
  if (
    fun === "nier" ||
    fun === "rebeccapurple" ||
    fun === "sunset" ||
    fun === "zengarden"
  ) {
    return "light";
  }
  const mode = document.documentElement.getAttribute("data-color-mode");
  return mode === "dark" ? "dark" : "light";
}

function applyHeroLighting(viewer: ModelViewerElement, mode: "light" | "dark") {
  const next = LIGHTING[mode];
  try {
    viewer.exposure = next.exposure;
    viewer.shadowIntensity = next.shadowIntensity;
    viewer.environmentImage = next.environmentImage;
  } catch {
    /* model-viewer may not be ready */
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatOrbit(theta: number, phi: number) {
  return `${theta.toFixed(2)}deg ${phi.toFixed(2)}deg ${BASE_RADIUS}%`;
}

function parseOrbit(orbit: string): { theta: number; phi: number } | null {
  const parts = orbit.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const theta = Number.parseFloat(parts[0]);
  const phi = Number.parseFloat(parts[1]);
  if (Number.isNaN(theta) || Number.isNaN(phi)) return null;
  return { theta, phi };
}

export function HeroModelViewer() {
  const viewerRef = useRef<ModelViewerElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ totalProgress: number }>).detail;
      setProgress(detail.totalProgress);
    };
    const onLoad = () => {
      setLoaded(true);
      setProgress(1);
      applyHeroLighting(viewer, getDocumentColorMode());
    };

    viewer.addEventListener("progress", onProgress);
    viewer.addEventListener("load", onLoad);

    return () => {
      viewer.removeEventListener("progress", onProgress);
      viewer.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !loaded) return;

    const syncLighting = () => {
      applyHeroLighting(viewer, getDocumentColorMode());
    };

    syncLighting();

    const observer = new MutationObserver(syncLighting);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-mode", "data-fun-theme"],
    });

    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const viewer = viewerRef.current;
    const shell = shellRef.current;
    if (!viewer || !shell) return;

    viewer.cameraOrbit = formatOrbit(BASE_THETA, BASE_PHI);

    if (prefersReducedMotion()) return;

    const pointer = { x: 0, y: 0 };
    const current = { theta: BASE_THETA, phi: BASE_PHI };
    /** Mouse offsets from this orbit — updated after drag so follow doesn't yank back to base. */
    const anchor = { theta: BASE_THETA, phi: BASE_PHI };
    let dragging = false;
    let raf = 0;
    let active = true;

    const syncFromViewer = () => {
      const parsed = parseOrbit(viewer.cameraOrbit);
      if (!parsed) return;
      current.theta = parsed.theta;
      current.phi = parsed.phi;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || dragging) return;
      const rect = shell.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));
    };

    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
      dragging = false;
      anchor.theta = BASE_THETA;
      anchor.phi = BASE_PHI;
      current.theta = BASE_THETA;
      current.phi = BASE_PHI;
      try {
        viewer.cameraOrbit = formatOrbit(BASE_THETA, BASE_PHI);
      } catch {
        /* viewer may be tearing down */
      }
    };

    const onDragStart = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      dragging = true;
    };

    const onDragEnd = () => {
      if (!dragging) return;
      dragging = false;
      syncFromViewer();
      anchor.theta = current.theta;
      anchor.phi = current.phi;
      pointer.x = 0;
      pointer.y = 0;
    };

    const tick = () => {
      if (!active || !viewer.isConnected) return;

      if (!dragging) {
        const targetTheta = anchor.theta - pointer.x * POINTER_THETA_RANGE;
        const targetPhi = anchor.phi - pointer.y * POINTER_PHI_RANGE;

        current.theta += (targetTheta - current.theta) * LERP;
        current.phi += (targetPhi - current.phi) * LERP;

        try {
          viewer.cameraOrbit = formatOrbit(current.theta, current.phi);
        } catch {
          active = false;
          return;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const hero = document.getElementById("hero") ?? shell;
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    viewer.addEventListener("pointerdown", onDragStart as EventListener);
    window.addEventListener("pointerup", onDragEnd);
    window.addEventListener("pointercancel", onDragEnd);
    raf = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      viewer.removeEventListener("pointerdown", onDragStart as EventListener);
      window.removeEventListener("pointerup", onDragEnd);
      window.removeEventListener("pointercancel", onDragEnd);
    };
  }, [loaded]);

  return (
    <div
      ref={shellRef}
      className={`hero-viewer${loaded ? " is-loaded" : ""}`}
      aria-label="3D portfolio model"
    >
      <model-viewer
        ref={viewerRef}
        className="hero-viewer__canvas"
        src={MODEL_SRC}
        alt="Interactive 3D portfolio model"
        loading="lazy"
        camera-controls
        disable-zoom
        disable-pan
        shadow-intensity={LIGHTING.light.shadowIntensity}
        exposure={LIGHTING.light.exposure}
        environment-image={LIGHTING.light.environmentImage}
        interaction-prompt="none"
        interpolation-decay="40"
        camera-orbit={formatOrbit(BASE_THETA, BASE_PHI)}
        min-camera-orbit="auto 55deg 100%"
        max-camera-orbit="auto 95deg 170%"
        camera-target="0m 0.9m 0m"
        field-of-view="28deg"
      >
        <div
          slot="progress-bar"
          className={`hero-viewer__progress${loaded ? " hero-viewer__progress--hidden" : ""}`}
          aria-hidden="true"
        >
          <div
            className="hero-viewer__progress-bar"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </model-viewer>
    </div>
  );
}
