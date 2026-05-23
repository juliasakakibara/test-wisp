"use client";

import { useEffect } from "react";
import { installDevSecrets } from "@/lib/dev-secrets";

/** Invisible — only DevTools, Konami, and keyboard phrases notice. */
export function DevSecrets() {
  useEffect(() => installDevSecrets(), []);
  return null;
}
