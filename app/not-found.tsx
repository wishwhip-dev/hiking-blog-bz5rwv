import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-[var(--prose-body)]">
        There is no post or tag at this address. It may have been renamed, or the trail may simply
        end here.
      </p>
      <p className="mt-5">
        <Link href="/" className="text-primary underline underline-offset-[3px]">
          Back to all posts
        </Link>
      </p>
    </section>
  );
}
