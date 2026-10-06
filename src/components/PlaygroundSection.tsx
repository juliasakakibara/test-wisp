import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectSummary } from "@/lib/projects";
import { ScrollRow } from "@/components/ScrollRow";

type Action = { label: string; href: string };

type PlaygroundSectionProps = {
  id: string;
  title: string;
  lead: string;
  /** The one highlighted action (yellow pill); use it once per page. */
  primary?: Action;
  seeAll?: Action;
  /** Extra controls in the actions row (e.g. a button). */
  extra?: ReactNode;
  /** Cards scroll sideways with ← → buttons instead of wrapping into a grid. */
  scrollLabel?: string;
  children: ReactNode;
};

/** Section after playground.nothing.tech: serif title + mono lead, two pill actions, a 4-column grid. */
export function PlaygroundSection({ id, title, lead, primary, seeAll, extra, scrollLabel, children }: PlaygroundSectionProps) {
  return (
    <section id={id} className="pg-section" aria-labelledby={`${id}-title`}>
      <header className="pg-section__head">
        <div>
          <h2 id={`${id}-title`} className="pg-section__title">
            {title}
          </h2>
          <p className="pg-section__lead">{lead}</p>
        </div>
        <div className="pg-section__actions">
          {extra}
          {primary ? (
            <Link href={primary.href} className="pg-pill pg-pill--signal">
              <span>{primary.label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
          {seeAll ? (
            <Link href={seeAll.href} className="pg-pill">
              <span>{seeAll.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </header>
      {scrollLabel ? <ScrollRow label={scrollLabel}>{children}</ScrollRow> : <ul className="pg-grid">{children}</ul>}
    </section>
  );
}

/** Grey card: the cover, then the name and its description at the bottom. */
export function PlaygroundCard({ post }: { post: ProjectSummary }) {

  return (
    <li className="pg-card">
      <Link href={`/projects/${post.slug}`} className="pg-card__link">
        <span className="pg-card__preview">
          {post.image ? (
            <span className="pg-card__frame">
              <Image src={post.image} alt="" fill sizes="(max-width: 639px) 60vw, 15vw" className="pg-card__image" />
            </span>
          ) : null}
        </span>
        <span className="pg-card__name">{post.title}</span>
        {post.description ? <span className="pg-card__desc">{post.description}</span> : null}
      </Link>
    </li>
  );
}
