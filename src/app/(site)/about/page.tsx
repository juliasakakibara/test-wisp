import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { createSiteMetadata } from "@/lib/metadata";
import { CanvasFrame } from "@/components/CanvasFrame";
import { ThemeShuffle } from "@/components/ColorSystem";
import {
  AcademyWidget,
  BreakfastWidget,
  CatWidget,
  ClockWidget,
  FieldsWidget,
  HandsWidget,
  ListsWidget,
  NightOwlWidget,
  PatternsWidget,
  PrinterWidget,
  ResearchWidget,
  ToolsWidget,
} from "@/components/canvas-widgets";
import { HeroVisual } from "@/components/HeroVisual";
import { ABOUT_TEXT, ABOUT_TOOLS } from "@/lib/about";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return createSiteMetadata({
    title: `About · ${config.siteName}`,
    description: config.aboutIntro,
    path: "/about",
    siteName: config.siteName,
  });
}

/**
 * Experiment (playground): About as a big canvas — the intro in the middle and
 * widgets from the About copy spread around it (lib/about.ts). Phones stack them.
 */
export default async function AboutPage() {
  const config = await getConfig();

  return (
    <div className="pg-page">
      <section className="pg-hero" aria-labelledby="about-title">
        <CanvasFrame
          className="pg-frame--about"
          mobile="stack"
          widgets={[
            { id: "figure", label: "3D", node: <HeroVisual />, at: { x: 4, y: 3 } },
            { id: "fields", label: "Path", node: <FieldsWidget />, at: { x: 24, y: 4 } },
            { id: "clock", label: "Porto Alegre", node: <ClockWidget />, at: { x: 82, y: 3 } },
            { id: "cat", label: "Cat", node: <CatWidget />, at: { x: 30, y: 21 } },
            { id: "owl", label: "Night owl", node: <NightOwlWidget />, at: { x: 52, y: 19 } },
            { id: "printer", label: "3D printer", node: <PrinterWidget />, at: { x: 76, y: 22 } },
            { id: "lists", label: "Lists", node: <ListsWidget />, at: { x: 3, y: 38 } },
            { id: "patterns", label: "Patterns", node: <PatternsWidget />, at: { x: 82, y: 39 } },
            { id: "hands", label: "Hands", node: <HandsWidget />, at: { x: 3, y: 60 } },
            { id: "research", label: "Research", node: <ResearchWidget />, at: { x: 77, y: 62 } },
            { id: "academy", label: "Academy", node: <AcademyWidget />, at: { x: 5, y: 81 } },
            { id: "tools", label: "Tools", node: <ToolsWidget columns={ABOUT_TOOLS.columns} />, at: { x: 29, y: 75 } },
            { id: "breakfast", label: "Breakfast", node: <BreakfastWidget />, at: { x: 55, y: 81 } },
            { id: "theme", label: "Theme", node: <ThemeShuffle />, at: { x: 76, y: 82 } },
          ]}
        >
          <h1 id="about-title" className="pg-hero__title" data-editable="aboutTitle">
            {config.aboutTitle}
          </h1>
          <p className="pg-hero__lead" data-editable="aboutIntro">
            {config.aboutIntro}
          </p>
          <p className="pg-hero__lead">{ABOUT_TEXT.heading}</p>
          <div className="pg-about__actions">
            <a href="mailto:talk.to@juliasakakibara.com.br" className="pg-pill pg-pill--signal pg-pill--center">
              <span>Get in touch</span>
            </a>
            <a href={config.linkedinUrl} className="pg-pill pg-pill--center" target="_blank" rel="noopener noreferrer">
              <span>LinkedIn ↗</span>
            </a>
          </div>
        </CanvasFrame>
      </section>
    </div>
  );
}
