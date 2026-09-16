import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerAttributes = {
  src?: string;
  alt?: string;
  poster?: string;
  loading?: "auto" | "lazy" | "eager";
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "rotation-per-second"?: string;
  "field-of-view"?: string;
  "disable-zoom"?: boolean;
  "disable-pan"?: boolean;
  "shadow-intensity"?: number | string;
  exposure?: number | string;
  "environment-image"?: string;
  "interaction-prompt"?: "auto" | "when-focused" | "none";
  "camera-orbit"?: string;
  "camera-target"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  orientation?: string;
  "interpolation-decay"?: number | string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & ModelViewerAttributes,
        HTMLElement
      >;
    }
  }
}

export {};
