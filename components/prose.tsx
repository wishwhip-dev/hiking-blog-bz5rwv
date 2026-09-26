/**
 * The typography scope for post body copy.
 *
 * The styles live in `app/globals.css` under `.prose` rather than on bare `h2`/`p` selectors, so
 * a post can only be styled by opting in. Wrap the written part of a post in this and leave
 * navigation, cards and interactive controls to Tailwind classes.
 */
export function Prose({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="prose">{children}</div>;
}
