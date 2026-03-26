"use client";

import { useEffect, useRef } from "react";
import { ThemeConfig } from "@/lib/redis";
import { generateThemeCssVariables } from "@/lib/theme-utils";

// Extende a interface window para o TS não reclamar
declare global {
  interface Window {
    __preview_state__?: Record<string, string>;
  }
}

export function ThemePreviewListener() {
  const isEditMode = useRef(false);

  useEffect(() => {
    // ── Notifica o Pai que o Iframe está pronto ──
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");

    function handleMessage(event: MessageEvent) {
      const { type, theme, mode, field, value, config } = event.data || {};

      // ── Sincronização de Estado Completo (Memória Temporária) ──
      if (type === "SYNC_STATE") {
        window.__preview_state__ = config;
        applyEditModeToCurrentElements(); // Re-aplica aos elementos que já existem
      }

      // ── Tema ──
      if (type === "THEME_PREVIEW") {
        let style = document.getElementById("__theme_preview__");
        if (!style) {
          style = document.createElement("style");
          style.id = "__theme_preview__";
          document.head.appendChild(style);
        }
        
        const themeCss = generateThemeCssVariables(theme);
        style.textContent = `
          ${themeCss}
          body { font-family: ${theme.fontFamily === "font-mono" ? "monospace" : theme.fontFamily === "font-serif" ? "serif" : "sans-serif"} !important; }
        `;
      }

      // ── Modo Edição Visual (Ativar/Desativar Global) ──
      if (type === "VISUAL_EDIT_MODE") {
        isEditMode.current = mode === "on";
        applyEditModeToCurrentElements();
        injectVisualStyles(isEditMode.current);
      }

      // ── Sync do Sidebar para o Iframe (Individual) ──
      if (type === "CONTENT_PREVIEW") {
        if (!window.__preview_state__) window.__preview_state__ = {};
        window.__preview_state__[field] = value;
        
        const el = document.querySelector(`[data-editable="${field}"]`);
        if (el instanceof HTMLElement && el !== document.activeElement) {
          el.innerText = value;
        }
      }
    }

    function injectVisualStyles(enable: boolean) {
      let style = document.getElementById("__visual_edit_styles__");
      if (!style) {
        style = document.createElement("style");
        style.id = "__visual_edit_styles__";
        document.head.appendChild(style);
      }
      style.textContent = enable ? `
        [data-editable] {
          outline: 2px dashed rgba(59, 130, 246, 0.4) !important;
          outline-offset: 4px !important;
          cursor: text !important;
        }
        [data-editable]:hover {
          outline-color: rgba(59, 130, 246, 0.8) !important;
        }
      ` : "";
    }

    function applyEditModeToCurrentElements() {
      const editables = document.querySelectorAll("[data-editable]");
      editables.forEach(setupElement);
    }

    function setupElement(el: Element) {
      if (!(el instanceof HTMLElement)) return;
      const enable = isEditMode.current;
      const field = el.getAttribute("data-editable");
      
      // Se tivermos um valor na memória temporária para este campo, aplica agora
      if (field && window.__preview_state__?.[field]) {
        if (el !== document.activeElement) {
          el.innerText = window.__preview_state__[field];
        }
      }

      el.contentEditable = enable ? "true" : "false";
      
      if (enable) {
        // Previne navegação se for link
        (el as any).onclick = (e: MouseEvent) => e.preventDefault();
        
        // Sync de volta para o pai
        el.oninput = () => {
          const newValue = el.innerText;
          // Atualiza a memória local também
          if (field) {
            if (!window.__preview_state__) window.__preview_state__ = {};
            window.__preview_state__[field] = newValue;
          }
          
          window.parent.postMessage({
            type: "CONTENT_CHANGE",
            field: field,
            value: newValue
          }, "*");
        };
      } else {
        (el as any).onclick = null;
        el.oninput = null;
      }
    }

    // ── Mutation Observer para detectar novas rotas/elementos ──
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
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
