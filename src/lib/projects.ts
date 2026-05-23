import { cache } from "react";
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

export async function getProjects(): Promise<GetProjectsResult> {
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
}

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
