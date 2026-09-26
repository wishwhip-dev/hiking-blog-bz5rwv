import { formatPublished } from "@/lib/posts";

/** Title, date and tags for a post page. Every post opens with one. */
export function PostHeader({
  title,
  published,
  tags = [],
}: Readonly<{ title: string; published: string; tags?: string[] }>) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        <time dateTime={published}>{formatPublished(published)}</time>
        {tags.length > 0 && <span> · {tags.join(", ")}</span>}
      </p>
    </header>
  );
}
