/**
 * Home curation — the projects the portfolio leads with.
 *
 * Order and size follow the Figma wireframe (one large, two medium, small).
 * Each entry is matched to a Wisp post by slug: when the post is published the
 * card links to /projects/[slug]; until then it shows as "coming soon".
 * Everything not listed here appears on /playground instead.
 */
export type FeaturedSize = "lg" | "md" | "sm";

export type FeaturedProject = {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  size: FeaturedSize;
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: "pancake-ds",
    kicker: "Design system",
    title: "Pancake DS",
    summary: "A design system for one. A new client brand becomes a checked topping, not a new project.",
    size: "lg",
  },
  {
    slug: "syrup-widget",
    kicker: "Figma widget",
    title: "Syrup widget",
    summary: "Figma and code in sync, both ways. A Figma edit goes back as one explained line.",
    size: "md",
  },
  {
    slug: "on-brand-agent-admin",
    kicker: "AI product",
    title: "The agent could talk. Nobody could prove it sold.",
    summary: "Admin and brand-voice setup for a B2B commerce chat agent.",
    size: "md",
  },
  {
    slug: "cloche",
    kicker: "Design ops",
    title: "Cloche",
    summary: "Build in public. Keep clients private.",
    size: "sm",
  },
];

export const FEATURED_SLUGS = new Set(FEATURED_PROJECTS.map((project) => project.slug));
