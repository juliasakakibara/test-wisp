import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { createSiteMetadata } from "@/lib/metadata";
import { CanvasFrame } from "@/components/CanvasFrame";
import { DetailBlock } from "@/components/DetailLayout";
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
import { ABOUT_CONNECTIONS, ABOUT_DETAILS, ABOUT_TEXT, ABOUT_THINGS, ABOUT_TOOLS } from "@/lib/about";

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
            { id: "fields", label: "Path", node: <FieldsWidget />, at: { x: 24, y: 26 } },
            { id: "clock", label: "Porto Alegre", node: <ClockWidget />, at: { x: 82, y: 3 } },
            { id: "cat", label: "Cat", node: <CatWidget />, at: { x: 30, y: 41 } },
            { id: "owl", label: "Night owl", node: <NightOwlWidget />, at: { x: 52, y: 26 } },
            { id: "printer", label: "3D printer", node: <PrinterWidget />, at: { x: 76, y: 27 } },
            { id: "lists", label: "Lists", node: <ListsWidget />, at: { x: 3, y: 40 } },
            { id: "patterns", label: "Patterns", node: <PatternsWidget />, at: { x: 50, y: 42 } },
            { id: "hands", label: "Hands", node: <HandsWidget />, at: { x: 3, y: 60 } },
            { id: "research", label: "Research", node: <ResearchWidget />, at: { x: 76, y: 43 } },
            { id: "academy", label: "Academy", node: <AcademyWidget />, at: { x: 58, y: 60 } },
            { id: "tools", label: "Tools", node: <ToolsWidget columns={ABOUT_TOOLS.columns} />, at: { x: 26, y: 59 } },
            { id: "breakfast", label: "Breakfast", node: <BreakfastWidget />, at: { x: 40, y: 79 } },
            { id: "theme", label: "Theme", node: <ThemeShuffle />, at: { x: 76, y: 62 } },
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

      {/* The About text as it was before the canvas; keep or remove blocks freely */}
      <section className="pg-about__text" aria-label="About, in words">
        <div className="pg-detail__col">
          <dl className="pg-detail__rows">
            {[...ABOUT_DETAILS, { label: "Based in", value: "Porto Alegre, Brazil" }].map((row) => (
              <div key={row.label} className="pg-detail__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <DetailBlock title={ABOUT_TEXT.heading}>
            {ABOUT_TEXT.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </DetailBlock>

          <DetailBlock title={ABOUT_THINGS.heading}>
            <dl className="pg-detail__rows pg-detail__rows--stacked">
              {ABOUT_THINGS.items.map((item) => (
                <div key={item.title} className="pg-detail__row">
                  <dt>{item.title}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </DetailBlock>

          <DetailBlock title={ABOUT_CONNECTIONS.heading}>
            <p>{ABOUT_CONNECTIONS.lead}</p>
            <p>{ABOUT_CONNECTIONS.body}</p>
          </DetailBlock>

          <DetailBlock title={ABOUT_TOOLS.heading}>
            <dl className="pg-detail__rows">
              {ABOUT_TOOLS.columns.map((column) => (
                <div key={column.title} className="pg-detail__row">
                  <dt>{column.title}</dt>
                  <dd>{column.text}</dd>
                </div>
              ))}
            </dl>
          </DetailBlock>
        </div>
      </section>
    </div>
  );
}
