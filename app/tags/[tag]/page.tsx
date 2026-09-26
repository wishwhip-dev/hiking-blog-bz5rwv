import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPublished, listTags } from "@/lib/posts";

/**
 * `/tags/<tag>` — every post carrying the tag, newest first. An unknown tag renders the
 * not-found page rather than an empty list.
 */
export function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Metadata {
  const { tag } = params;
  const entry = listTags().find((candidate) => candidate.slug === tag);
  return { title: entry ? `Posts tagged “${entry.tag}”` : "Tag not found" };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const entry = listTags().find((candidate) => candidate.slug === tag);
  if (!entry) notFound();

  return (
    <section>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Tagged</p>
        <h1 className="text-3xl font-semibold tracking-tight">{entry.tag}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {entry.posts.length} {entry.posts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      <ul className="flex flex-col gap-8">
        {entry.posts.map((post) => (
          <li key={post.slug}>
            <article>
              <h2 className="text-xl font-medium tracking-tight">
                <Link href={`/posts/${post.slug}`} className="no-underline hover:text-primary">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                <time dateTime={post.published}>{formatPublished(post.published)}</time>
              </p>
              {post.blurb && <p className="mt-2 text-[var(--prose-body)]">{post.blurb}</p>}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
