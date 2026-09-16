type FooterSocialProps = {
  githubUrl: string;
  linkedinUrl: string;
};

const CV_HREF = "/resume/julia-sakakibara-en.html";

export function FooterSocial({ githubUrl, linkedinUrl }: FooterSocialProps) {
  return (
    <nav className="footer-social" aria-label="Social and resume links">
      <a
        href={githubUrl}
        className="footer-social__link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub (opens in a new tab)"
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
        aria-label="LinkedIn (opens in a new tab)"
      >
        LinkedIn
      </a>
      <span className="meta-separator" aria-hidden="true">
        ·
      </span>
      <a href={CV_HREF} className="footer-social__link">
        CV
      </a>
    </nav>
  );
}
