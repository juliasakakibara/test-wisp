"use client";

import { useEffect, useState } from "react";

/** Footer sign-off: today's date and São Paulo time, then one line. Empty until mounted (no hydration mismatch). */
export function SignOff({ line }: { line: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" });
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => {
      const d = new Date();
      const [h, m] = time.format(d).split(":");
      setNow(`${date.format(d).replaceAll("-", "/")} ( ${h} : ${m} )`);
    };
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pg-signoff">
      <p className="pg-signoff__time">{now ?? " "}</p>
      <p className="pg-signoff__line">{line}</p>
    </div>
  );
}
