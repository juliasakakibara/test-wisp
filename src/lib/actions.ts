"use server";

import { redis, THEME_KEY, DEFAULT_THEME, ThemeConfig, CONFIG_KEY, DEFAULT_SITE_CONFIG, SiteConfig, BlogPost, POSTS_ZSET_KEY, getPostKey } from "@/lib/redis";
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

export async function getConfig(): Promise<SiteConfig> {
  try {
    const config = await redis.get<SiteConfig>(CONFIG_KEY);
    return { ...DEFAULT_SITE_CONFIG, ...config };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export async function saveConfig(config: SiteConfig) {
  await redis.set(CONFIG_KEY, config);
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

// --- CMS Actions ---

export async function savePost(post: Omit<BlogPost, 'createdAt' | 'updatedAt'> & { createdAt?: number, updatedAt?: number }): Promise<void> {
  const now = Date.now();
  
  const fullPost: BlogPost = {
    ...post,
    createdAt: post.createdAt || now,
    updatedAt: now,
  };

  const key = getPostKey(fullPost.slug);
  await redis.set(key, fullPost);
  
  // Atualiza no índice da linha do tempo
  await redis.zadd(POSTS_ZSET_KEY, { score: fullPost.createdAt, member: fullPost.slug });
  
  revalidatePath("/", "layout");
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const key = getPostKey(slug);
  return redis.get<BlogPost>(key);
}

export async function deletePost(slug: string): Promise<void> {
  const key = getPostKey(slug);
  await redis.del(key);
  await redis.zrem(POSTS_ZSET_KEY, slug);
  revalidatePath("/", "layout");
}

export async function listPosts(start = 0, count = 20, includeDrafts = false): Promise<BlogPost[]> {
  // Puxar do maior score (mais recente) pro menor
  const slugs = await redis.zrange(POSTS_ZSET_KEY, start, start + count - 1, { rev: true });
  
  if (slugs.length === 0) return [];

  // Busca cada post em paralelo
  const posts = await Promise.all(
    slugs.map(slug => getPost(slug as string))
  );

  let filtered = posts.filter((post): post is BlogPost => post !== null);
  
  if (!includeDrafts) {
     filtered = filtered.filter((p) => p.published);
  }

  return filtered;
}
