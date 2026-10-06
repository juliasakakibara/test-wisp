import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans, Doto, Fraunces, Geist_Mono, Instrument_Serif, Inter, JetBrains_Mono, Newsreader, Space_Grotesk } from "next/font/google";
// Pancake 2 topping tokens (--lb-*) first; globals.css maps the site's tokens onto them.
import "../styles/pancake/theme.css";
import "./globals.css";
import { getConfig, getTheme } from "@/lib/site-data";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemePreviewListener } from "@/components/ThemePreviewListener";
import { DevSecrets } from "@/components/DevSecrets";
import { getSiteUrl } from "@/lib/metadata";
import { getColorModeInitScript } from "@/lib/color-mode";
import { generateSiteThemeCss } from "@/lib/theme-utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Playground topping (base on this branch): mono UI, thin serif headlines, dot-matrix numbers.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"] });
const doto = Doto({ variable: "--font-doto", subsets: ["latin"], weight: ["700"] });
// Theme font pairs (src/lib/themes.ts): not preloaded, downloaded only when a theme uses them.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], preload: false });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], preload: false });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", preload: false });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], preload: false });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  const siteUrl = getSiteUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: config.siteName,
      template: `%s | ${config.siteName}`,
    },
    description: config.siteDescription,
    applicationName: config.siteName,
    authors: [{ name: config.siteName }],
    creator: config.siteName,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: config.siteName,
      title: config.siteName,
      description: config.siteDescription,
    },
    twitter: {
      card: "summary",
      title: config.siteName,
      description: config.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Root layout — public color mode via [data-color-mode] + init script.
 * Admin theme preview uses html[data-env="admin"] (iframe only).
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Parallel: Redis theme/config used to stack ~4s each when Upstash was slow/unreachable.
  const [config, theme, headerStore] = await Promise.all([getConfig(), getTheme(), headers()]);
  const pathname = headerStore.get("x-pathname") ?? "";
  const isAdminRoute = pathname.startsWith("/admin");
  const siteThemeCss = generateSiteThemeCss(theme);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${geistMono.variable} ${newsreader.variable} ${doto.variable} ${fraunces.variable} ${dmSans.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: getColorModeInitScript() }} />
        {!isAdminRoute ? (
          <style id="__site_theme__" dangerouslySetInnerHTML={{ __html: siteThemeCss }} />
        ) : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>

      <body className={isAdminRoute ? "admin-body" : "site-body"}>
        <ThemePreviewListener />
        <DevSecrets />
        {isAdminRoute ? children : <SiteChrome config={config}>{children}</SiteChrome>}
      </body>
    </html>
  );
}
