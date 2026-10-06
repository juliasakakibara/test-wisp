"use client";

import { useEffect, useState } from "react";

type FooterLink = { label: string; href: string; external?: boolean };

/** Today's date and Porto Alegre time ("2026/10/06 ( 14 : 57 )"); empty until mounted (no hydration mismatch). */
function useLocalStamp(): string | null {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const zone = "America/Sao_Paulo"; // Porto Alegre keeps the same clock
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" });
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => {
      const d = new Date();
      const [h, m] = time.format(d).split(":");
      setNow(`${date.format(d).replaceAll("-", "/")} ( ${h} : ${m} )`);
    };
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/**
 * Footer after playground.nothing.tech: a full-width grey block — back to top and
 * the live stamp on top, the sign-off line with the palette's dots, a hairline,
 * then the wordmark and small uppercase links.
 */
export function SignOff({ line, wordmark, links }: { line: string; wordmark: string; links: FooterLink[] }) {
  const now = useLocalStamp();

  return (
    <div className="pg-footer">
      <div className="pg-footer__top">
        <a href="#main-content" className="pg-footer__top-link" aria-label="Back to top">
          ↑
        </a>
        <p className="pg-footer__stamp">{now ?? " "}</p>
      </div>
      <div className="pg-footer__sign">
        <p className="pg-footer__line">{line}</p>
        <span className="pg-footer__dots" aria-hidden="true">
          <span style={{ background: "var(--background)" }} />
          <span style={{ background: "var(--muted)" }} />
          <span style={{ background: "var(--muted-foreground)" }} />
          <span style={{ background: "var(--foreground)" }} />
        </span>
      </div>
      <div className="pg-footer__bottom">
        <p className="pg-footer__wordmark">{wordmark}</p>
        <nav className="pg-footer__links" aria-label="Footer">
          {links.map((l) => (
            <a key={l.label} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
