import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { createSiteMetadata } from "@/lib/metadata";
import { CanvasFrame } from "@/components/CanvasFrame";
import { DetailBlock } from "@/components/DetailLayout";
import {
  ListsWidget,
  NightOwlWidget,
  PomodoroWidget,
  PrinterWidget,
  QuizWidget,
  TerminalWidget,
  TimelineWidget,
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
/** The admin value may read "/about"; show it as a heading ("About"). */
function aboutHeading(title: string): string {
  const clean = title.replace(/^\/+/, "").trim() || "About";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export default async function AboutPage() {
  const config = await getConfig();

  return (
    <div className="pg-page">
      <section className="pg-hero" aria-labelledby="about-title">
        <CanvasFrame
          className="pg-frame--about"
          mobile="stack"
          widgets={[
            { id: "figure", label: "3D", node: <HeroVisual model="dancing" />, at: { x: 2, y: 2 } },
            { id: "timeline", label: "Path", node: <TimelineWidget />, at: { x: 2, y: 21.1 } },
            { id: "lists", label: "Lists", node: <ListsWidget />, at: { x: 2, y: 34.6 } },
            { id: "terminal", label: "terminal", node: <TerminalWidget />, at: { x: 72, y: 2 } },
            { id: "pomodoro", label: "Pomodoro", node: <PomodoroWidget />, at: { x: 72, y: 15.4 } },
            { id: "owl", label: "Night owl", node: <NightOwlWidget />, at: { x: 72, y: 26 } },
            { id: "printer", label: "3D printer", node: <PrinterWidget />, at: { x: 72, y: 38 } },
            { id: "quiz", label: "Riddle", node: <QuizWidget />, at: { x: 72, y: 47.1 } },
          ]}
        >
          <h1 id="about-title" className="pg-hero__title" data-editable="aboutTitle">
            {aboutHeading(config.aboutTitle)}
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
