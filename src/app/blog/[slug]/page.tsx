import { wisp } from "@/lib/wisp";
import Image from "next/image";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR: Revalidate page every 60 seconds

interface Params {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        const result = await wisp.getPosts({ limit: 100 });
        if (!result.posts || result.posts.length === 0) {
            return [{ slug: 'demo-post' }]; // Fallback required for static export
        }
        return result.posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (err) {
        console.error("Error fetching Wisp posts during build:", err);
        return [{ slug: 'demo-post' }]; // Fallback
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const result = await wisp.getPost(slug);
    if (!result || !result.post) return {};
    return {
        title: result.post.title,
        description: result.post.description,
    };
}

export default async function BlogPostPage({ params }: Params) {
    const { slug } = await params;
    const result = await wisp.getPost(slug);

    if (!result || !result.post) {
        return notFound();
    }

    const { post } = result;

    return (
        <article className="container mx-auto max-w-4xl px-4 py-16">
            <header className="mb-12 text-center space-y-6">
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                    {post.publishedAt && (
                        <time dateTime={post.publishedAt.toString()}>
                            {format(new Date(post.publishedAt), "LLLL d, yyyy")}
                        </time>
                    )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <div className="flex gap-2">
                                {post.tags.map((tag) => (
                                    <span key={tag.id} className="uppercase text-xs font-semibold tracking-wider text-primary/80">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-balance sm:text-6xl">
                    {post.title}
                </h1>
                {post.description && (
                    <p className="text-xl text-muted-foreground md:text-2xl text-balance mx-auto max-w-2xl">
                        {post.description}
                    </p>
                )}
            </header>

            {post.image && (
                <div className="relative aspect-[21/9] w-full mb-16 overflow-hidden rounded-3xl bg-muted">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                </div>
            )}

            <div
                className="prose prose-lg dark:prose-invert mx-auto max-w-3xl prose-headings:font-bold prose-headings:tracking-tighter prose-a:text-primary hover:prose-a:text-primary/80"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
        </article>
    );
}
