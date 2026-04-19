import Image from "next/image";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, listPosts } from "@/lib/actions";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true });

export const revalidate = 60; // ISR: Revalidate page every 60 seconds

interface Params {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        const posts = await listPosts(0, 100, false);
        if (posts.length === 0) {
            return [{ slug: 'demo-post' }]; // Fallback
        }
        return posts.map((post: { slug: string }) => ({
            slug: post.slug,
        }));
    } catch (err) {
        console.error("Error fetching posts from Redis during build:", err);
        return [{ slug: 'demo-post' }];
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return {};

    // Quick description from content if not available
    const description = post.content ? post.content.replace(/[#*`_]/g, '').slice(0, 150) + "..." : "";

    return {
        title: post.title,
        description: description,
    };
}

export default async function BlogPostPage({ params }: Params) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return notFound();
    }

    const htmlContent = md.render(post.content || "");

    return (
        <article className="post-detail">
            <header className="post-detail-header">
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
                <h1 className="post-detail-title">
                    {post.title}
                </h1>
            </header>

            {post.coverImage && (
                <div className="post-detail-image">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                </div>
            )}

            <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </article>
    );
}
