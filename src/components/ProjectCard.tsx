import Link from "next/link";
import Image from "next/image";
import { tagLabel, visibleTags, type ProjectSummary } from "@/lib/projects";

export type ProjectCardSize = "lg" | "md";

type ProjectCardProps = {
  post: ProjectSummary;
  size?: ProjectCardSize;
};

/**
 * One card for the home grid and the Playground (after notreal.tv): the image
 * is the card. Text follows the home intro pattern — title as h3 (lead style),
 * description as p (muted) — then the tags as a " / " line.
 */
export function ProjectCard({ post, size = "md" }: ProjectCardProps) {
  const tags = visibleTags(post.tags).map((tag) => tagLabel(tag.name).toLowerCase());

  return (
    <li className={`featured-card featured-card--${size}`}>
      <Link href={`/projects/${post.slug}`} className="featured-card__link">
        <div className={`featured-card__media${post.image ? "" : " featured-card__media--placeholder"}`}>
          {post.image ? (
            <Image
              src={post.image}
              alt=""
              fill
              className="featured-card__image"
              sizes={size === "lg" ? "100vw" : "(max-width: 639px) 100vw, 50vw"}
            />
          ) : null}
        </div>
        <div className="featured-card__text">
          <h3 className="featured-card__title">{post.title}</h3>
          {post.description ? <p className="featured-card__summary">{post.description}</p> : null}
          {tags.length > 0 ? <p className="featured-card__tags">{tags.join(" / ")}</p> : null}
        </div>
      </Link>
    </li>
  );
}
