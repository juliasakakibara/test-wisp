import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { createSiteMetadata } from "@/lib/metadata";
import { DetailBlock, DetailLayout } from "@/components/DetailLayout";
import { HeroVisual } from "@/components/HeroVisual";
import {
  ABOUT_CONNECTIONS,
  ABOUT_DETAILS,
  ABOUT_TEXT,
  ABOUT_THINGS,
  ABOUT_TOOLS,
} from "@/lib/about";

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

/** Experiment (playground): same detail layout as a case (after playground.nothing.tech's app page). */
export default async function AboutPage() {
  const config = await getConfig();

  return (
    <DetailLayout
      backHref="/"
      backLabel="Back to home"
      preview={<HeroVisual />}
      title={config.aboutTitle}
      titleProps={{ "data-editable": "aboutTitle" }}
      meta="UX engineer"
      lead={config.aboutIntro}
      leadProps={{ "data-editable": "aboutIntro" }}
      actions={
        <>
          <a href="mailto:talk.to@juliasakakibara.com.br" className="pg-pill pg-pill--signal pg-pill--center">
            <span>Get in touch</span>
          </a>
          <a href={config.linkedinUrl} className="pg-pill pg-pill--center" target="_blank" rel="noopener noreferrer">
            <span>LinkedIn ↗</span>
          </a>
        </>
      }
      rows={[...ABOUT_DETAILS, { label: "Based in", value: "Porto Alegre, Brazil" }]}
    >
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
    </DetailLayout>
  );
}
