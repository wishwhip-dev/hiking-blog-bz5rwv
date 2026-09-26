import Link from "next/link";
import { formatPublished, listPosts, tagSlug } from "@/lib/posts";

/**
 * The index. Generated from the posts on disk — there is no list to maintain and nothing here to
 * edit when a post is added. See `lib/posts.ts`.
 */
export default function Home() {
  const posts = listPosts();

  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground">
        No posts yet. Add one at <code>app/posts/&lt;slug&gt;/page.tsx</code>.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-8">
      {posts.map((post) => (
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
            {post.tags.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tagSlug(tag)}`}
                    className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground no-underline transition-colors hover:border-primary hover:text-primary"
                  >
                    {tag}
                  </Link>
                ))}
              </p>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
