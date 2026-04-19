import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { BlogPost } from "@/lib/redis";

type BlogPostCardProps = {
    post: BlogPost;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
    // Pegar as primeiras palavras para servir como descrição rápida se houver texto
    const description = post.content ? post.content.replace(/[#*`_]/g, '').slice(0, 150) + "..." : null;

    return (
        <div className="group flex flex-col space-y-4">
            <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/9] w-full bg-muted transition-transform duration-300 group-hover:scale-105">
                    {post.coverImage ? (
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                            <span className="text-muted-foreground uppercase text-xs font-semibold tracking-widest">{post.category}</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex flex-col space-y-2 px-1">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {post.createdAt && (
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                            {format(new Date(post.createdAt), "LLLL d, yyyy")}
                        </time>
                    )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <div className="flex gap-2">
                                {post.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="uppercase text-xs font-semibold tracking-wider text-primary/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <Link href={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
                    <h2 className="text-2xl font-bold tracking-tight line-clamp-2 leading-tight">
                        {post.title}
                    </h2>
                </Link>
                {description && (
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
