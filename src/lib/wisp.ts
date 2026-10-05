import { buildWispClient } from "@wisp-cms/client";

const blogId = process.env.NEXT_PUBLIC_WISP_BLOG_ID;

if (!blogId) {
  const message = "NEXT_PUBLIC_WISP_BLOG_ID is not set.";
  if (process.env.NODE_ENV === "production") {
    console.error(`[wisp] ${message} Set it before deploying — projects will not load.`);
  } else {
    // Not angry. Just disappointed.
    console.warn(`⚠️  ${message} Projects will not load in development.`);
  }
}

/** Wisp client singleton — posts are "projects" because this is a portfolio, not a blog. Mostly. */
export const wisp = buildWispClient({ blogId: blogId ?? "" });
