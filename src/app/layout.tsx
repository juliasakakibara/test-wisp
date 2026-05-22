import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getTheme, getConfig } from "@/lib/actions";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: `${config.siteName} | Blog`,
    description: config.siteDescription,
  };
}

/**
 * Root Layout - Server Component
 * - Reads default theme from Redis/Wisp
 * - Injects CSS Custom Properties directly into <html> for server-side rendering
 * - No client-side theme flickering (FOUC prevention)
 * - Semantic HTML structure with Header and Footer
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = await getTheme();
  const config = await getConfig();

  // Map theme object to CSS custom properties
  const themeStyle: React.CSSProperties = {
    "--primary": theme.primary,
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--radius": theme.radius,
    "--font-family": theme.fontFamily === "font-mono" ? "monospace" : theme.fontFamily === "font-serif" ? "serif" : "sans-serif",
  } as React.CSSProperties;

  const fontClass =
    theme.fontFamily === "font-mono"
      ? jetbrainsMono.variable
      : theme.fontFamily === "font-serif"
        ? "font-serif"
        : inter.variable;

  return (
    <html
      lang="en"
      className={fontClass}
      style={themeStyle}
    >
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Semantic Header */}
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
          <div className="container mx-auto max-w-6xl px-4 flex h-16 items-center justify-between">
            {/* Logo / Site Name */}
            <div className="flex gap-6 md:gap-10">
              <a href="/" className="flex items-center space-x-2">
                <span className="inline-block font-bold text-xl tracking-tighter text-[var(--foreground)]">
                  {config.siteName}
                </span>
              </a>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/" className="transition-colors hover:text-[var(--foreground)]/80 text-[var(--foreground)]">
                  Blog
                </a>
                <a href="/about" className="transition-colors hover:text-[var(--foreground)]/80 text-[var(--foreground)]/60">
                  About
                </a>
              </nav>

              {/* Theme Switcher - Client Component (isolated) */}
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Semantic Footer */}
        <footer className="border-t border-[var(--border)] py-10 md:py-16 bg-[var(--background)]">
          <div className="container mx-auto max-w-6xl px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose text-[var(--foreground)]/60 md:text-left">
                {config.footerText}
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
