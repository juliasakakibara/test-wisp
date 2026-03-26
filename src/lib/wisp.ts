import { buildWispClient } from "@wisp-cms/client";

const blogId = process.env.NEXT_PUBLIC_WISP_BLOG_ID;

if (!blogId) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_WISP_BLOG_ID");
}

export const wisp = buildWispClient({ blogId });
