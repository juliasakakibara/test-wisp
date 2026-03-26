import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getTheme, getConfig } from "@/lib/actions";
import { ThemePreviewListener } from "@/components/ThemePreviewListener";
import { generateThemeCssVariables } from "@/lib/theme-utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: `${config.siteName} | Blog`,
    description: config.siteDescription,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = await getTheme();
  const themeCss = generateThemeCssVariables(theme);

  return (
    <html lang="en" className={cn(jetbrainsMono.variable, inter.variable)}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className={cn("antialiased flex flex-col min-h-screen", theme.fontFamily)}>
        <ThemePreviewListener />
        {children}
      </body>
    </html>
  );
}
