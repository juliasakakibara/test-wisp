import { Hero } from "@/components/Hero";
import { listPosts, getConfig } from "@/lib/actions";
import { BlogPostCard } from "@/components/BlogPostCard";

export const revalidate = 60; // ISR: Revalidate page every 60 seconds

export default async function Home() {
  const posts = await listPosts(0, 12, false);
  const config = await getConfig();

  return (
    <>
      <Hero title={config.heroTitle} description={config.heroDescription} />

      <div className="posts">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
