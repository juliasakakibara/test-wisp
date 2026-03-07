import { buildWispClient } from "@wisp-cms/client";

const blogId = process.env.NEXT_PUBLIC_WISP_BLOG_ID || "clvztruzw0000a6f0iiz5ng2c"; // Default to wisp demo blog if not set

export const wisp = buildWispClient({
    blogId,
});
