import Link from "next/link";
import { formatPublished, listPosts } from "@/lib/posts";

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
          </article>
        </li>
      ))}
    </ul>
  );
}
