import Link from "next/link";
import Image from "next/image";
import { projectCategory, type ProjectSummary } from "@/lib/projects";

type FeaturedSize = "lg" | "md";

type FeaturedGridProps = {
  /** Published Wisp posts without the playground tag, newest first. */
  posts: ProjectSummary[];
  playgroundCount: number;
};

function FeaturedCard({ post, size }: { post: ProjectSummary; size: FeaturedSize }) {
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
          <span className="featured-card__kicker">{projectCategory(post)}</span>
          <span className="featured-card__title">{post.title}</span>
          {post.description ? <span className="featured-card__summary">{post.description}</span> : null}
        </div>
      </Link>
    </li>
  );
}

/**
 * Home grid from the wireframe: the newest post is large, the rest pair up
 * as medium cards. The Playground card fills the last half row, or takes a
 * full row when the medium cards pair up evenly.
 */
export function FeaturedGrid({ posts, playgroundCount }: FeaturedGridProps) {
  const mediumCount = Math.max(posts.length - 1, 0);
  const playgroundSize = mediumCount % 2 === 1 ? "md" : "wide";

  return (
    <ul className="featured-grid">
      {posts.map((post, index) => (
        <FeaturedCard key={post.id} post={post} size={index === 0 ? "lg" : "md"} />
      ))}
      <li className={`featured-card featured-card--${playgroundSize} featured-card--playground`}>
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
