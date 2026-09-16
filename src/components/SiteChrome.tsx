import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { FooterSocial } from "@/components/FooterSocial";
import type { SiteConfig } from "@/lib/redis";

export function SiteChrome({
  config,
  children,
}: {
  config: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-container">
          <Link href="/" className="site-logo-link">
            <span className="site-title" data-editable="siteName">
              {config.siteName}
            </span>
            <span className="site-title-role">ux engineer</span>
          </Link>
          <nav className="nav-list" aria-label="Main">
            <Link href="/#work" className="nav-item">
              work
            </Link>
            <Link href="/#about" className="nav-item">
              about
            </Link>
            <a href="/resume/julia-sakakibara-en.html" className="nav-item">
              cv
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        {children}
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <p className="footer-text" data-editable="footerText">
            {config.footerText}
          </p>
          <div className="footer-end">
            <FooterSocial githubUrl={config.githubUrl} linkedinUrl={config.linkedinUrl} />
            <ThemeSwitcher />
          </div>
        </div>
      </footer>
    </>
  );
}
