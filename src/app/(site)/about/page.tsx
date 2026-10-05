import type { Metadata } from "next";
import { getConfig } from "@/lib/site-data";
import { createSiteMetadata } from "@/lib/metadata";
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

/** Same skeleton as the case page (wireframe "about" frame). */
export default async function AboutPage() {
  const config = await getConfig();

  return (
    <article className="case-page about-page" aria-labelledby="about-title">
      <header className="case-header">
        <div className="case-header__text">
          <h1 id="about-title" className="case-title" data-editable="aboutTitle">
            {config.aboutTitle}
          </h1>
          <p className="case-lead" data-editable="aboutIntro">
            {config.aboutIntro}
          </p>
        </div>
        <dl className="case-details">
          {ABOUT_DETAILS.map((row) => (
            <div key={row.label} className="case-details__row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
          <div className="case-details__row">
            <dt>Contact</dt>
            <dd>
              <a href="#get-in-touch-title" className="link">
                Get in touch ↓
              </a>
            </dd>
          </div>
        </dl>
      </header>

      <section className="split-section">
        <div className="split-section__right">
          <h2 className="split-section__heading">{ABOUT_TEXT.heading}</h2>
          {ABOUT_TEXT.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="about-block" aria-labelledby="about-things">
        <h2 id="about-things" className="visually-hidden">
          {ABOUT_THINGS.heading}
        </h2>
        <ul className="card-row card-row--3">
          {ABOUT_THINGS.items.map((item) => (
            <li key={item.title} className="text-card">
              <span className="featured-card__kicker">{ABOUT_THINGS.heading}</span>
              <h3 className="text-card__title">{item.title}</h3>
              <p className="text-card__text">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-block">
        <h2 className="wide-heading">{ABOUT_CONNECTIONS.heading}</h2>
        <div className="split-section">
          <div className="split-section__right">
            <h3 className="split-section__heading">{ABOUT_CONNECTIONS.lead}</h3>
            <p>{ABOUT_CONNECTIONS.body}</p>
          </div>
        </div>
      </section>

      <section className="about-block" aria-labelledby="about-tools">
        <h2 id="about-tools" className="wide-heading wide-heading--small">
          {ABOUT_TOOLS.heading}
        </h2>
        <ul className="card-row card-row--4">
          {ABOUT_TOOLS.columns.map((column) => (
            <li key={column.title} className="text-column">
              <h3 className="text-column__title">{column.title}</h3>
              <p className="text-column__text">{column.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
