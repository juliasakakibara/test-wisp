import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { getProjects } from "@/lib/projects";
import { createSiteMetadata } from "@/lib/metadata";
import { ProjectCard } from "@/components/ProjectCard";
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

export default async function HomePage() {
  const [projects, config] = await Promise.all([getProjects(), getConfig()]);

  return (
    <>
      <div className="hero-shell">
        <HeroSection
          config={{
            heroTitle: config.heroTitle,
          }}
        />
      </div>

      <div className="site-shell home-page">
        <section id="work" className="work-section site-section" aria-label="Work">
          <ul className="julia-grid project-grid">
            {projects.ok && projects.posts.length > 0 ? (
              projects.posts.map((post) => <ProjectCard key={post.id} post={post} />)
            ) : (
              <li className="project-card project-card--empty">
                <p className="work-empty">
                  {projects.ok
                    ? "No projects published yet. Add case studies in Wisp CMS."
                    : "Projects are temporarily unavailable. Check back soon."}
                </p>
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
