# Working in this project

A blog. Each post is a route: `/posts/<slug>`, written as ordinary React.

Most tasks on this repository add **one post** and change nothing else. Read this instead of
exploring. It is the whole setup.

## What this project is for

A blog of interactive explainer posts, where each task usually adds one post.

Good for: explainers with charts and controls; tutorials and walkthroughs; essays with live demos; visual or 3D explanations.

Not built for: saving anything between visits; accounts or sign-in; calling outside services or APIs.

A request that needs one of these is outside what this project can deliver as it stands: plan the closest thing it can, and say plainly what was left out.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · shadcn/ui · 14 shadcn/ui components pre-installed (dialog, select, table, card, form inputs, tabs, alert) · 11 more shadcn/ui components (accordion, collapsible, popover, progress, radio group, scroll area, slider, switch, toggle, toggle group, tooltip) · Recharts (themed chart components, already wired to the palette) · Motion (animation, imported as motion/react) · three.js (WebGL, software-rendered in the verification browser). No database, no CMS, no auth.

## Layout

```
app/layout.tsx               site shell — header, footer, metadata template.
app/page.tsx                 the index. GENERATED from the posts on disk. Do not hand-edit.
app/globals.css              tokens and the `.prose` typography scope.
app/posts/<slug>/page.tsx    one post.
app/posts/<slug>/meta.json   its title, blurb, date and tags.
components/prose.tsx         <Prose> — the typography scope for body copy.
components/post-header.tsx   <PostHeader> — title, date, tags. Every post opens with one.
lib/posts.ts                 reads app/posts/*/meta.json at build time. The index's only source.
scripts/check-density.mjs    npm test: fails a post that is prose where panels belong.
app/providers.tsx            "use client" — composed from this project's modules. Already wired into layout.
types/webgpu.d.ts            WebGPU type reference. See "Graphics" below.
template.capabilities.json   what this template ships, declared for the planner. Keep it accurate.
components/ui/               the shadcn components, already themed. See docs/components.md.
lib/utils.ts                 cn() — the className merge helper every shadcn component expects.
components.json              shadcn config: new-york, neutral, rsc, aliases @/components and @/lib.
components/ui/chart.tsx      the Recharts wrapper. Import from it; do not edit it.
components/canvas-stage.tsx  the canvas host. Pass it a renderer; do not hand-roll a canvas.
lib/graphics.ts              what the current browser can draw with. WebGPU is absent where this is verified.
```

`@/*` resolves to the project root.

## What is already installed

Use these. Do not reinstall them, do not add a second library that does the same job, and do not
hand-roll a slider or a tab strip — they are here and they match the site's styling.

**`components/ui/` — 26 shadcn components, already themed:**

```
accordion  alert     badge     button    card      chart     checkbox     collapsible  dialog
input      label     popover   progress  radio-group  scroll-area  select  separator  skeleton
slider     switch    table     tabs      textarea  toggle    toggle-group  tooltip
```

**"Which component for which job" under "The shape of a post" maps these to what a reader needs to
do.** A post that imports six of them has almost certainly written prose where a panel belonged.

Anything else from the registry: `npx shadcn@latest add --yes <name>`. The `--yes` is required —
without it the CLI waits for a prompt nobody can answer and the command times out.

**Charts — `@/components/ui/chart`**, which wraps Recharts and maps your series onto the theme:

```tsx
const config = { anxiety: { label: "Anxiety", color: "var(--chart-1)" } } satisfies ChartConfig;

<ChartContainer config={config} className="h-[240px] w-full">
  <AreaChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="round" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Area dataKey="anxiety" stroke="var(--color-anxiety)" fill="var(--color-anxiety)"
          fillOpacity={0.2} isAnimationActive={false} />
  </AreaChart>
</ChartContainer>
```

**`isAnimationActive={false}` on every Recharts series is not optional.** Recharts animates a
series in from zero width on mount, and that animation does not complete in the headless browser
this project is verified with — the grid and axes draw, the data does not, and the chart is
checked as an empty box. Measured, not guessed. Five colours are themed: `--chart-1` to
`--chart-5`.

**Animation — `motion`**, imported as `motion/react` (not `framer-motion`, which is the same
library under its old name — do not install it):

```tsx
"use client";
import { motion } from "motion/react";
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} />
```

Respect `prefers-reduced-motion` for anything that moves on its own.

**Icons — `lucide-react`.**

## Graphics: picking the medium for each panel

Three media ship. Choosing between them panel by panel is part of writing the post.

| Reach for | When the thing being explained is |
| --- | --- |
| `@/components/ui/chart` (Recharts) | a quantity against a dimension — series, distributions, comparisons |
| DOM/SVG + Motion | discrete, labelled or clickable — state machines, small counts, diagrams |
| `<CanvasStage>` + `three` | continuous or spatial — fields, waves, 3D geometry, thousands of elements |

A chart is the right answer more often than a canvas is. Reach past Recharts when the idea *is*
spatial or continuous, never to make a chart look more impressive.

**Measured in the verification browser** (headless Chromium, no GPU, checked 2026-09-12): WebGL 1
and WebGL 2 both work through SwiftShader and return real pixels, at software speed — a canvas
post is verifiable. `navigator.gpu` is **absent**, so nothing on a page may require WebGPU.

**Every canvas goes in `<CanvasStage>`** (`@/components/canvas-stage`): it acquires the context,
sizes the backing store to the element and device pixel ratio, drives the frame loop, honours
`prefers-reduced-motion` and disposes on unmount. Its `fallback` renders on the server and stays
up until a context exists, so a canvas that cannot draw is never a blank box.

```tsx
"use client";
import * as THREE from "three";
import { CanvasStage } from "@/components/canvas-stage";

<CanvasStage<WebGL2RenderingContext>
  label="What the drawing shows, for a reader who cannot see it"
  fallback={<p>The same conclusion in words, or a committed still.</p>}
  start={({ canvas, width, height, dpr, reducedMotion }) => {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    // ...build scene and camera...
    return {
      frame: (t) => renderer.render(scene, camera),  // t = elapsed seconds
      resize: (w, h, d) => { /* setSize, camera.aspect, updateProjectionMatrix */ },
      dispose: () => renderer.dispose(),
    };
  }}
/>
```

`start` runs once per context. **Dispose every geometry, material and renderer you make**; a post
unmounts when the reader navigates away. Software rendering affords a few thousand triangles at
60fps, not a million. `reducedMotion` means one settled frame, not frozen at frame zero. And
`fallback` must say something — a still, a table of the same numbers, or the conclusion in a
sentence, never "your browser does not support WebGL".


## Read these four files. Do not read other posts.

Everything a post task needs to know is either in this file or in these four:

```
lib/posts.ts               how the index finds posts, and the meta.json fields it reads
components/prose.tsx       the typography scope your body copy goes inside
components/post-header.tsx the title/date/tags block every post opens with
app/globals.css            the tokens, and what `.prose` styles
```

That is the whole contract; `components/canvas-stage.tsx` is a fifth, worth opening only when you
are writing a canvas panel and want its exact types. **Other posts under `app/posts/` share no
code with yours.** Do not
open them — not to learn the shape (it is below), not for style, not for reference. A post is
self-contained by design: its own directory, its own components, its own data module. Reading a
neighbour costs thousands of tokens and teaches you nothing that is true of your post.

If a post needs a component of its own, put it in `components/` named for that post
(`components/newcomb-lab.tsx`), and its data or pure logic in `lib/` the same way
(`lib/newcomb.ts`). Never import another post's components.

## The shape of a post

A post is **an instrument the reader operates**, with prose between the panels — not an essay with
widgets dropped into it. When a task names a topic and says nothing about form, this is the form.

Measured on a finished post that read as a blog article: 29 paragraphs against 5 controls, and 19
of the 24 installed components never imported. That is the failure to avoid, and it happens by
defaulting to a paragraph whenever a panel would have been more work.

**The rule of thumb: no more than two consecutive paragraphs without something to operate.** If a
third is needed, the idea in it is usually a control, a readout or a table that has not been built
yet.

- **Lead with the model.** The thing the reader manipulates is the centre of the post and appears
  early — above the first long passage of prose, not after it.
- **Anything the reader could set, they should set.** A number the prose states is a number the
  prose could instead let them change. Assumptions, rates, counts, thresholds and starting
  conditions are all controls.
- **Every figure on screen is computed.** Never type a number into prose that the model produces —
  interpolate it from the same calculation the panels use. A hardcoded "200 J" beside a panel
  reading 350 J is the single most common defect in these posts.
- **Let the claim fall out of the mechanism.** If the argument is that X produces Y, the reader
  should produce Y by moving X, not read that they would.
- **One chart and one slider is under-built.** A second view of the same model, a breakdown table
  or a before/after comparison is what makes an idea explorable.

### Plan the media before you write any of it

Your first task item is a media plan: one line per section, naming what the reader does there and
what renders it. Put it in your task list so it survives compaction, then build against it. This
is what stops a post defaulting to paragraphs — the medium gets chosen once, deliberately, rather
than implicitly at every heading.

```
section            reader does                    medium
prediction         picks one of three             RadioGroup + Card
the machine        steps through 3 stages         SVG diagram + Button, Motion
one cycle          plays / steps / resets         SVG + Button, live Badge readouts
performance        drags a ratio                  Slider + Table breakdown + ChartContainer
boundary           flips inside / outdoors        ToggleGroup + the same SVG, re-lit
```

One line per section does not mean one control per section. A section usually needs several — the
control that sets the input, the readouts that answer it, and often a second view of the same
result. Five sections with one control each is a plan for an essay with five widgets in it, which
is the exact thing this shape exists to avoid.

Prefer the medium that fits the information, not the one that is quickest: quantities over a range
are a chart, several related figures are a table, one computed figure is a `Badge`, and anything
the reader could vary is a control rather than a sentence. If a section's medium is "paragraph",
say why the thing cannot be operated — that is the question worth asking before writing it.

**Pick the drawing technology deliberately too.** SVG is right for a labelled schematic with a
handful of moving parts, and stays crisp and accessible. Reach for `<CanvasStage>` and three.js
when the visual is genuinely spatial or continuous, or when there are more elements than the DOM
should hold — a field, a flow, thousands of particles, anything with depth or lighting. A diagram
that looks flat and diagrammatic when the subject is physical is a sign the wrong one was chosen.

### Which component for which job

26 shadcn components ship. Using six of them is the symptom of a post that became an essay. Reach
for the one that fits rather than writing a sentence, and never hand-roll one of these.

| The reader needs to | Use |
| --- | --- |
| set a value on a range | `Slider`, or `Input` when the exact number matters |
| pick one of two or three | `RadioGroup`, `ToggleGroup` |
| switch a condition on or off | `Switch`, `Checkbox` |
| pick one of many | `Select` |
| compare two framings of the same model | `Tabs` |
| see a figure the model computed | `Badge` for one, `Table` for a breakdown |
| see a proportion at a glance | `Progress` |
| see the shape of a relationship | `ChartContainer` (Recharts) — see above |
| read a definition without losing their place | `Tooltip`, `Popover` |
| go deeper, optionally | `Accordion`, `Collapsible` |
| be warned about a caveat or assumption | `Alert` |
| focus on one thing | `Dialog` |
| scan a long list | `ScrollArea` |

Panels themselves go in `Card`, which is what makes a post look built rather than typed. Use
`Separator` between sections of a panel, and `Skeleton` only where something genuinely loads.

Some posts really are mostly writing. That is a choice a task makes explicitly — not the default
you fall back to because prose is quicker to produce than a working model.

## Adding a post

Create **one directory** under `app/posts/` and put exactly two files in it.

`app/posts/<slug>/meta.json`:

```json
{
  "title": "The post's title",
  "blurb": "One sentence, shown on the index.",
  "published": "2026-09-11",
  "tags": ["optional", "tags"]
}
```

`published` must be `YYYY-MM-DD` — the index sorts on it as a string, newest first, and an
undated post sorts last.

`app/posts/<slug>/page.tsx` — the whole skeleton, so you never need to read another post:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { PostHeader } from "@/components/post-header";
import { getPost } from "@/lib/posts";

const SLUG = "your-slug";

export function generateMetadata(): Metadata {
  const post = getPost(SLUG);
  return { title: post?.title, description: post?.blurb };
}

export default function Page() {
  const post = getPost(SLUG);
  if (!post) notFound();
  return (
    <article className="space-y-8">
      <PostHeader title={post.title} published={post.published} tags={post.tags} />
      <Prose><p>A short lead — what the reader is about to operate.</p></Prose>

      {/* The instrument comes first and is the spine of the post. It is a client component of
          its own; the page stays a server component. */}
      <YourLab />

      <Prose><p>One or two paragraphs on what just happened, then the next panel.</p></Prose>
      <YourSecondView />
    </article>
  );
}
```

The panels are the spine and the prose is the connective tissue between them. A page whose body is
one long `<Prose>` block is the shape this project exists to avoid.

The slug is the URL, and it must match `SLUG` and the directory name. Lowercase,
hyphen-separated, no spaces.

**Nothing else needs to change.** There is no list of posts to append to — `lib/posts.ts` reads
the directory at build time, which is deliberate: a central registry would be one file that every
post has to edit, and the one file two posts written at the same time would collide on.

## Rules for a post task

- **Do not read or modify another post's directory.** Other posts belong to other tasks. Do not
  open them, and do not restructure, retitle, re-date or "improve" them.
- **Do not hand-edit `app/page.tsx`.** It is the generated index. If a post is not appearing, the
  cause is its `meta.json`, not the index.
- **Do not change `app/layout.tsx` or the site header** unless the task actually asks for it.
- Write the post the task asks for, at the length it deserves. A post with one thin paragraph
  under each heading is not a finished post.

## Conventions

**Server components by default.** A post is a server component. Add `"use client"` only to a
child component that needs state, effects or browser APIs — an interactive demo inside a post
goes in its own client component, not by converting the whole post.

**Typography is opt-in.** `app/globals.css` styles nothing by bare element name; body copy is
styled because `<Prose>` wraps it. Do not add bare `h2 {}` or `p {}` rules — in a site with a
page per post they reach every post ever written.

**Tailwind v4 has no `tailwind.config.js`.** Configuration lives in CSS. `app/globals.css` holds
the shadcn token set on `:root` and maps it through `@theme inline` — that mapping is what makes
`bg-background`, `text-muted-foreground` and `bg-primary` exist at all, so do not remove it.

**The site is dark, with one palette.** The dark values sit directly on `:root`; there is no
`.dark` class and no light theme. Style with tokens (`bg-card`, `text-muted-foreground`,
`border-border`, `bg-primary`), never with `dark:` variants — they never activate here, and a
`dark:`-styled component renders invisibly against the background.

**shadcn components are copied in, not imported from a package.** Add one with
`npx shadcn@latest add <name>`, or write the file into `components/ui/` in the same style as
`button.tsx`.

**Images** go in `public/` and are referenced as `/name.png`. Use `next/image`.

**Dependencies.** `npm install <pkg>` works — there is a real shell with network access.

## How this is checked

`npm test` runs `scripts/check-density.mjs`, which fails the run when a post has more than 1.5
paragraphs per thing the reader can operate. It is not a style opinion — it is the line that
separates the posts this project has accepted from the one it rejected as "too like a text blog".
If it fails, the fix is not to delete paragraphs: it is to turn what a paragraph asserts into
something the reader sets. A post that is genuinely meant to be mostly writing opts out with
`"prose": true` in its `meta.json`, which is a decision a task makes on purpose and shows in review.

```
npm install
npm test --if-present
npm run lint --if-present
npm run build
```

Then a headless Chromium opens the built site and records console errors, uncaught exceptions,
failed requests and the rendered text of each route. A post that renders nothing, or throws on
mount, fails the run even when `npm run build` passed.

The browser has **no GPU**, but it does have software WebGL — see "Graphics". `navigator.gpu` is
absent, and anything gated behind a context that fails must degrade to something visible rather
than a blank canvas.

## Do not

- **Do not scaffold a new application over this one.** No `create-next-app`.
- **Do not run a dev server.** `next dev` / `npm run dev` are blocked; use `npm run build`.
- **Do not install Playwright, Puppeteer or Selenium.** Browser automation is blocked.
- **Do not delete this file.** It is the briefing for every later task on this repository.
