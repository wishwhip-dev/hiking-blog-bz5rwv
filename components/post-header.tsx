import Link from "next/link";
import { formatPublished, tagSlug } from "@/lib/posts";

/** Title, date and tags for a post page. Every post opens with one. */
export function PostHeader({
  title,
  published,
  tags = [],
}: Readonly<{ title: string; published: string; tags?: string[] }>) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <time dateTime={published}>{formatPublished(published)}</time>
        {tags.length > 0 && (
          <span className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true">·</span>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tagSlug(tag)}`}
                className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground no-underline transition-colors hover:border-primary hover:text-primary"
              >
                {tag}
              </Link>
            ))}
          </span>
        )}
      </p>
    </header>
  );
}
