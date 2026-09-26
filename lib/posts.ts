import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export type Post = {
  slug: string;
  title: string;
  blurb: string;
  /** ISO date, `YYYY-MM-DD`. Sorted on as a string, so the format is not optional. */
  published: string;
  tags: string[];
};

const POSTS_DIRECTORY = path.join(process.cwd(), "app", "posts");

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

/**
 * Every post, newest first, read from the filesystem at build time.
 *
 * Derived rather than registered, and that is the whole design. The obvious alternative is a
 * `posts.ts` array that each new post appends itself to — one file every writer edits, which is
 * the one file two posts written at the same time are guaranteed to conflict on. A directory with
 * a `meta.json` in it is a post; nothing else has to agree.
 *
 * A directory whose `meta.json` is missing, unreadable or untitled is skipped rather than thrown
 * on: one malformed post must not take the whole index down with it, and half-written state is
 * normal while a post is being added.
 */
export function listPosts(): Post[] {
  let entries;
  try {
    entries = readdirSync(POSTS_DIRECTORY, { withFileTypes: true });
  } catch {
    return [];
  }

  const posts: Post[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const raw = readFileSync(path.join(POSTS_DIRECTORY, entry.name, "meta.json"), "utf8");
      const meta = JSON.parse(raw) as Record<string, unknown>;
      if (typeof meta.title !== "string" || !meta.title.trim()) continue;
      posts.push({
        slug: entry.name,
        title: meta.title,
        blurb: typeof meta.blurb === "string" ? meta.blurb : "",
        published: typeof meta.published === "string" ? meta.published : "",
        tags: asStringArray(meta.tags),
      });
    } catch {
      continue;
    }
  }

  // Undated posts sort last rather than first: an empty string would otherwise outrank every
  // real date and put the least finished post at the top of the index.
  return posts.sort((a, b) => {
    if (a.published !== b.published) return (b.published || "0").localeCompare(a.published || "0");
    return a.title.localeCompare(b.title);
  });
}

export function getPost(slug: string): Post | undefined {
  return listPosts().find((post) => post.slug === slug);
}

/** `alpine lakes` → `alpine-lakes` — the URL form of a tag under `/tags/`. */
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Every distinct tag across all posts, with the posts carrying each one, newest first. */
export function listTags(): { tag: string; slug: string; posts: Post[] }[] {
  const byTag = new Map<string, Post[]>();
  for (const post of listPosts()) {
    for (const tag of post.tags) {
      const existing = byTag.get(tag) ?? [];
      existing.push(post);
      byTag.set(tag, existing);
    }
  }
  return [...byTag.entries()]
    .map(([tag, posts]) => ({ tag, slug: tagSlug(tag), posts }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

/** `2026-09-11` → `11 September 2026`, and anything unparseable back to itself. */
export function formatPublished(published: string): string {
  if (!published) return "";
  const date = new Date(`${published}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return published;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
