import Link from "next/link";
import Image from "next/image";
import type { ProjectSummary } from "@/lib/projects";

type ProjectCardProps = {
  post: ProjectSummary;
};

export function ProjectCard({ post }: ProjectCardProps) {
  const href = `/projects/${post.slug}`;
  const category = post.tags?.[0]?.name ?? "Case study";

  return (
    <li className="julia-item project-card">
      <Link href={href} className="project-card__link">
        <div
          className={`project-card__media${post.image ? "" : " project-card__media--placeholder"}`}
        >
          {post.image ? (
            <Image
              src={post.image}
              alt=""
              fill
              className="project-card__image-fill"
              sizes="(max-width: 639px) 100vw, 50vw"
            />
          ) : null}
          <div className="project-card__label">
            <span className="project-card__category">{category}</span>
            <span className="project-card__name">{post.title}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
