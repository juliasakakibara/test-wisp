import Link from "next/link";
import Image from "next/image";
import type { FeaturedProject } from "@/lib/featured";
import type { ProjectSummary } from "@/lib/projects";

type FeaturedGridProps = {
  projects: FeaturedProject[];
  /** Published Wisp posts, to link cards and use their cover image. */
  posts: ProjectSummary[];
  playgroundCount: number;
};

function FeaturedCard({ project, post }: { project: FeaturedProject; post?: ProjectSummary }) {
  const body = (
    <>
      <div className={`featured-card__media${post?.image ? "" : " featured-card__media--placeholder"}`}>
        {post?.image ? (
          <Image
            src={post.image}
            alt=""
            fill
            className="featured-card__image"
            sizes={project.size === "lg" ? "100vw" : "(max-width: 639px) 100vw, 50vw"}
          />
        ) : null}
      </div>
      <div className="featured-card__text">
        <span className="featured-card__kicker">{project.kicker}</span>
        <span className="featured-card__title">{project.title}</span>
        <span className="featured-card__summary">{project.summary}</span>
        {post ? null : <span className="featured-card__status">Case study coming soon</span>}
      </div>
    </>
  );

  return (
    <li className={`featured-card featured-card--${project.size}`}>
      {post ? (
        <Link href={`/projects/${post.slug}`} className="featured-card__link">
          {body}
        </Link>
      ) : (
        <div className="featured-card__link featured-card__link--soon">{body}</div>
      )}
    </li>
  );
}

export function FeaturedGrid({ projects, posts, playgroundCount }: FeaturedGridProps) {
  const bySlug = new Map(posts.map((post) => [post.slug, post]));

  return (
    <ul className="featured-grid">
      {projects.map((project) => (
        <FeaturedCard key={project.slug} project={project} post={bySlug.get(project.slug)} />
      ))}
      <li className="featured-card featured-card--sm featured-card--playground">
        <Link href="/playground" className="featured-card__link">
          <div className="featured-card__text">
            <span className="featured-card__kicker">Playground</span>
            <span className="featured-card__title">Older projects &amp; experiments →</span>
            <span className="featured-card__summary">
              {playgroundCount > 0 ? `${playgroundCount} more, from apps to 3D and hardware.` : "Apps, 3D and hardware."}
            </span>
          </div>
        </Link>
      </li>
    </ul>
  );
}
