"use client";

import { useEffect, useRef } from "react";
import { ThemeConfig } from "@/lib/redis";
import { clearInlineThemeVars } from "@/lib/color-mode";
import { generateThemeCssVariables } from "@/lib/theme-utils";

declare global {
  interface Window {
    __preview_state__?: Record<string, string>;
  }
}

function isInAdminIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return false;
  }
}

/**
 * Listens for admin iframe postMessage previews.
 * Theme/content changes are local to the iframe session — refresh restores
 * server state (Redis). Persist only via admin Save.
 */
export function ThemePreviewListener() {
  const isEditMode = useRef(false);

  useEffect(() => {
    if (!isInAdminIframe()) return;

    document.documentElement.setAttribute("data-env", "admin");
    document.documentElement.setAttribute("data-theme-preview", "true");
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");

    function handleMessage(event: MessageEvent) {
      const { type, theme, mode, field, value, config } = event.data || {};

      if (type === "SYNC_STATE") {
        window.__preview_state__ = config;
        applyEditModeToCurrentElements();
      }

      if (type === "THEME_PREVIEW" && theme) {
        applyThemePreview(theme as ThemeConfig);
      }

      if (type === "VISUAL_EDIT_MODE") {
        isEditMode.current = mode === "on";
        applyEditModeToCurrentElements();
      }

      if (type === "CONTENT_PREVIEW") {
        if (!window.__preview_state__) window.__preview_state__ = {};
        window.__preview_state__[field] = value;

        const el = document.querySelector(`[data-editable="${field}"]`);
        if (el instanceof HTMLElement && el !== document.activeElement) {
          el.innerText = value;
        }
      }
    }

    function applyThemePreview(theme: ThemeConfig) {
      clearInlineThemeVars();
      document.documentElement.setAttribute("data-env", "admin");
      document.documentElement.setAttribute("data-theme-preview", "true");

      let style = document.getElementById("__theme_preview__");
      if (!style) {
        style = document.createElement("style");
        style.id = "__theme_preview__";
        document.head.appendChild(style);
      }

      style.textContent = generateThemeCssVariables(theme);
      document.head.appendChild(style);
    }

    function applyEditModeToCurrentElements() {
      document.querySelectorAll("[data-editable]").forEach(setupElement);
    }

    function setupElement(el: Element) {
      if (!(el instanceof HTMLElement)) return;

      const enable = isEditMode.current;
      const field = el.getAttribute("data-editable");

      if (field && window.__preview_state__?.[field] && el !== document.activeElement) {
        el.innerText = window.__preview_state__[field];
      }

      el.contentEditable = enable ? "true" : "false";
      el.spellcheck = false;

      if (enable) {
        el.onclick = (e) => e.preventDefault();
        el.oninput = () => {
          const newValue = el.innerText;
          if (field) {
            if (!window.__preview_state__) window.__preview_state__ = {};
            window.__preview_state__[field] = newValue;
          }
          window.parent.postMessage(
            { type: "CONTENT_CHANGE", field, value: newValue },
            "*"
          );
        };
      } else {
        el.onclick = null;
        el.oninput = null;
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.hasAttribute("data-editable")) setupElement(node);
            node.querySelectorAll("[data-editable]").forEach(setupElement);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("message", handleMessage);

    return () => {
      observer.disconnect();
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
