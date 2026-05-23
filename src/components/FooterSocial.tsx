type FooterSocialProps = {
  githubUrl: string;
  linkedinUrl: string;
};

export function FooterSocial({ githubUrl, linkedinUrl }: FooterSocialProps) {
  return (
    <nav className="footer-social" aria-label="Social links">
      <a
        href={githubUrl}
        className="footer-social__link"
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
        className="footer-social__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    </nav>
  );
}
