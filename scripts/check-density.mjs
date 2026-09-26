/**
 * Fail the build when a post is an essay wearing a widget.
 *
 * This exists because saying it did not work. The briefing has told three different ways that a
 * post is an instrument, and across three posts written under successively more specific wording
 * the density went 1.9 paragraphs per control, then 0.8, then 1.5 — better than the start, but
 * drifting, and drifting is what prose guidance cannot stop. It sets a direction; a check holds a
 * line.
 *
 * The threshold is calibrated against real posts rather than chosen: one operable thing per 1.5
 * paragraphs is the line that separates the post the owner rejected as "too like a text blog"
 * (29 paragraphs, 15 controls — 1.9) from the two he accepted (17/22 = 0.8, and 25/17 = 1.5). A
 * looser rule would have passed the rejected one, which would make this check theatre.
 *
 * Count items, not containers. A <RadioGroup> is one tag but three things to click, and counting
 * only the wrapper is what made an earlier measurement report a collapse that had not happened.
 *
 * A post that genuinely should be mostly writing opts out in its own meta.json:
 *
 *   { "title": "...", "prose": true }
 *
 * That is a decision a task makes explicitly and can be seen in review — which is the point. The
 * escape hatch is not a loophole; it is the difference between a rule and a straitjacket.
 */

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MAX_PARAGRAPHS_PER_CONTROL = 1.5;

// The kit and the shared furniture are not the post. Counting them would let a post pass on the
// strength of components it did not write.
const SHARED = new Set(["prose.tsx", "post-header.tsx", "canvas-stage.tsx"]);

const CONTROL = /<(Slider|RadioGroup|RadioGroupItem|Switch|Checkbox|Select|Button|Toggle|ToggleGroup|ToggleGroupItem|Input|Tabs|TabsTrigger|AccordionTrigger|CollapsibleTrigger|DialogTrigger)[\s>]/g;
const PARAGRAPH = /<p[\s>]/g;

function collect(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== "ui") collect(full, out);
      continue;
    }
    if (!entry.endsWith(".tsx")) continue;
    if (SHARED.has(entry)) continue;
    out.push(full);
  }
  return out;
}

const postsDir = path.join(ROOT, "app/posts");
if (!existsSync(postsDir)) process.exit(0);

// A post owns its route directory and any components directory named for it. Everything else in
// components/ is counted once, against whichever post is the only one that is not opted out —
// which is the normal case here, since a task adds one post.
const slugs = readdirSync(postsDir).filter((d) => statSync(path.join(postsDir, d)).isDirectory());
const failures = [];

for (const slug of slugs) {
  const metaPath = path.join(postsDir, slug, "meta.json");
  let meta = {};
  try { meta = JSON.parse(readFileSync(metaPath, "utf8")); } catch { /* handled by the build */ }
  if (meta.prose === true) {
    console.log(`  ${slug}: prose post, skipped`);
    continue;
  }

  const files = [
    ...collect(path.join(postsDir, slug)),
    ...collect(path.join(ROOT, "components", slug)),
  ];
  // A post whose components sit directly in components/ rather than in a folder named for it:
  // fall back to any component file mentioning the slug, or imported by the route.
  if (files.length <= 1) {
    for (const f of collect(path.join(ROOT, "components"))) {
      const body = readFileSync(f, "utf8");
      if (body.includes(slug) || files.some((seen) => readFileSync(seen, "utf8").includes(path.basename(f, ".tsx")))) {
        files.push(f);
      }
    }
  }

  const source = files.map((f) => readFileSync(f, "utf8")).join("\n");
  const paragraphs = (source.match(PARAGRAPH) ?? []).length;
  const controls = (source.match(CONTROL) ?? []).length;
  const allowed = Math.ceil(paragraphs / MAX_PARAGRAPHS_PER_CONTROL);

  const verdict = controls >= allowed ? "ok" : "FAIL";
  console.log(`  ${slug}: ${paragraphs} paragraphs, ${controls} controls (needs ${allowed}) — ${verdict}`);
  if (verdict === "FAIL") failures.push({ slug, paragraphs, controls, allowed });
}

if (failures.length === 0) {
  console.log("post density ok");
  process.exit(0);
}

console.error("\nThis post reads as an essay, not an instrument.\n");
for (const f of failures) {
  console.error(
    `  ${f.slug}: ${f.paragraphs} paragraphs but only ${f.controls} things the reader can operate.\n` +
    `    Needs at least ${f.allowed}. Add controls, or turn what a paragraph asserts into something\n` +
    `    the reader sets: a Slider, a ToggleGroup, a RadioGroup, a Switch. Numbers the model computes\n` +
    `    belong in a live readout, not in a sentence.\n` +
    `    If this post is genuinely meant to be mostly writing, set "prose": true in its meta.json.\n`,
  );
}
process.exit(1);
