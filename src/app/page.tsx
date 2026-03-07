import { wisp } from "@/lib/wisp";
import { BlogPostCard } from "@/components/BlogPostCard";

export default async function Home() {
  const result = await wisp.getPosts({ limit: 12 });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <section className="py-20 mb-12 flex flex-col items-start justify-center text-left space-y-6">
        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl">
          Stories & Ideas.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A minimalist travel and lifestyle blog template powered by Wisp CMS, built with Next.js and Shadcn UI.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {result.posts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={{
              ...post,
              publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
            }}
          />
        ))}
      </div>
    </div>
  );
}
