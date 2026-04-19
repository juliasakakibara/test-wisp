import { BlogPostCard } from "@/components/BlogPostCard";
import { getConfig, listPosts } from "@/lib/actions";

export const revalidate = 60; // ISR: Revalidate page every 60 seconds

export default async function Home() {
  const posts = await listPosts(0, 12, false);
  const config = await getConfig();

  return (
    <>
      <section className="hero subgrid-wrap">
          <div className="hero-content">
            <h1 className="hero-title">{config.heroTitle}</h1>
            <p className="hero-description">{config.heroDescription}</p>
          </div>
      </section>

      <section className="posts">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </section>
    </>
  );
}
