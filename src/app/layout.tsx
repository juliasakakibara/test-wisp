import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getTheme } from "@/lib/actions";
import { ThemePreviewListener } from "@/components/ThemePreviewListener";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog",
  description: "A minimalist blog built with Wisp CMS",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = await getTheme();

  const themeCss = `
    :root {
      --primary: ${theme.primary};
      --background: ${theme.background};
      --foreground: ${theme.foreground};
      --radius: ${theme.radius};
    }
  `;

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
