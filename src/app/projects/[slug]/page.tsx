import Image from "next/image";
import { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { WispContent } from "@/components/wisp-content-wrapper";
import { DetailLayout } from "@/components/DetailLayout";
import { getConfig } from "@/lib/site-data";
import { getProject, getProjectSlugs, tagLabel, visibleTags } from "@/lib/projects";
import {
  buildCreativeWorkJsonLd,
  createProjectMetadata,
  serializeJsonLd,
} from "@/lib/metadata";

export const revalidate = 60;

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [result, config] = await Promise.all([getProject(slug), getConfig()]);
  if (!result.post) return {};

  return createProjectMetadata({
    title: result.post.title,
    description: result.post.description,
    slug,
    image: result.post.image,
    publishedAt: result.post.publishedAt,
    siteName: config.siteName,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [result, config] = await Promise.all([getProject(slug), getConfig()]);

  if (!result.post) {
    return notFound();
  }

  const post = result.post;
  const jsonLd = buildCreativeWorkJsonLd({ post, siteName: config.siteName });
  const disciplines = visibleTags(post.tags);
  // The case's facts line ("> Role: … · Duration: …") becomes the rows
  const { facts, content } = takeFacts(cleanCaseContent(post.content || "", post.image));

  const category = disciplines[0] ? tagLabel(disciplines[0].name) : "Case study";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      {/* Experiment (playground): detail page after playground.nothing.tech's app page */}
      <DetailLayout
        backHref="/#projects"
        backLabel="Back to projects"
        preview={
          post.image ? (
            <Image src={post.image} alt={post.title} fill className="pg-detail__image" priority sizes="360px" />
          ) : null
        }
        title={post.title}
        lead={post.description ?? undefined}
        rows={[{ label: "Category", value: category }, ...facts]}
      >
        <div className="pg-detail__body">
          <WispContent content={content} />
        </div>
      </DetailLayout>
    </>
  );
}

/**
 * Tidy Wisp HTML for the case layout: the cover shows once (Wisp often repeats
 * it in the body), the CMS attribution paragraph goes (the footer credits the
 * site), and leading empty paragraphs are dropped.
 */
function cleanCaseContent(content: string, cover?: string | null): string {
  content = content.replace(/<p[^>]*>\s*<small>\s*<a[^>]*synscribe\.com[^>]*>[\s\S]*?<\/a>\s*<\/small>\s*<\/p>/gi, "");
  if (!cover) return content.replace(/^(\s*<p>\s*<\/p>)+/, "");
  const src = cover.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const img = `<img[^>]*src="${src}"[^>]*>`;
  return content
    .replace(new RegExp(`<(p|figure)[^>]*>\\s*${img}\\s*(<br\\s*/?>\\s*)*(<figcaption>[\\s\\S]*?</figcaption>)?\\s*</\\1>`, "g"), "")
    .replace(new RegExp(img, "g"), "")
    .replace(/^(\s*<p>\s*<\/p>)+/, "");
}

/**
 * Cases open with a facts line in Wisp ("> Role: design and build · Duration: one
 * afternoon · Used in 3 repos"). Lift it into label/value rows and drop it from the
 * text; an "Overview" heading left with nothing under it goes too.
 */
function takeFacts(content: string): { facts: { label: string; value: ReactNode }[]; content: string } {
  // only the facts line, which starts with "Role:" (other "> …" lines are editing notes)
  const match = content.match(/<p>\s*(?:&gt;|>)\s*(Role:[\s\S]*?)<\/p>/);
  if (!match) return { facts: [], content };
  const text = match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
  const facts = text
    .split(/\s+·\s+/)
    .map((part) => {
      const piece = part.trim();
      // "[Repo](https://…)" → a link row
      const link = piece.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
      if (link) {
        return {
          label: link[1],
          value: (
            <a href={link[2]} target="_blank" rel="noopener noreferrer">
              {link[2].replace(/^https?:\/\//, "")} ↗
            </a>
          ),
        };
      }
      const at = piece.indexOf(":");
      return at > 0 ? { label: piece.slice(0, at).trim(), value: piece.slice(at + 1).trim() } : { label: "Notes", value: piece };
    })
    .filter((row) => row.value);
  const rest = content
    .replace(match[0], "")
    .replace(/<h2>(?:<strong>)?\s*Overview\s*(?:<\/strong>)?<\/h2>\s*(?=<h[1-6]|$)/i, "");
  return { facts, content: rest };
}
