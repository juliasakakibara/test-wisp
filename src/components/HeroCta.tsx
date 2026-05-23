import Link from "next/link";

type HeroCtaProps = {
  githubUrl: string;
  linkedinUrl: string;
};

export function HeroCta({ githubUrl, linkedinUrl }: HeroCtaProps) {
  return (
    <nav className="hero-cta" aria-label="Primary actions">
      <Link href="/#work" className="hero-cta__link">
        Work
      </Link>
      <span className="meta-separator" aria-hidden="true">
        ·
      </span>
      <a
        href={githubUrl}
        className="hero-cta__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
      <span className="meta-separator" aria-hidden="true">
        ·
      </span>
      <a
        href={linkedinUrl}
        className="hero-cta__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    </nav>
  );
}
