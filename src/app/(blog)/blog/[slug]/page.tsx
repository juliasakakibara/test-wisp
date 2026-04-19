import Image from "next/image";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, listPosts } from "@/lib/actions";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

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
        return posts.map((post) => ({
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
        <article className="container mx-auto max-w-4xl px-4 py-16">
            <header className="mb-12 text-center space-y-6">
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                    {post.createdAt && (
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                            {format(new Date(post.createdAt), "LLLL d, yyyy")}
                        </time>
                    )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <div className="flex gap-2">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="uppercase text-xs font-semibold tracking-wider text-primary/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-balance sm:text-6xl">
                    {post.title}
                </h1>
            </header>

            {post.coverImage && (
                <div className="relative aspect-[21/9] w-full mb-16 overflow-hidden rounded-3xl bg-muted">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                </div>
            )}

            {/* Rendering Markdown HTML directly */}
            <div 
               className="prose prose-lg mx-auto sm:prose-xl lg:prose-2xl prose-slate"
               dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
        </article>
    );
}
