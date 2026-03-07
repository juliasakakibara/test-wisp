import { buildWispClient } from "@wisp-cms/client";

const blogId = process.env.NEXT_PUBLIC_WISP_BLOG_ID || "8cfca777-6eb1-4609-b05a-1ca12ace047d";

export const wisp = buildWispClient({
    blogId,
});
