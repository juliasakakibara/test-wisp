"use client";

import { useState } from "react";

/** Share this page: the system share sheet where there is one, otherwise copy the link. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // dismissed or unsupported: fall through to copying
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; nothing else to do
    }
  }

  return (
    <button type="button" className="pg-pill pg-pill--center" onClick={share}>
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
