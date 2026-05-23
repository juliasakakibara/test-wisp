import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { ProjectSummary } from "@/lib/projects";

type ProjectCardProps = {
  post: ProjectSummary;
  variant?: "list" | "card";
};

const MAX_DISCIPLINES = 2;

export function ProjectCard({ post, variant = "list" }: ProjectCardProps) {
  const href = `/projects/${post.slug}`;
  const year = post.publishedAt
    ? format(new Date(post.publishedAt), "yyyy")
    : null;
  const disciplines = post.tags?.slice(0, MAX_DISCIPLINES) ?? [];
  const hiddenDisciplineCount = Math.max(
    (post.tags?.length ?? 0) - MAX_DISCIPLINES,
    0
  );

  if (variant === "card") {
    return (
      <article className="julia-item julia-subgrid project-card">
        {post.image ? (
          <Link href={href} className="project-card__link">
            <div className="project-card__image">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="project-card__image-fill"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </Link>
        ) : (
          <Link href={href} className="project-card__link">
            <div
              className="project-card__image project-card__image--placeholder"
              aria-hidden="true"
            />
          </Link>
        )}

        <div className="project-card__meta">
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
              <ul className="project-card__disciplines" aria-label="Disciplines">
                {disciplines.map((tag) => (
                  <li key={tag.id} className="project-tag">
                    {tag.name}
                  </li>
                ))}
                {hiddenDisciplineCount > 0 && (
                  <li className="project-tag" aria-label={`${hiddenDisciplineCount} more disciplines`}>
                    +{hiddenDisciplineCount}
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        <Link href={href} className="project-card__title-link">
          <h2 className="project-card__title">{post.title}</h2>
        </Link>

        {post.description && (
          <p className="project-card__description">{post.description}</p>
        )}
      </article>
    );
  }

  return (
    <li className="project-list-item">
      <Link href={href} className="project-list-item__link">
        <h3 className="project-list-item__title">{post.title}</h3>
        {post.description && (
          <p className="project-list-item__description">{post.description}</p>
        )}
        {(year || disciplines.length > 0) && (
          <p className="project-list-item__meta">
            {year && <time dateTime={year}>{year}</time>}
            {year && disciplines.length > 0 && (
              <span className="project-list-item__meta-separator" aria-hidden="true">
                {" · "}
              </span>
            )}
            {disciplines.length > 0 && (
              <span className="project-list-item__tags">
                {disciplines.map((tag) => tag.name).join(", ")}
                {hiddenDisciplineCount > 0 && ` +${hiddenDisciplineCount}`}
              </span>
            )}
          </p>
        )}
      </Link>
    </li>
  );
}
