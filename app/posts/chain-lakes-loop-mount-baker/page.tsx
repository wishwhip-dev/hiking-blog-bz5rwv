import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prose } from "@/components/prose";
import { PostHeader } from "@/components/post-header";
import { getPost, listPosts } from "@/lib/posts";

const SLUG = "chain-lakes-loop-mount-baker";

export function generateMetadata(): Metadata {
  const post = getPost(SLUG);
  return { title: post?.title, description: post?.blurb };
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={500}
        className="w-full h-auto rounded-lg border border-border"
      />
      <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

export default function Page() {
  const post = getPost(SLUG);
  if (!post) notFound();
  const others = listPosts().filter((p) => p.slug !== SLUG);

  return (
    <article className="space-y-6">
      <PostHeader title={post.title} published={post.published} tags={post.tags} />

      <Prose>
        <p>
          The Chain Lakes Loop is a day walk I have done a half dozen times from Artist Point, but
          the first weekend of October remade it. A dusting of snow had fallen on Friday night, the
          fog was still lifting off the heather, and Mount Baker stood over everything wearing a
          fresh white coat. We walked the loop counterclockwise from the upper parking lot at
          9:00, in gloves we had not needed since May.
        </p>
      </Prose>

      <Prose>
        <h2>Up into the fog line</h2>
        <p>
          The trail leaves the road end and climbs open slopes toward the ridge, and for the first
          hour we walked in and out of cloud — one minute Baker sharp above us, the next a wall of
          white with thirty feet of visibility and the sound of ptarmigan. The fresh snow was a
          finger deep, squeaking underfoot, and it outlined every trail cairn like chalk.
        </p>
        <Figure
          src="/hikes/chain-lakes-ridge.svg"
          alt="Foggy mountain ridgelines fading into pale mist, with layered slopes dissolving into cloud"
          caption="The ridge in and out of fog, an hour above Artist Point."
        />
      </Prose>

      <div className="max-w-[var(--measure)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trail facts</TableHead>
              <TableHead className="text-right">Chain Lakes Loop</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Distance</TableCell>
              <TableCell className="text-right">9.7 km (6 mi)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Elevation gain</TableCell>
              <TableCell className="text-right">500 m (1,700 ft)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Time on trail</TableCell>
              <TableCell className="text-right">4 h 10 min</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Difficulty</TableCell>
              <TableCell className="text-right">Moderate — easy walking, real exposure to weather</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Best season</TableCell>
              <TableCell className="text-right">August to early October</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Prose>
        <h2>The lakes, one after another</h2>
        <p>
          The loop strings Hayes, Mazama, and Iceberg along the base of Table Mountain, and in this
          light each one was a different animal: steaming, glassy, half-frozen at the margins. We
          ate lunch at Iceberg with the whole cirque to ourselves — one other pair passed all day —
          and watched the fog finally commit to burning off around noon.
        </p>
        <Figure
          src="/hikes/chain-lakes-autumn.svg"
          alt="An autumn mountain lake below dark ridges, with a lone orange huckleberry bush on the shore and mist over the water"
          caption="Iceberg Lake after the fog lifted, frost still on the shoreline."
        />
      </Prose>

      <Alert>
        <AlertTitle>A fair-weather window, not a forecast</AlertTitle>
        <AlertDescription>
          The ridge here is fully exposed and the weather over Baker changes fast. This loop is
          short enough to retreat from — check the Mountain Forecast for the 5,000-foot level, not
          the valley, and turn around when the cloud thickens rather than waiting to test it.
        </AlertDescription>
      </Alert>

      <Prose>
        <h2>Back over the shoulder</h2>
        <p>
          The return crosses the shoulder of Table Mountain with the whole Nooksack cirque below,
          then drops through bands of rust-red huckleberry back toward the parking lot. By the last
          mile the sun had dried the snow off the south-facing slopes and it was, briefly, July
          again. Some trails you do for the first time; this one I keep doing to see what it will
          be next.
        </p>
      </Prose>

      <section className="max-w-[var(--measure)]">
        <h2 className="text-xl font-semibold tracking-tight">More trips</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link href={`/posts/${other.slug}`} className="text-primary underline underline-offset-[3px]">
                {other.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
