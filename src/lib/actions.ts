"use server";

import { redis, THEME_KEY, DEFAULT_THEME, ThemeConfig } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getTheme(): Promise<ThemeConfig> {
  try {
    const theme = await redis.get<ThemeConfig>(THEME_KEY);
    return theme ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export async function saveTheme(theme: ThemeConfig) {
  await redis.set(THEME_KEY, theme);
  revalidatePath("/", "layout");
}

export async function adminLogin(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 horas
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
