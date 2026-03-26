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

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutBody: string;
  footerText: string;
}

export const DEFAULT_THEME: ThemeConfig = {
  primary: "oklch(0.508 0.118 165.612)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.153 0.006 107.1)",
  radius: "0",
  fontFamily: "font-mono",
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: "Travel.",
  siteDescription: "A minimalist travel and lifestyle blog",
  heroTitle: "Stories & Ideas.",
  heroDescription: "A minimalist travel and lifestyle blog template powered by Wisp CMS.",
  aboutTitle: "About Us.",
  aboutIntro: "We are documenting the world one story at a time.",
  aboutBody: "This blog was built with Wisp CMS, Next.js, and Shadcn UI. The idea is to keep things minimal — great content first, design second.",
  footerText: "Built by Samantha. Powered by Wisp.",
};

export const THEME_KEY = "site_theme";
export const CONFIG_KEY = "site_config";
