import { Redis } from "@upstash/redis";

/** Redis — where theme + copy live so Julia doesn't redeploy for a typo. */
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
  // One retry max — unreachable Upstash was stacking ~4s timeouts into home TTFB.
  retry: { retries: 1, backoff: (n) => Math.min(200 * n, 400) },
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
  workSectionTitle: string;
  workSectionIntro: string;
  footerText: string;
  githubUrl: string;
  linkedinUrl: string;
}

export const DEFAULT_THEME: ThemeConfig = {
  primary: "#000000",
  background: "#ffffff",
  foreground: "#000000",
  radius: "0",
  fontFamily: "font-sans",
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: "Julia Sakakibara",
  siteDescription:
    "Design engineer portfolio — Auway (Strava for pets), Academy apps, semantic web, and hardware that fits on a collar. Cat-approved. Telepathy: beta.",
  heroTitle: "Making unconventional connections with unusual things between design and code.",
  heroDescription:
    "Designer who codes. I build things that could ship tomorrow — like a pet activity app with a smart collar smaller than anything I could buy. Also: design systems, 3D, and tilting your phone to shoot aliens.",
  aboutTitle: "/about",
  aboutIntro:
    "I've always bounced between fields — ballet, judo, philosophy, architecture. After high school I thought I had to pick one lane. Plot twist: I didn't.",
  aboutBody: `Design sits between understanding people and building things that actually work. That's what keeps me here — stealing ideas from different disciplines to solve weird, real problems.

Out of office (but still at home): devoted cat person, 3D printer enthusiast, night owl testing AI tools when the world gets quiet.

3 things about me:
▪ My brain has limited RAM — hence the lists. So many lists.
▪ I see patterns in places that probably don't need patterns. They make sense, I promise.
▪ Ambidextrous by accident (broke my right arm three times; adaptation was mandatory).

What I'm building with lately:
Next.js · TypeScript · Julia Grid · Three.js · Swift · Core Motion · Figma MCP · Wisp CMS

The thread: undergrad research (Agentic Accessibility) → Apple Developer Academy — Auway, Hairy, Byte Verse. This site is the web side of the same brain.

Thanks for stopping by. Email works. Telepathy is still in beta testing.`,
  workSectionTitle: "Selected work",
  workSectionIntro:
    "Case studies and things I'd actually pitch — starting with Auway. Context included. Pretty screenshots also included.",
  footerText: "Powered by me",
  githubUrl: "https://github.com/juliasakakibara",
  linkedinUrl: "https://www.linkedin.com/in/juliasakakibara",
};

export const CONFIG_KEY = "site_config";
export const THEME_KEY = "site_theme";

/** Legacy template footers → current copy */
export function normalizeSiteConfig(config: Partial<SiteConfig> | null | undefined): SiteConfig {
  const merged: SiteConfig = { ...DEFAULT_SITE_CONFIG, ...config };
  merged.footerText = merged.footerText
    .replace(/Powered by Synscribe/gi, "Powered by me")
    .replace(/Powered by Wisp\.?/gi, "Powered by me");
  return merged;
}
