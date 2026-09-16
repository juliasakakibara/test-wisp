import type { Metadata } from "next";
import { getConfig } from "@/lib/actions";
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
            heroDescription: config.heroDescription,
          }}
        />
      </div>

      <div className="site-shell home-page">
        <section id="about" className="about-section site-section" aria-labelledby="about-title">
          <p className="section-label">About</p>
          <h2 id="about-title" className="about-title" data-editable="aboutTitle">
            {config.aboutTitle}
          </h2>
          <p className="about-intro" data-editable="aboutIntro">
            {config.aboutIntro}
          </p>
          <div className="about-body" data-editable="aboutBody">
            {config.aboutBody}
          </div>
          <p className="about-resume">
            <a href="/resume/julia-sakakibara-en.html" className="about-resume__link">
              Download CV
            </a>
            <span className="meta-separator" aria-hidden="true">
              {" · "}
            </span>
            <a href="/resume/julia-sakakibara-pt.html" className="about-resume__link">
              CV em português
            </a>
          </p>
        </section>

        <section id="work" className="work-section site-section" aria-labelledby="work-title">
          <header className="work-section__header">
            <p className="section-label">Work</p>
            <h2 id="work-title" className="section-title" data-editable="workSectionTitle">
              {config.workSectionTitle}
            </h2>
            <p className="section-intro" data-editable="workSectionIntro">
              {config.workSectionIntro}
            </p>
          </header>

          <ul className="project-list">
            {projects.ok && projects.posts.length > 0 ? (
              projects.posts.map((post) => (
                <ProjectCard key={post.id} post={post} />
              ))
            ) : (
              <li className="project-list-item project-list-item--empty">
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
