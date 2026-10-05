import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { createSiteMetadata } from "@/lib/metadata";

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

export default async function AboutPage() {
  const config = await getConfig();

  return (
    <div className="site-shell">
      <section className="about-section site-section" aria-labelledby="about-title">
        <h1 id="about-title" className="about-title" data-editable="aboutTitle">
          {config.aboutTitle}
        </h1>
        <p className="about-intro" data-editable="aboutIntro">
          {config.aboutIntro}
        </p>
        <div className="about-body" data-editable="aboutBody">
          {config.aboutBody}
        </div>
      </section>
    </div>
  );
}
