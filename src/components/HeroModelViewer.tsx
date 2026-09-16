"use client";

import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

const MODEL_SRC = "/models/hero.glb";

const BASE_THETA = 12;
const BASE_PHI = 78;
const BASE_RADIUS = 135;
const IDLE_DEG_PER_SEC = 6;
const POINTER_THETA_RANGE = 18;
const POINTER_PHI_RANGE = 10;
const LERP = 0.07;

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string;
  addEventListener(
    type: "progress" | "load",
    listener: EventListenerOrEventListenerObject,
  ): void;
  removeEventListener(
    type: "progress" | "load",
    listener: EventListenerOrEventListenerObject,
  ): void;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatOrbit(theta: number, phi: number) {
  return `${theta.toFixed(2)}deg ${phi.toFixed(2)}deg ${BASE_RADIUS}%`;
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
    };

    viewer.addEventListener("progress", onProgress);
    viewer.addEventListener("load", onLoad);

    return () => {
      viewer.removeEventListener("progress", onProgress);
      viewer.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const viewer = viewerRef.current;
    const shell = shellRef.current;
    if (!viewer || !shell) return;

    if (prefersReducedMotion()) {
      viewer.cameraOrbit = formatOrbit(BASE_THETA, BASE_PHI);
      return;
    }

    const pointer = { x: 0, y: 0 };
    const current = { theta: BASE_THETA, phi: BASE_PHI };
    let idleYaw = 0;
    let raf = 0;
    let last = performance.now();
    let active = true;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
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
    };

    const tick = (now: number) => {
      if (!active || !viewer.isConnected) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      idleYaw += IDLE_DEG_PER_SEC * dt;
      const targetTheta = BASE_THETA + idleYaw + pointer.x * POINTER_THETA_RANGE;
      const targetPhi = BASE_PHI - pointer.y * POINTER_PHI_RANGE;

      current.theta += (targetTheta - current.theta) * LERP;
      current.phi += (targetPhi - current.phi) * LERP;

      try {
        viewer.cameraOrbit = formatOrbit(current.theta, current.phi);
      } catch {
        active = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const hero = document.getElementById("hero") ?? shell;
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
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
        disable-zoom
        disable-pan
        shadow-intensity="1.2"
        exposure="1.1"
        environment-image="legacy"
        interaction-prompt="none"
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
