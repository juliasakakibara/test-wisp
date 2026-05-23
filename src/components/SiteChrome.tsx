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
          <div>
            <Link href="/" className="site-logo-link">
              <span className="site-title" data-editable="siteName">
                {config.siteName}
              </span>
            </Link>
          </div>
          <div className="site-navigation">
            <nav className="nav-list" aria-label="Main">
              <Link href="/#about" className="nav-item">
                About
              </Link>
              <span className="nav-separator" aria-hidden="true">
                ·
              </span>
              <Link href="/#work" className="nav-item nav-item-muted">
                Work
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="site-main">
        {children}
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-main">
            <p className="footer-text" data-editable="footerText">
              {config.footerText}
            </p>
            <FooterSocial githubUrl={config.githubUrl} linkedinUrl={config.linkedinUrl} />
          </div>
          <ThemeSwitcher />
        </div>
      </footer>
    </>
  );
}
