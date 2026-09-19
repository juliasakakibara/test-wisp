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
    <article className="project-page julia-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <nav className="project-nav" aria-label="Project">
        <Link href="/#work" className="project-nav__back">
          ← All work
        </Link>
      </nav>

      <div className="julia-grid">
        <header className="project-header julia-item full-width">
          <div className="project-meta">
            <span className="project-card__kind">Case study</span>
            {year && (
              <>
                <span className="meta-separator" aria-hidden="true">
                  ·
                </span>
                <time dateTime={year}>{year}</time>
              </>
            )}
            {disciplines.length > 0 && (
              <>
                <span className="meta-separator" aria-hidden="true">
                  ·
                </span>
                <ul className="project-meta__tags" aria-label="Disciplines">
                  {disciplines.map((tag) => (
                    <li key={tag.id} className="project-tag">
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <h1 className="project-title">{post.title}</h1>
          {post.description && (
            <p className="project-lead">{post.description}</p>
          )}
        </header>

        {post.image && (
          <div className="project-cover julia-item full-width">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="project-cover-fill"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        <div className="project-content julia-reading-column">
          <WispContent content={post.content || ""} />
        </div>
      </div>
    </article>
  );
}
