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

export const ABOUT_TEXT = {
  heading: "Design sits between understanding people and building things that actually work.",
  body: [
    "That's what keeps me here — stealing ideas from different disciplines to solve weird, real problems.",
    "Out of office (but still at home): devoted cat person, 3D printer enthusiast, night owl testing AI tools when the world gets quiet.",
  ],
};

export const ABOUT_THINGS = {
  heading: "3 things about me",
  items: [
    { title: "Limited RAM", text: "My brain has limited RAM — hence the lists. So many lists." },
    { title: "Patterns everywhere", text: "I see patterns in places that probably don't need patterns. They make sense, I promise." },
    { title: "Ambidextrous by accident", text: "Broke my right arm three times; adaptation was mandatory." },
  ],
};

export const ABOUT_CONNECTIONS = {
  heading: "Lately, those connections look like breakfast.",
  lead: "A design system called Pancake, a sync widget called Syrup, and a cloche that keeps client secrets covered.",
  body: "The thread goes back further: undergrad research in agentic accessibility, then the Apple Developer Academy (Auway, Hairy, Byte Verse). This site is the web side of the same brain.",
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
