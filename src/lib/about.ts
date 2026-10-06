/**
 * About page blocks, laid out like the wireframe ("about" frame).
 *
 * The title and opening line stay editable in the admin (SiteConfig aboutTitle /
 * aboutIntro). The rest is structured here because the wireframe splits it into
 * cards and columns; the words come from the previous aboutBody.
 */
export const ABOUT_DETAILS = [
  { label: "Role", value: "Freelance UX engineer" },
  { label: "Focus", value: "Design systems · AI tooling" },
];

// The intro's second line (shorter page: its old block and "3 things about me" were cut;
// the lists live on as the Limited RAM List widget)
export const ABOUT_TEXT = {
  heading: "Design sits between understanding people and building things that actually work.",
};

export const ABOUT_CONNECTIONS = {
  heading: "Lately, those connections look like breakfast.",
  lead: "A design system called Pancake, a sync widget called Syrup, and a cloche that keeps client secrets covered.",
  body: "Before that: research in agentic accessibility and the Apple Developer Academy.",
};

export const ABOUT_TOOLS = {
  heading: "What I'm building with",
  columns: [
    { title: "Design", text: "Figma · Figma Make · variables and modes" },
    { title: "Code", text: "Next.js · TypeScript · React · Three.js · Swift" },
    { title: "Systems", text: "DTCG tokens · Storybook · Figma widgets" },
    { title: "AI", text: "Claude Code · Figma MCP · agents with guardrails" },
  ],
};
