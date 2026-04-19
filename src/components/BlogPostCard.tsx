import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { BlogPost } from "@/lib/redis";

type BlogPostCardProps = {
    post: BlogPost;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
    const description = post.content ? post.content.replace(/[#*`_]/g, '').slice(0, 140) + "..." : null;

    return (
        <article className="post-card">
            <Link href={`/blog/${post.slug}`} className="post-card-image-wrap">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="post-card-placeholder">
                        <span className="label opacity-20">{post.category}</span>
                    </div>
                )}
            </Link>
            <div className="post-card-content">
                <div className="post-meta">
                    {post.createdAt && (
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </time>
                    )}
                    {post.category && (
                        <>
                            <span>/</span>
                            <span>{post.category}</span>
                        </>
                    )}
                </div>
                <Link href={`/blog/${post.slug}`} className="post-title-link">
                    <h2 className="post-title">
                        {post.title}
                    </h2>
                </Link>
                {description && (
                    <p className="post-description">
                        {description}
                    </p>
                )}
            </div>
        </article>
    );
}
