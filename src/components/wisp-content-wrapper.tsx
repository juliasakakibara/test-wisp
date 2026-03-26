"use client";

import { ContentWithCustomComponents } from "@wisp-cms/react-custom-component";
import { FeatureHighlightCard } from "@/components/ui/feature-highlight-card";

export function WispContent({ content }: { content: string }) {
    return (
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl prose-headings:font-bold prose-headings:tracking-tighter prose-a:text-primary hover:prose-a:text-primary/80">
            <ContentWithCustomComponents
                content={content || ""}
                customComponents={{
                    FeatureHighlightCard: FeatureHighlightCard,
                }}
            />
        </div>
    );
}
