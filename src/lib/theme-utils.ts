import { ThemeConfig } from "./redis";
import { deriveAccessibleTokens, resolveFontFamily } from "./theme-presets";

const ADMIN_PREVIEW_SCOPE = 'html[data-env="admin"][data-theme-preview="true"]';
/** Redis theme yields to Fun themes (`data-fun-theme`) on home/styleguide. */
const PUBLIC_SITE_SCOPE = ':root:not([data-env="admin"]):not([data-fun-theme])';

function themeVarBlock(theme: ThemeConfig, selector: string, withPaint = false): string {
  const accessibleTokens = deriveAccessibleTokens(theme);
  const fontStack = resolveFontFamily(theme.fontFamily);
  const radius = theme.radius || "0";

  const paintRules = withPaint
    ? `
    ${selector} body,
    ${selector} .site-body {
      background-color: ${theme.background};
      color: ${theme.foreground};
    }
    ${selector} .hero-lead,
    ${selector} .about-intro,
    ${selector} .about-body,
    ${selector} .section-label,
    ${selector} .footer-text,
    ${selector} .nav-item-muted {
      color: ${accessibleTokens["--muted-foreground"]};
    }
    ${selector} [data-editable] {
      outline-color: ${theme.primary};
      border-radius: ${radius};
    }
    ${selector} .work-empty,
    ${selector} .project-card__image,
    ${selector} .project-card__link,
    ${selector} .project-list-item__link,
    ${selector} .site-logo-link {
      border-radius: ${radius};
    }
  `
    : "";

  return `
    ${selector} {
      color-scheme: light dark;
      --primary: ${theme.primary};
      --background: ${theme.background};
      --foreground: ${theme.foreground};
      --radius: ${radius};
      --font-family: ${fontStack};
      --font-body: ${fontStack};
      --font-display: ${fontStack};
      --primary-foreground: ${accessibleTokens["--primary-foreground"]};
      --muted-foreground: ${accessibleTokens["--muted-foreground"]};
      --border: ${accessibleTokens["--border"]};
      --muted: ${accessibleTokens["--muted"]};

      --input: var(--border);
      --card: var(--background);
      --card-foreground: var(--foreground);
      --popover: var(--background);
      --popover-foreground: var(--foreground);
    }
    ${paintRules}
  `;
}

/** Admin iframe — ephemeral preview with explicit paint rules */
export function generateThemeCssVariables(theme: ThemeConfig): string {
  return themeVarBlock(theme, ADMIN_PREVIEW_SCOPE, true);
}

/** Persisted theme from Redis — public pages only */
export function generateSiteThemeCss(theme: ThemeConfig): string {
  return themeVarBlock(theme, PUBLIC_SITE_SCOPE);
}
