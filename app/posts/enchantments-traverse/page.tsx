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

const SLUG = "enchantments-traverse";

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
          The Enchantments are what happens when a glacier grinds a valley and then leaves: eight
          linked lakes under granite spires, strung between two passes that make you earn every one
          of them. We walked it north to south, from the Snow Lakes trailhead over Aasgard, over two
          days in late September — deliberately late, because the larches turn that week and the
          summer crowds are gone.
        </p>
      </Prose>

      <Alert>
        <AlertTitle>The permit lottery is the hardest part</AlertTitle>
        <AlertDescription>
          Every campsite in the core zone is lottery-allocated in March, and the core fills months
          ahead. If you strike out, day-hiking from the Stuart Lake side to Colchuck Lake needs no
          permit, and a late-October snow-dust version of that out-and-back is its own reward.
        </AlertDescription>
      </Alert>

      <Prose>
        <h2>Aasgard Pass</h2>
        <p>
          Aasgard is the price of admission and it is a brutal one: 1,900 feet of talus in something
          under a mile, cairn to cairn, no switchbacks to soften it. We cached water at the lake
          below and started the climb at first light. By the top the only sounds were boots on
          rock and our own breathing, and the pass itself was a notch of wind between Dragontail and
          Little Annapurna.
        </p>
        <Figure
          src="/hikes/aasgard-pass.svg"
          alt="Steep granite pass between snow-dusted peaks under a pale morning sky, with talus slopes falling away below"
          caption="The last pitch of Aasgard Pass, just after sunrise."
        />
      </Prose>

      <div className="max-w-[var(--measure)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trail facts</TableHead>
              <TableHead className="text-right">Snow Lakes to Stuart Lake</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Distance</TableCell>
              <TableCell className="text-right">31 km (19 mi)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Elevation gain</TableCell>
              <TableCell className="text-right">2,050 m (6,700 ft)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Time on trail</TableCell>
              <TableCell className="text-right">2 days, one night at Perfection Lake</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Difficulty</TableCell>
              <TableCell className="text-right">Strenuous — class 2 talus on Aasgard</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Best season</TableCell>
              <TableCell className="text-right">Mid-July to mid-October</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Prose>
        <h2>The lake country</h2>
        <p>
          Then the traverse stops being a climb and becomes a stroll through the most improbable
          real estate in the state: Perfection, Leprechaun, Sprite, each lake bluer and more
          improbable than the last, goats standing on rocks like they were placed there. We camped
          at Perfection and watched the alpenglow march down Prusik Peak with dinner in hand.
        </p>
        <Figure
          src="/hikes/upper-enchantments-lake.svg"
          alt="A deep blue alpine lake ringed by granite slopes and dark evergreens, with a snow-capped peak reflected in still water"
          caption="Perfection Lake at the end of the first evening."
        />
        <p>
          In the morning we crossed a frost-stiffened meadow, hopped a small creek, and let the
          basin hand us over lake by lake toward the outlet. Nothing about the miles is hard; it is
          the altitude and the pack that slow you, and the scenery that keeps you stopping anyway.
        </p>
      </Prose>

      <Prose>
        <h2>The larches turn</h2>
        <p>
          The lower Enchantments are guarded by alpine larches, deciduous conifers that burn gold
          for roughly ten days at the end of September. We hit the front edge of it. Against black
          granite and blue water the color is almost artificial, and every gust let go a slow
          snowfall of needles. This is why you take the late-season lottery dates when they are
          offered.
        </p>
        <Figure
          src="/hikes/larches-gold.svg"
          alt="Golden larch trees along a dark valley floor with layered mountain ridges behind at dusk"
          caption="Golden larches below the outlet lakes on the second morning."
        />
      </Prose>

      <Prose>
        <h2>Down the long staircase</h2>
        <p>
          From Isolation Lake the trail drops through Snow Lakes&rsquo; country in a long,
          knee-punishing descent of switchbacks and granite steps. The walk out along Icicle Creek
          is hot and dusty and a little melancholy, the way the last hour of a good trip always is.
          Thirteen hours after leaving camp we were eating gas-station burritos in Leavenworth,
          still arguing about which lake was bluest.
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
