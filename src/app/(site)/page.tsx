import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { getProjects, isPlayground } from "@/lib/projects";
import { createSiteMetadata } from "@/lib/metadata";
import { FeaturedGrid } from "@/components/FeaturedGrid";
import { HeroSection } from "@/components/HeroSection";

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

/** Roles shown under the headline (wireframe tags). */
const HERO_TAGS = ["Freelancer", "UX engineer", "Design systems", "AI tooling"];

export default async function HomePage() {
  const [projects, config] = await Promise.all([getProjects(), getConfig()]);
  const posts = projects.ok ? projects.posts : [];
  const homePosts = posts.filter((post) => !isPlayground(post));
  const playgroundCount = posts.length - homePosts.length;

  return (
    <>
      <div className="hero-shell">
        <HeroSection config={{ heroTitle: config.heroTitle }} />
        <ul className="hero-tags" aria-label="What I do">
          {HERO_TAGS.map((tag) => (
            <li key={tag} className="hero-tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="site-shell home-page">
        <section className="home-intro site-section" aria-labelledby="home-intro-title">
          <h2 id="home-intro-title" className="home-intro__title">
            A design system for one.
          </h2>
          <div className="home-intro__body">
            <h3 className="home-intro__lead">
              Every new brand used to start from zero. Now it starts from the same batter.
            </h3>
            <p>
              I&apos;m a freelancer who designs and builds. Pancake is the system, Syrup keeps
              Figma and code in sync, and Cloche keeps client work covered. Pick a topping.
            </p>
          </div>
        </section>

        <section id="work" className="work-section site-section" aria-label="Projects">
          <FeaturedGrid posts={homePosts} playgroundCount={playgroundCount} />
          {projects.ok ? null : (
            <p className="work-empty">Projects are temporarily unavailable. Check back soon.</p>
          )}
        </section>
      </div>
    </>
  );
}
