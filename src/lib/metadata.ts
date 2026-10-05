import type { Metadata } from "next";
import { tagLabel, visibleTags, type Project } from "./projects";

/** Site URL — env first, then Vercel, then localhost. The usual suspects. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

function resolveImageUrl(image?: string | null): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return absoluteUrl(image);
}

function toIsoDate(value?: Date | string | null): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

type SiteMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  siteName?: string;
};

export function createSiteMetadata({
  title,
  description,
  path = "/",
  image,
  siteName,
}: SiteMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = resolveImageUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteName ?? title,
      type: "website",
      locale: "en_US",
      ...(ogImage && {
        images: [{ url: ogImage, alt: title }],
      }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

type ProjectMetadataInput = {
  title: string;
  description: string | null;
  slug: string;
  image?: string | null;
  publishedAt?: Date | string | null;
  siteName: string;
};

export function createProjectMetadata({
  title,
  description,
  slug,
  image,
  publishedAt,
  siteName,
}: ProjectMetadataInput): Metadata {
  const path = `/projects/${slug}`;
  const metaDescription = description ?? `Case study: ${title}`;
  const ogImage = resolveImageUrl(image);
  const publishedTime = toIsoDate(publishedAt);

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description: metaDescription,
      url: absoluteUrl(path),
      siteName,
      type: "article",
      locale: "en_US",
      ...(publishedTime && { publishedTime }),
      ...(ogImage && {
        images: [{ url: ogImage, alt: title }],
      }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description: metaDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

type CreativeWorkJsonLdInput = {
  post: Pick<
    Project,
    "title" | "description" | "slug" | "image" | "publishedAt" | "tags" | "author"
  >;
  siteName: string;
};

/** JSON-LD for Google — structured data so machines know this is a real case study. */
export function buildCreativeWorkJsonLd({ post, siteName }: CreativeWorkJsonLdInput) {
  const url = absoluteUrl(`/projects/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: post.title,
    headline: post.title,
    description: post.description ?? undefined,
    url,
    image: resolveImageUrl(post.image),
    datePublished: toIsoDate(post.publishedAt),
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: getSiteUrl(),
    },
    ...(post.author?.name && {
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    }),
    ...(post.tags?.length && {
      keywords: visibleTags(post.tags).map((tag) => tagLabel(tag.name)).join(", "),
    }),
  };
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
