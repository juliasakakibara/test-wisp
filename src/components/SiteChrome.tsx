import { FooterSocial } from "@/components/FooterSocial";
import { GetInTouch } from "@/components/GetInTouch";
import { SignOff } from "@/components/SignOff";

/** Contact address from the wireframe ("Get in touch"). */
const CONTACT_EMAIL = "talk.to@juliasakakibara.com.br";
import { SiteLogo } from "@/components/SiteLogo";
import { SiteNav } from "@/components/SiteNav";
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
          <SiteNav />
        </div>
      </header>

      <main id="main-content" className="site-main">
        {children}
      </main>

      <footer className="site-footer">
        <div className="footer-container footer-container--touch">
          {/* Experiment (playground): live date + sign-off line; copy is a placeholder for the personality pass */}
          <SignOff line="Same batter, any brand." />
          <GetInTouch email={CONTACT_EMAIL} githubUrl={config.githubUrl} linkedinUrl={config.linkedinUrl} />
        </div>
        <div className="footer-container">
          <p className="footer-text" data-editable="footerText">
            {config.footerText}
          </p>
          <div className="footer-end">
            <FooterSocial githubUrl={config.githubUrl} linkedinUrl={config.linkedinUrl} />
          </div>
        </div>
      </footer>
    </>
  );
}
