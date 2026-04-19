import { BlogPostCard } from "@/components/BlogPostCard";
import { getConfig, listPosts } from "@/lib/actions";

export const revalidate = 60; // ISR: Revalidate page every 60 seconds

export default async function Home() {
  const posts = await listPosts(0, 12, false);
  const config = await getConfig();

  return (
    <div className="grid">
      {/* Hero Section */}
      <section className="c1 s12 md:s8 hero">
          <h1 className="hero-title">
            {config.heroTitle}
          </h1>
          <p className="hero-description">
            {config.heroDescription}
          </p>
      </section>

      {/* Posts Grid */}
      <div className="c1 s12 grid">
        {posts.map((post) => (
          <div key={post.slug} className="s12 md:s4">
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
