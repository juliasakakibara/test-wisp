"use client";

import { useEffect } from "react";

/** /about → /#about — because one-page life chose us. */
export function AboutRedirect() {
  useEffect(() => {
    // Full navigation so the hash actually lands. SPA purists, look away.
    window.location.replace("/#about");
  }, []);

  return null;
}
