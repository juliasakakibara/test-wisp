import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { getProjects, isPlayground, projectCategory } from "@/lib/projects";
import { createSiteMetadata } from "@/lib/metadata";
import { HeroCanvas } from "@/components/HeroCanvas";
import { PlaygroundCard, PlaygroundSection } from "@/components/PlaygroundSection";
import { ColorSystemCards, ShuffleSystemsButton } from "@/components/ColorSystem";

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

/**
 * Experiment (playground): structure after playground.nothing.tech — a framed hero
 * with live, draggable widgets, then sections of cards. Copy is placeholder for
 * the personality pass.
 */
export default async function HomePage() {
  const [projects, config] = await Promise.all([getProjects(), getConfig()]);
  const posts = projects.ok ? projects.posts : [];
  const work = posts.filter((post) => !isPlayground(post));
  const playground = posts.filter(isPlayground);

  return (
    <div className="pg-page">
      <section className="pg-hero" aria-labelledby="hero-title">
        <HeroCanvas
          projects={work.slice(0, 3).map((post) => ({
            slug: post.slug,
            title: post.title,
            label: projectCategory(post),
            image: post.image ?? null,
          }))}
        >
          <h1 id="hero-title" className="pg-hero__title" data-editable="heroTitle">
            {config.heroTitle}
          </h1>
          <p className="pg-hero__lead">
            A freelance UX engineer who designs and builds. Drag anything around, then shuffle the colours.
          </p>
        </HeroCanvas>
      </section>

      <PlaygroundSection
        id="projects"
        title="Projects"
        lead="Case studies: design systems, Figma tools and AI products."
        primary={{ label: "Start a project", href: "mailto:talk.to@juliasakakibara.com.br" }}
        seeAll={{ label: "See all", href: "/projects" }}
      >
        {work.slice(0, 4).map((post) => (
          <PlaygroundCard key={post.id} post={post} />
        ))}
      </PlaygroundSection>

      <PlaygroundSection
        id="color-systems"
        title="Color systems"
        lead="Same system, any colour. Random palettes, every text pair checked for WCAG AA."
        extra={<ShuffleSystemsButton />}
      >
        <ColorSystemCards />
      </PlaygroundSection>

      <PlaygroundSection
        id="playground"
        title="Playground"
        lead="Older projects and experiments: apps, 3D, hardware."
        seeAll={{ label: "See all", href: "/playground" }}
      >
        {playground.slice(0, 4).map((post) => (
          <PlaygroundCard key={post.id} post={post} />
        ))}
      </PlaygroundSection>
    </div>
  );
}
