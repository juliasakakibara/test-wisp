import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getConfig, getTheme } from "@/lib/actions";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemePreviewListener } from "@/components/ThemePreviewListener";
import { DevSecrets } from "@/components/DevSecrets";
import { getSiteUrl } from "@/lib/metadata";
import { getColorModeInitScript } from "@/lib/color-mode";
import { generateSiteThemeCss } from "@/lib/theme-utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: config.siteName,
      template: `%s | ${config.siteName}`,
    },
    description: config.siteDescription,
  };
}

/**
 * Root layout — public color mode via [data-color-mode] + init script.
 * Admin theme preview uses html[data-env="admin"] (iframe only).
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = await getConfig();
  const theme = await getTheme();
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdminRoute = pathname.startsWith("/admin");
  const siteThemeCss = generateSiteThemeCss(theme);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
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
