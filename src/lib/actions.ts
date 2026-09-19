"use server";

import { redis, THEME_KEY, ThemeConfig, CONFIG_KEY, SiteConfig } from "@/lib/redis";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function saveTheme(theme: ThemeConfig) {
  await redis.set(THEME_KEY, theme);
  revalidateTag("site-theme", "max");
  revalidatePath("/", "layout");
}

export async function saveConfig(config: SiteConfig) {
  await redis.set(CONFIG_KEY, config);
  revalidateTag("site-config", "max");
  revalidatePath("/", "layout");
}

/** Manual cache bust — Wisp has no webhooks yet. We pretend that's fine. */
export async function republishSite() {
  revalidateTag("site-theme", "max");
  revalidateTag("site-config", "max");
  revalidateTag("wisp-projects", "max");
  revalidatePath("/", "layout");
  revalidatePath("/");
}

export async function adminLogin(password: string): Promise<boolean> {
  const isProd = process.env.NODE_ENV === "production";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (isProd && !adminPassword) {
    console.error("[admin] ADMIN_PASSWORD is required in production");
    return false;
  }

  const expectedPassword = adminPassword ?? "admin123";
  if (password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24h — long enough to edit, short enough to forget the password
      path: "/",
    });
    return true;
  }
  return false;
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}
