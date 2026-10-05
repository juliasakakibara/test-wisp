import Link from "next/link";
import type { ProjectSummary } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";

type FeaturedGridProps = {
  /** Published Wisp posts without the playground tag, newest first. */
  posts: ProjectSummary[];
  playgroundCount: number;
};

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
        <ProjectCard key={post.id} post={post} size={index === 0 ? "lg" : "md"} />
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
