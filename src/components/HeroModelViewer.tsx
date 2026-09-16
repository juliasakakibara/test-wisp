"use client";

import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

const MODEL_SRC = "/models/hero.glb";

type ModelViewerElement = HTMLElement & {
  addEventListener(
    type: "progress",
    listener: (event: CustomEvent<{ totalProgress: number }>) => void
  ): void;
  removeEventListener(
    type: "progress",
    listener: (event: CustomEvent<{ totalProgress: number }>) => void
  ): void;
};

export function HeroModelViewer() {
  const viewerRef = useRef<ModelViewerElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const onProgress = (event: CustomEvent<{ totalProgress: number }>) => {
      setProgress(event.detail.totalProgress);
    };
    const onLoad = () => {
      setLoaded(true);
      setProgress(1);
    };

    viewer.addEventListener("progress", onProgress as EventListener);
    viewer.addEventListener("load", onLoad);

    return () => {
      viewer.removeEventListener("progress", onProgress as EventListener);
      viewer.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div
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
        camera-orbit="12deg 78deg 135%"
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
