import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { WispContent } from "@/components/wisp-content-wrapper";
import { getConfig } from "@/lib/site-data";
import { getProject, getProjectSlugs } from "@/lib/projects";
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
  const disciplines = post.tags ?? [];

  return (
    <article className="project-page case-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <nav className="project-nav" aria-label="Project">
        <Link href="/#work" className="project-nav__back link">
          ← Projects
        </Link>
      </nav>

      {/* Wireframe "project details": title + lead on the left, details on the right */}
      <header className="case-header">
        <div className="case-header__text">
          <h1 className="case-title">{post.title}</h1>
          {post.description && <p className="case-lead">{post.description}</p>}
        </div>
        <dl className="case-details">
          <div className="case-details__row">
            <dt>Type</dt>
            <dd>Case study</dd>
          </div>
          {year && (
            <div className="case-details__row">
              <dt>Year</dt>
              <dd>
                <time dateTime={year}>{year}</time>
              </dd>
            </div>
          )}
          {disciplines.length > 0 && (
            <div className="case-details__row">
              <dt>Tags</dt>
              <dd>
                <ul className="case-tags" aria-label="Disciplines">
                  {disciplines.map((tag) => (
                    <li key={tag.id} className="hero-tag">
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </header>

      {post.image && (
        <div className="case-cover">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="project-cover-fill"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
        </div>
      )}

      {/* Wisp HTML laid out by CSS (§13 case page): H2 wide on the left, text in the right column, images full width */}
      <div className="case-content">
        <WispContent content={post.content || ""} />
      </div>
    </article>
  );
}
