import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { GetPostResult, GetPostsResult } from "@wisp-cms/client";
import { wisp } from "./wisp";

export type ProjectSummary = GetPostsResult["posts"][number];
export type Project = NonNullable<GetPostResult["post"]>;

/** Home shows 20. SSG prebuilds 100. Projects 21–100 are shy on the homepage but exist. */
const PROJECTS_LIMIT = 20;

export type GetProjectsResult =
  | { ok: true; posts: ProjectSummary[] }
  | { ok: false; posts: []; error: string };

export const getProject = cache((slug: string) => wisp.getPost(slug));

const loadProjects = unstable_cache(
  async (): Promise<GetProjectsResult> => {
    try {
      const result = await wisp.getPosts({ limit: PROJECTS_LIMIT });
      return { ok: true, posts: result.posts ?? [] };
    } catch (error) {
      console.error("[wisp] Failed to fetch projects:", error);
      return {
        ok: false,
        posts: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
  ["wisp-projects"],
  { revalidate: 60, tags: ["wisp-projects"] },
);

/** Cached home project list — matches page `revalidate = 60`. */
export const getProjects = cache(() => loadProjects());

export async function getProjectSlugs(): Promise<{ slug: string }[]> {
  try {
    const result = await wisp.getPosts({ limit: 100 });
    if (!result.posts?.length) return [];
    return result.posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("[wisp] Failed to fetch project slugs:", error);
    return [];
  }
}

/** Wisp tag that sends a post to /playground instead of the home grid. */
export const PLAYGROUND_TAG = "playground";

export function isPlayground(post: ProjectSummary): boolean {
  return post.tags?.some((tag) => tag.name.toLowerCase() === PLAYGROUND_TAG) ?? false;
}

/** First tag that isn't the routing tag, shown as the card kicker. */
export function projectCategory(post: ProjectSummary, fallback = "Case study"): string {
  return post.tags?.find((tag) => tag.name.toLowerCase() !== PLAYGROUND_TAG)?.name ?? fallback;
}
