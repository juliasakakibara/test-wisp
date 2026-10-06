import Image from "next/image";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { WispContent } from "@/components/wisp-content-wrapper";
import { DetailLayout } from "@/components/DetailLayout";
import { ShareButton } from "@/components/ShareButton";
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
  const year = post.publishedAt
    ? format(new Date(post.publishedAt), "yyyy")
    : null;
  const disciplines = visibleTags(post.tags);

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
        meta={year ?? undefined}
        lead={post.description ?? undefined}
        actions={
          <>
            <a href="mailto:talk.to@juliasakakibara.com.br" className="pg-pill pg-pill--signal pg-pill--center">
              <span>Get in touch</span>
            </a>
            <ShareButton title={post.title} />
          </>
        }
        rows={[
          { label: "Category", value: category },
          ...(year ? [{ label: "Year", value: <time dateTime={year}>{year}</time> }] : []),
          ...(disciplines.length > 1
            ? [{ label: "Tags", value: disciplines.map((tag) => tagLabel(tag.name).toLowerCase()).join(" / ") }]
            : []),
        ]}
      >
        <div className="pg-detail__body">
          <WispContent content={cleanCaseContent(post.content || "", post.image)} />
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
