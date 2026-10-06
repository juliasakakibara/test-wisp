import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { getProjects, isPlayground, projectCategory } from "@/lib/projects";
import { createSiteMetadata } from "@/lib/metadata";
import { CanvasFrame } from "@/components/CanvasFrame";
import { ClocheWidget, ClockWidget, CoversWidget, StickyWidget, SyrupWidget } from "@/components/canvas-widgets";
import { HeroVisual } from "@/components/HeroVisual";
import { ThemeShuffle } from "@/components/ColorSystem";
import { PlaygroundCard, PlaygroundSection } from "@/components/PlaygroundSection";
import { ShuffleThemesButton, ThemeCards } from "@/components/ColorSystem";

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
        {/* Phones: Syrup and Cloche stay on desktop only (no atMobile) to keep the frame calm */}
        <CanvasFrame
          className="pg-frame--home"
          widgets={[
            { id: "figure", label: "3D", node: <HeroVisual />, at: { x: 5, y: 4 }, atMobile: { x: 4, y: 2 } },
            { id: "syrup", label: "Syrup", node: <SyrupWidget />, at: { x: 27, y: 10 } },
            { id: "clock", label: "Porto Alegre", node: <ClockWidget />, at: { x: 82, y: 6 }, atMobile: { x: 8, y: 78 } },
            {
              id: "covers",
              label: "Projects",
              node: (
                <CoversWidget
                  projects={work.slice(0, 3).map((post) => ({
                    slug: post.slug,
                    title: post.title,
                    label: projectCategory(post),
                    image: post.image ?? null,
                  }))}
                />
              ),
              at: { x: 5, y: 64 },
              atMobile: { x: 48, y: 67 },
            },
            { id: "cloche", label: "Cloche", node: <ClocheWidget />, at: { x: 50, y: 70 } },
            { id: "color", label: "Theme", node: <ThemeShuffle />, at: { x: 75, y: 50 }, atMobile: { x: 7, y: 17.5 } },
            { id: "sticky", label: "Tip", node: <StickyWidget>Drag anything around, then shuffle the theme.</StickyWidget>, at: { x: 8, y: 41 } },
          ]}
        >
          <h1 id="hero-title" className="pg-hero__title" data-editable="heroTitle">
            {config.heroTitle}
          </h1>
          <p className="pg-hero__lead">
            A freelance UX engineer who designs and builds.
          </p>
        </CanvasFrame>
      </section>

      <PlaygroundSection
        id="projects"
        title="Projects"
        lead="Case studies: design systems, Figma tools and AI products."
        scrollLabel="projects"
      >
        {work.map((post) => (
          <PlaygroundCard key={post.id} post={post} />
        ))}
      </PlaygroundSection>

      <PlaygroundSection
        id="themes"
        title="Themes"
        lead="Same system, any brand. Random palettes and font pairs, every text pair checked for WCAG AA."
        extra={<ShuffleThemesButton />}
      >
        <ThemeCards />
      </PlaygroundSection>

      <PlaygroundSection
        id="playground"
        title="Playground"
        lead="Older projects and experiments: apps, 3D, hardware."
        scrollLabel="playground projects"
      >
        {playground.map((post) => (
          <PlaygroundCard key={post.id} post={post} />
        ))}
      </PlaygroundSection>
    </div>
  );
}
