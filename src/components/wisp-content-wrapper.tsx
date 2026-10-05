"use client";

import { ContentWithCustomComponents } from "@wisp-cms/react-custom-component";

/** Wisp HTML → `.prose` (CSS puro em globals.css §8) */
export function WispContent({ content }: { content: string }) {
    return (
        <div className="prose">
            <ContentWithCustomComponents content={content || ""} customComponents={{}} />
        </div>
    );
}
