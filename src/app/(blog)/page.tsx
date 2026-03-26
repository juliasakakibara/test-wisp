import { wisp } from "@/lib/wisp";
import { BlogPostCard } from "@/components/BlogPostCard";
import { getConfig } from "@/lib/actions";

export const revalidate = 60; // ISR: Revalidate page every 60 seconds

export default async function Home() {
  const result = await wisp.getPosts({ limit: 12 });
  const config = await getConfig();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <section className="py-20 mb-12 flex flex-col items-start justify-center text-left space-y-6">
        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl" data-editable="heroTitle">
          {config.heroTitle}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl" data-editable="heroDescription">
          {config.heroDescription}
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
