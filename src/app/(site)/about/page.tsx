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
            { id: "figure", label: "3D", node: <HeroVisual />, at: { x: 2, y: 2 } },
            { id: "fields", label: "Path", node: <FieldsWidget />, at: { x: 2, y: 18 } },
            { id: "clock", label: "Porto Alegre", node: <ClockWidget />, at: { x: 80, y: 2 } },
            { id: "cat", label: "Cat", node: <CatWidget />, at: { x: 2, y: 39 } },
            { id: "owl", label: "Night owl", node: <NightOwlWidget />, at: { x: 74, y: 13 } },
            { id: "printer", label: "3D printer", node: <PrinterWidget />, at: { x: 74, y: 23 } },
            { id: "lists", label: "Lists", node: <ListsWidget />, at: { x: 2, y: 28 } },
            { id: "patterns", label: "Patterns", node: <PatternsWidget />, at: { x: 74, y: 32 } },
            { id: "hands", label: "Hands", node: <HandsWidget />, at: { x: 2, y: 50 } },
            { id: "research", label: "Research", node: <ResearchWidget />, at: { x: 74, y: 47 } },
            { id: "academy", label: "Academy", node: <AcademyWidget />, at: { x: 2, y: 76 } },
            { id: "tools", label: "Tools", node: <ToolsWidget columns={ABOUT_TOOLS.columns} />, at: { x: 2, y: 61 } },
            { id: "breakfast", label: "Breakfast", node: <BreakfastWidget />, at: { x: 74, y: 66 } },
            { id: "theme", label: "Theme", node: <ThemeShuffle />, at: { x: 74, y: 54.5 } },
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

          {/* The About text, in words; keep or remove blocks freely */}
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
        </CanvasFrame>
      </section>
    </div>
  );
}
