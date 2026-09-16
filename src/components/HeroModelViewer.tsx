"use client";

import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

const MODEL_SRC = "/models/hero.glb";

const BASE_THETA = 12;
const BASE_PHI = 78;
const BASE_RADIUS = 135;
const BASE_TARGET_Y = 0.9;

const YAW_RANGE = 28;
const PITCH_RANGE = 12;
const LERP = 0.08;

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string;
  orientation: string;
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

function formatOrbit(theta: number, phi: number, radius = BASE_RADIUS) {
  return `${theta.toFixed(2)}deg ${phi.toFixed(2)}deg ${radius}%`;
}

function formatOrientation(pitch: number, yaw: number, roll = 0) {
  return `${pitch.toFixed(2)}deg ${yaw.toFixed(2)}deg ${roll.toFixed(2)}deg`;
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

    try {
      viewer.cameraOrbit = formatOrbit(BASE_THETA, BASE_PHI);
      viewer.orientation = formatOrientation(0, 0);
    } catch {
      return;
    }

    if (prefersReducedMotion()) return;

    const pointer = { x: 0, y: 0 };
    const current = { pitch: 0, yaw: 0 };
    let dragging = false;
    let raf = 0;
    let active = true;

    const hero = document.getElementById("hero") ?? shell;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || dragging) return;
      const rect = hero.getBoundingClientRect();
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
      if (!viewer.isConnected) return;
      try {
        viewer.cameraOrbit = formatOrbit(BASE_THETA, BASE_PHI);
      } catch {
        /* model-viewer may be tearing down */
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      dragging = true;
    };

    const onPointerUp = () => {
      dragging = false;
    };

    const tick = () => {
      if (!active || !viewer.isConnected) return;

      const targetYaw = dragging ? current.yaw : pointer.x * YAW_RANGE;
      const targetPitch = dragging ? current.pitch : -pointer.y * PITCH_RANGE;

      const nextYaw = current.yaw + (targetYaw - current.yaw) * LERP;
      const nextPitch = current.pitch + (targetPitch - current.pitch) * LERP;

      if (Math.abs(nextYaw - current.yaw) > 0.01 || Math.abs(nextPitch - current.pitch) > 0.01) {
        current.yaw = nextYaw;
        current.pitch = nextPitch;
        try {
          viewer.orientation = formatOrientation(current.pitch, current.yaw);
        } catch {
          active = false;
          return;
        }
      } else {
        current.yaw = nextYaw;
        current.pitch = nextPitch;
      }

      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    viewer.addEventListener("pointerdown", onPointerDown as EventListener);
    window.addEventListener("pointerup", onPointerUp);
    raf = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      viewer.removeEventListener("pointerdown", onPointerDown as EventListener);
      window.removeEventListener("pointerup", onPointerUp);
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
        shadow-intensity="1.2"
        exposure="1.1"
        environment-image="legacy"
        interaction-prompt="none"
        interpolation-decay="40"
        orientation={formatOrientation(0, 0)}
        camera-orbit={formatOrbit(BASE_THETA, BASE_PHI)}
        min-camera-orbit="auto 55deg 100%"
        max-camera-orbit="auto 95deg 170%"
        camera-target={`0m ${BASE_TARGET_Y}m 0m`}
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
