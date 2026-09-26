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

const SLUG = "spray-park-mount-rainier";

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
          Spray Park is the meadow garden on Mount Rainier&rsquo;s quieter northwest side, and for a
          few weeks each July it is the best flower show in the Cascades. The hike climbs steadily
          out of old growth, breaks into open heather, and ends on a ridge bench with the mountain
          filling the southern sky. We started from the Mowich Lake trailhead at 8:40 in the
          morning, in air that still smelled of yesterday&rsquo;s rain.
        </p>
      </Prose>

      <Prose>
        <h2>Into the old growth</h2>
        <p>
          The first hour is shaded tunnel. Firs six feet across close over the trail, the light goes
          green-grey, and the switchbacks count themselves off. There is a rhythm to this stretch:
          short step, long step, breathe, and listen for the creek getting louder below. Paul Peak
          peeked through the trunks a couple of times, a warm-up hill that gives the first real
          sightlines before the forest closes again.
        </p>
        <Figure
          src="/hikes/spray-park-forest.svg"
          alt="Shaded old-growth forest with tall dark firs, a sunlit ridge in the distance, and a pale sky above the canopy"
          caption="The approach through old growth below Paul Peak, mid-morning."
        />
      </Prose>

      <Prose>
        <h2>The meadows open</h2>
        <p>
          At the junction the trees simply give up, and the hillside unrolls: acres of avalanche
          lily, paintbrush, and lupine with Rainier rising behind. We took the bench above the main
          basin for lunch and did not move for an hour. The flower peak here usually lands between
          mid-July and early August; a week earlier the lilies dominate, a week later the paintbrush
          takes over. This was exactly the overlap, and the bees were working it hard.
        </p>
        <Figure
          src="/hikes/spray-park-meadows.svg"
          alt="Rolling green meadow dotted with pink and yellow wildflowers, snow-covered Mount Rainier rising behind forested ridges"
          caption="Spray Park in full bloom, with Rainier&rsquo;s snowfields behind."
        />
      </Prose>

      <div className="max-w-[var(--measure)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trail facts</TableHead>
              <TableHead className="text-right">Spray Park loop</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Distance</TableCell>
              <TableCell className="text-right">10.2 km (6.3 mi)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Elevation gain</TableCell>
              <TableCell className="text-right">790 m (2,600 ft)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Time on trail</TableCell>
              <TableCell className="text-right">5 h 20 min, with a long lunch</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Difficulty</TableCell>
              <TableCell className="text-right">Moderate — steady climb, no exposure</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Best season</TableCell>
              <TableCell className="text-right">Mid-July to mid-August</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Prose>
        <h2>Turning at the ridge</h2>
        <p>
          Beyond the meadows the trail kicks up one last pitch to a knoll at the top of Spray Park,
          where the view swings north to the Puget Sound lowlands. Afternoon builds cloud over the
          summit the way it always does here; by two o&rsquo;clock the top three thousand feet of
          the mountain had vanished into a grey lid, and it was a good moment to start down.
        </p>
        <Figure
          src="/hikes/spray-park-ridge.svg"
          alt="Layered ridgelines at sunset with an orange sun low over dark blue slopes and a hazy sky"
          caption="Evening light from the knoll at the top of the meadows, the summit already under cloud."
        />
      </Prose>

      <Alert>
        <AlertTitle>Afternoon weather comes fast</AlertTitle>
        <AlertDescription>
          Rainier makes its own weather. Cloud builds over the summit almost every fair afternoon,
          and thunderstorms follow it in July and August. Start early, be off the high benches by
          early afternoon, and carry a shell even on a blue-sky morning.
        </AlertDescription>
      </Alert>

      <Prose>
        <h2>Spray Falls on the way down</h2>
        <p>
          The return leg drops through the trees to Spray Falls, an 80-foot cascade that most of the
          basin&rsquo;s meltwater funnels through. It is a short spur off the trail and worth every
          step: cold air, spray drifting onto the rocks, and the loudest silence-killer on the
          mountain. We were back at Mowich Lake by 5:30, shoes dusty, socks full of meadow seeds.
        </p>
        <Figure
          src="/hikes/spray-falls.svg"
          alt="A tall narrow waterfall dropping between dark forested walls into a pale green pool below"
          caption="Spray Falls, running hard on July meltwater."
        />
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
