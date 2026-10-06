import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { getProjects, isPlayground, projectCategory } from "@/lib/projects";
import { createSiteMetadata } from "@/lib/metadata";
import { HeroCanvas } from "@/components/HeroCanvas";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return createSiteMetadata({
    title: config.siteName,
    description: config.siteDescription,
    path: "/",
    siteName: config.siteName,
  });
}

export default async function HomePage() {
  const [projects, config] = await Promise.all([getProjects(), getConfig()]);
  const posts = projects.ok ? projects.posts : [];
  const homePosts = posts.filter((post) => !isPlayground(post));

  return (
    <>
      {/* Experiment: hero as a node canvas (after weave.figma.com) */}
      <section className="hero-canvas-section" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero-canvas-title" data-editable="heroTitle">
          {config.heroTitle}
        </h1>
        <HeroCanvas
          projects={homePosts.slice(0, 3).map((post) => ({
            slug: post.slug,
            title: post.title,
            label: projectCategory(post),
            image: post.image ?? null,
          }))}
        />
      </section>
    </>
  );
}
