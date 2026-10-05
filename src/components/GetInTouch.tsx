import { SiteLink } from "@/components/SiteLink";

type GetInTouchProps = {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
};

/** Footer contact block from the wireframe: shown on every public page. */
export function GetInTouch({ email, githubUrl, linkedinUrl }: GetInTouchProps) {
  return (
    <section className="get-in-touch" aria-labelledby="get-in-touch-title">
      <div className="get-in-touch__lead">
        <h2 id="get-in-touch-title" className="get-in-touch__title">
          Get in touch
        </h2>
        <a href={`mailto:${email}`} className="get-in-touch__email">
          {email}
        </a>
      </div>
      <nav className="get-in-touch__columns" aria-label="Sitemap and contact">
        <div className="get-in-touch__column">
          <h3 className="get-in-touch__heading">Sitemap</h3>
          <SiteLink href="/">Home</SiteLink>
          <SiteLink href="/about">About</SiteLink>
          <SiteLink href="/#work">Projects</SiteLink>
          <SiteLink href="/playground">Playground</SiteLink>
          <SiteLink href="/styleguide">Style guide</SiteLink>
        </div>
        <div className="get-in-touch__column">
          <h3 className="get-in-touch__heading">Contact</h3>
          <a href={`mailto:${email}`} className="link">Email</a>
          <a href={linkedinUrl} className="link" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={githubUrl} className="link" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </nav>
    </section>
  );
}
