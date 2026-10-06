import type { Metadata } from "next";
import Link from "next/link";
import { getConfig } from "@/lib/site-data";
import { getProjects, isPlayground } from "@/lib/projects";
import { createSiteMetadata } from "@/lib/metadata";
import { ProjectCard } from "@/components/ProjectCard";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return createSiteMetadata({
    title: "Projects",
    description: "Case studies: design systems, Figma tools and AI products.",
    path: "/projects",
    siteName: config.siteName,
  });
}

/** Every published post without the "playground" tag, listed like the Playground. */
export default async function ProjectsPage() {
  const projects = await getProjects();
  const all = projects.ok ? projects.posts : [];
  const posts = all.filter((post) => !isPlayground(post));
  const playgroundCount = all.length - posts.length;

  return (
    <div className="site-shell playground-page">
      <section className="site-section" aria-labelledby="projects-title">
        <h1 id="projects-title" className="page-title">
          Projects
        </h1>
        <p className="page-lead">Case studies: design systems, Figma tools and AI products.</p>
        <ul className="featured-grid">
          {posts.length > 0 ? (
            posts.map((post) => <ProjectCard key={post.id} post={post} />)
          ) : (
            <li className="featured-card featured-card--wide">
              <p className="work-empty">
                {projects.ok ? "Nothing here yet." : "Projects are temporarily unavailable. Check back soon."}
              </p>
            </li>
          )}
        </ul>
        <p className="page-more">
          <Link href="/playground" className="link" data-text="Older projects & experiments →">
            Older projects &amp; experiments →
          </Link>
          {playgroundCount > 0 ? <span> {playgroundCount} in the Playground</span> : null}
        </p>
      </section>
    </div>
  );
}
