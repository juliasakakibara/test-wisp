import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export interface ThemeConfig {
  primary: string;
  background: string;
  foreground: string;
  radius: string;
  fontFamily: string;
}

export const DEFAULT_THEME: ThemeConfig = {
  primary: "oklch(0.508 0.118 165.612)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.153 0.006 107.1)",
  radius: "0",
  fontFamily: "font-mono",
};

export const THEME_KEY = "site_theme";
