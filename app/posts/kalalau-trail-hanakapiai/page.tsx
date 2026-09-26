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

const SLUG = "kalalau-trail-hanakapiai";

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
          February is not the obvious season for Kauai&rsquo;s north shore, but the Kalalau Trail
          does not care about your calendar — it is open, muddy, and spectacular in every month
          that has a letter in it. The leg to Hanakāpīʻai Falls is the piece most people do, and
          after walking it I understand why: it packs sea cliffs, jungle, a river crossing and a
          300-foot waterfall into a day that starts and ends at a beach.
        </p>
      </Prose>

      <Prose>
        <h2>The sea cliffs at Hōʻolea</h2>
        <p>
          The first two miles are the famous part: a dirt shelf cut into the cliffside, dropping
          away in places straight down to the surf. It was dry enough to feel solid underfoot, but
          you walk it with your eyes half on the trail and half on the water two hundred feet below.
          Every headland opens a new window down the Nā Pali coast, ridge after folded green ridge
          marching into haze.
        </p>
        <Figure
          src="/hikes/kalalau-coast.svg"
          alt="Steep green ridges of a tropical coastline descending into a deep blue sea, with a pale sand beach and small breaking waves"
          caption="The Nā Pali coast from the high point above Hōʻolea Valley."
        />
      </Prose>

      <div className="max-w-[var(--measure)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trail facts</TableHead>
              <TableHead className="text-right">To Hanakāpīʻai Falls and back</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Distance</TableCell>
              <TableCell className="text-right">11.3 km (7 mi)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Elevation gain</TableCell>
              <TableCell className="text-right">460 m (1,500 ft)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Time on trail</TableCell>
              <TableCell className="text-right">6 h 30 min, including the falls</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Difficulty</TableCell>
              <TableCell className="text-right">Moderate — mud and exposure, not altitude</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Best season</TableCell>
              <TableCell className="text-right">May to September for drier trail; February for solitude</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Alert>
        <AlertTitle>Crossings and flash floods</AlertTitle>
        <AlertDescription>
          Hanakāpīʻai Stream must be crossed twice, and winter rain can raise it from ankle-deep to
          impassable in minutes. If the water is brown, fast, or above your knees, wait or turn
          back — the falls will still be there next week. Never camp below the high-water line.
        </AlertDescription>
      </Alert>

      <Prose>
        <h2>Hanakāpīʻai Stream</h2>
        <p>
          The stream crossing at the beach is where the day sorts itself out. Ours was knee-deep
          and clear, running strong after Thursday&rsquo;s rain, and we crossed in sandals with
          boots in hand, watching a pair of nene graze the far bank. Beyond the beach the trail
          turns upward into dense guava and bamboo, and the character changes completely: wet,
          green, dripping, with the sound of the falls arriving before you see anything.
        </p>
        <Figure
          src="/hikes/hanakapiai-stream.svg"
          alt="A wide shallow jungle river flowing over rocks between dense green banks, with stepping-stone lines across the current"
          caption="Hanakāpīʻai Stream, thigh-deep and clear, just upstream of the beach crossing."
        />
      </Prose>

      <Prose>
        <h2>The falls</h2>
        <p>
          Then the valley simply opens like a theatre: a sheer basalt wall, a ribbon of water
          falling three hundred feet into a cold pool, ferns hanging from every crack. We swam
          briefly — the water is snowmelt-cold even in winter — and ate lunch on a rock with the
          spray coming off the falls like slow rain. The walk back is faster, muddier, and quieter;
          the beach at the end with shoes off was the right full stop.
        </p>
        <Figure
          src="/hikes/hanakapiai-falls.svg"
          alt="A tall slender waterfall plunging down a sheer green jungle cliff into a wide misty pool below"
          caption="Hanakāpīʻai Falls in full winter flow."
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
