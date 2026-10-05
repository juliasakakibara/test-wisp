import type { Metadata } from "next";
import { StyleguideThemeBoard } from "@/components/StyleguideThemeBoard";

export const metadata: Metadata = {
  title: "Style Guide",
  description: "Live theme pair preview — contrast, tokens, typography.",
  robots: { index: false, follow: false },
};

export default function StyleGuidePage() {
  return (
    <div className="sg-page sg-page--lean julia-container">
      <StyleguideThemeBoard />
    </div>
  );
}
