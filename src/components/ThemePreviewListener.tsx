"use client";

import { useEffect } from "react";
import { ThemeConfig } from "@/lib/redis";

export function ThemePreviewListener() {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type !== "THEME_PREVIEW") return;
      const theme: ThemeConfig = event.data.theme;

      // Injeta as novas CSS vars em tempo real no iframe
      let style = document.getElementById("__theme_preview__");
      if (!style) {
        style = document.createElement("style");
        style.id = "__theme_preview__";
        document.head.appendChild(style);
      }
      style.textContent = `
        :root {
          --primary: ${theme.primary};
          --background: ${theme.background};
          --foreground: ${theme.foreground};
          --radius: ${theme.radius};
        }
        body {
          font-family: ${theme.fontFamily === "font-mono" ? "monospace" : theme.fontFamily === "font-serif" ? "serif" : "sans-serif"} !important;
        }
      `;
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
