import Link from "next/link";
import { format } from "date-fns";
import type { ProjectSummary } from "@/lib/projects";

type ProjectCardProps = {
  post: ProjectSummary;
};

const MAX_DISCIPLINES = 2;

export function ProjectCard({ post }: ProjectCardProps) {
  const href = `/projects/${post.slug}`;
  const year = post.publishedAt
    ? format(new Date(post.publishedAt), "yyyy")
    : null;
  const disciplines = post.tags?.slice(0, MAX_DISCIPLINES) ?? [];
  const hiddenDisciplineCount = Math.max(
    (post.tags?.length ?? 0) - MAX_DISCIPLINES,
    0
  );

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
