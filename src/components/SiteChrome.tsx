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

      {/* Experiment (playground): footer after playground.nothing.tech; copy is a placeholder for the personality pass */}
      <footer className="site-footer site-footer--pg">
        <SignOff
          line="Same batter, any brand."
          wordmark="Julia Sakakibara"
          links={[
            { label: "Email", href: `mailto:${CONTACT_EMAIL}` },
            { label: "LinkedIn", href: config.linkedinUrl, external: true },
            { label: "GitHub", href: config.githubUrl, external: true },
            { label: "Style guide", href: "/styleguide" },
          ]}
        />
      </footer>
    </>
  );
}
