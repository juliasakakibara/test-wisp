import { buildWispClient } from "@wisp-cms/client";

const blogId = process.env.NEXT_PUBLIC_WISP_BLOG_ID;

if (!blogId) {
  console.warn("⚠️  NEXT_PUBLIC_WISP_BLOG_ID is not set. Blog posts will not load.");
}

export const wisp = buildWispClient({ blogId: blogId ?? "" });
