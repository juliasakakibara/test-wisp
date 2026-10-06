import Link from "next/link";
import type { ReactNode } from "react";

export type DetailRow = { label: string; value: ReactNode };

type DetailLayoutProps = {
  backHref: string;
  backLabel: string;
  preview: ReactNode;
  title: ReactNode;
  /** Small bracketed line under the title, e.g. "2026" → [2026]. */
  meta?: string;
  lead?: ReactNode;
  actions?: ReactNode;
  rows?: DetailRow[];
  titleProps?: Record<string, string>;
  leadProps?: Record<string, string>;
  children?: ReactNode;
};

/**
 * Detail page after playground.nothing.tech's app page: back button, a framed
 * preview, centred title + [meta] + lead, two pill actions, label/value rows,
 * then the long content in the same narrow column.
 */
export function DetailLayout({
  backHref,
  backLabel,
  preview,
  title,
  meta,
  lead,
  actions,
  rows = [],
  titleProps,
  leadProps,
  children,
}: DetailLayoutProps) {
  return (
    <article className="pg-detail" aria-labelledby="detail-title">
      <Link href={backHref} className="pg-back" aria-label={backLabel}>
        ←
      </Link>
      <div className="pg-detail__col">
        <div className="pg-detail__preview">{preview}</div>
        <header className="pg-detail__head">
          <h1 id="detail-title" className="pg-detail__title" {...titleProps}>
            {title}
          </h1>
          {meta ? <p className="pg-detail__meta">[{meta}]</p> : null}
          {lead ? (
            <p className="pg-detail__lead" {...leadProps}>
              {lead}
            </p>
          ) : null}
        </header>
        {actions ? <div className="pg-detail__actions">{actions}</div> : null}
        {rows.length > 0 ? (
          <dl className="pg-detail__rows">
            {rows.map((row) => (
              <div key={row.label} className="pg-detail__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {children}
      </div>
    </article>
  );
}

/** A labelled block inside the column ("Compatibility" in the reference). */
export function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pg-detail__block">
      <h2 className="pg-detail__block-title">{title}</h2>
      {children}
    </section>
  );
}
