import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  redis,
  THEME_KEY,
  DEFAULT_THEME,
  type ThemeConfig,
  CONFIG_KEY,
  type SiteConfig,
  normalizeSiteConfig,
} from "@/lib/redis";

/** Cross-request cache for theme — layout + admin share this; bust via `site-theme` tag. */
const loadTheme = unstable_cache(
  async (): Promise<ThemeConfig> => {
    try {
      const theme = await redis.get<ThemeConfig>(THEME_KEY);
      return theme ?? DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  },
  ["site-theme"],
  { revalidate: 60, tags: ["site-theme"] },
);

/** Cross-request cache for site copy — same TTL as page ISR. */
const loadConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    try {
      const config = await redis.get<SiteConfig>(CONFIG_KEY);
      return normalizeSiteConfig(config);
    } catch {
      return normalizeSiteConfig(null);
    }
  },
  ["site-config"],
  { revalidate: 60, tags: ["site-config"] },
);

/** Request-deduped theme read (generateMetadata + layout share one call). */
export const getTheme = cache(() => loadTheme());

/** Request-deduped config read. */
export const getConfig = cache(() => loadConfig());
