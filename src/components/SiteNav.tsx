"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const DESKTOP_MQ = "(min-width: 640px)";

type NavKey = "work" | "about" | "cv" | "styleguide";

function currentNavKey(pathname: string): NavKey | null {
  if (pathname.startsWith("/styleguide")) return "styleguide";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/resume")) return "cv";
  if (pathname === "/" || pathname.startsWith("/projects")) return "work";
  return null;
}

function navItemClass(active: boolean) {
  return active ? "nav-item is-current" : "nav-item";
}

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

/** SSR assumes desktop so the panel is not inert in HTML; CSS hides it on small screens. */
function getServerDesktopSnapshot() {
  return true;
}

function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getServerDesktopSnapshot);
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const current = currentNavKey(pathname);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const expanded = isDesktop || open;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!open || isDesktop) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, select, button");
    firstLink?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isDesktop, close]);

  return (
    <div className={`site-nav${open ? " is-open" : ""}`}>
      <button
        ref={toggleRef}
        type="button"
        className="site-nav__toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open && !isDesktop ? "close" : "menu"}
      </button>

      <button
        type="button"
        className="site-nav__backdrop"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
      />

      <div
        ref={panelRef}
        id={panelId}
        className="site-nav__panel"
        inert={!expanded ? true : undefined}
      >
        <nav className="nav-list" aria-label="Main">
          <Link
            href="/#work"
            className={navItemClass(current === "work")}
            aria-current={current === "work" ? "page" : undefined}
            onClick={close}
          >
            work
          </Link>
          <Link
            href="/about"
            className={navItemClass(current === "about")}
            aria-current={current === "about" ? "page" : undefined}
            onClick={close}
          >
            about
          </Link>
          <a
            href="/resume/julia-sakakibara-en.html"
            className={navItemClass(current === "cv")}
            aria-current={current === "cv" ? "page" : undefined}
            onClick={close}
          >
            cv
          </a>
          <Link
            href="/styleguide"
            className={navItemClass(current === "styleguide")}
            aria-current={current === "styleguide" ? "page" : undefined}
            onClick={close}
          >
            style guide
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </div>
  );
}
