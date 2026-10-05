import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { getProjects, isPlayground } from "@/lib/projects";
import { createSiteMetadata } from "@/lib/metadata";
import { ProjectCard } from "@/components/ProjectCard";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return createSiteMetadata({
    title: "Playground",
    description: "Older projects and experiments: apps, 3D, hardware.",
    path: "/playground",
    siteName: config.siteName,
  });
}

/** Posts tagged "playground" in Wisp: older projects and experiments. */
export default async function PlaygroundPage() {
  const projects = await getProjects();
  const posts = projects.ok ? projects.posts.filter(isPlayground) : [];

  return (
    <div className="site-shell playground-page">
      <section className="site-section" aria-labelledby="playground-title">
        <h1 id="playground-title" className="page-title">
          Playground
        </h1>
        <p className="page-lead">Older projects and experiments: apps, 3D, hardware. Less polish, more play.</p>
        <ul className="julia-grid project-grid">
          {posts.length > 0 ? (
            posts.map((post) => <ProjectCard key={post.id} post={post} />)
          ) : (
            <li className="project-card project-card--empty">
              <p className="work-empty">
                {projects.ok ? "Nothing here yet." : "Projects are temporarily unavailable. Check back soon."}
              </p>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
