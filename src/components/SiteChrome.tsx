import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { FooterSocial } from "@/components/FooterSocial";
import { SiteLogo } from "@/components/SiteLogo";
import Link from "next/link";
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
        <div className="site-header__blur" aria-hidden="true">
          <span className="site-header__blur-layer" data-blur="1" />
          <span className="site-header__blur-layer" data-blur="2" />
          <span className="site-header__blur-layer" data-blur="3" />
          <span className="site-header__blur-layer" data-blur="4" />
          <span className="site-header__blur-layer" data-blur="5" />
          <span className="site-header__blur-tint" />
        </div>
        <div className="header-container">
          <SiteLogo siteName={config.siteName} />
          <nav className="nav-list" aria-label="Main">
            <Link href="/#work" className="nav-item">
              work
            </Link>
            <Link href="/about" className="nav-item">
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
