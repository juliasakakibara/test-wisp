"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal card row with ← → buttons (they replace "See all" on the home).
 * Native scroll with snap, so trackpads, touch and the keyboard (focus the row,
 * arrow keys) all work; the buttons page by one visible width.
 */
export function ScrollRow({ label, children }: { label: string; children: ReactNode }) {
  const rowRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setEdges({
      start: row.scrollLeft <= 1,
      end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const ro = new ResizeObserver(update);
    ro.observe(row);
    row.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      row.removeEventListener("scroll", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: dir * row.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className="pg-scroll">
      <div className="pg-scroll__buttons">
        <button type="button" className="pg-arrow" aria-label={`Previous ${label}`} disabled={edges.start} onClick={() => page(-1)}>
          ←
        </button>
        <button type="button" className="pg-arrow" aria-label={`Next ${label}`} disabled={edges.end} onClick={() => page(1)}>
          →
        </button>
      </div>
      <ul ref={rowRef} className="pg-grid pg-grid--scroll" tabIndex={0} aria-label={label}>
        {children}
      </ul>
    </div>
  );
}
