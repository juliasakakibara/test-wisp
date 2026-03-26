import { buildWispClient } from "@wisp-cms/client";

const blogId = process.env.NEXT_PUBLIC_WISP_BLOG_ID || "bb96a9b8-aad3-4284-a042-43c77821df78";

export const wisp = buildWispClient({
    blogId,
});
