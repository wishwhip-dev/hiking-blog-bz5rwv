# Canvas and 3D

`three` is installed, and `@/components/canvas-stage` is the host every drawn panel should sit in.

```tsx
"use client";

import * as THREE from "three";
import { CanvasStage } from "@/components/canvas-stage";

<CanvasStage
  mode="webgl2"
  aspect={0.5}
  label="A cube rotating slowly against a plain background."
  fallback={<p>A cube, rotating.</p>}
  start={({ canvas, width, height, dpr, reducedMotion }) => {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 3;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
    scene.add(mesh);
    return {
      resize: (w, h) => { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); },
      frame: (t) => { if (!reducedMotion) mesh.rotation.set(t * 0.4, t * 0.6, 0); renderer.render(scene, camera); },
      dispose: () => renderer.dispose(),
    };
  }}
/>
```

The props that are not optional are not optional by design:

- **`start`** sets the drawing up and returns `{ frame?, resize?, dispose? }`. It runs once per
  acquired context — and **again after a context loss**, so it must not close over anything it
  does not re-create.
- **`label`** is the canvas's `aria-label`. A canvas is opaque to anything that cannot see it.
- **`fallback`** — see below.
- **`aspect`** sets the height as a fraction of the width (default `0.5625`, 16:9). Do not reach
  for `h-[320px]`: the stage sizes itself from this, and a fixed height fights it.

`CanvasStage` handles the five things that break a canvas every time and are never the point:
the context failing to exist, the backing store not matching the element's size, device pixel
ratio, an animation loop outliving the component, and a visitor who asked for no motion.

## What this browser can actually do

These were **measured in the verification browser** — headless Chromium, no GPU — not inferred
from flags.

| | |
| --- | --- |
| WebGL 1 and WebGL 2 | **work**, through SwiftShader's software rasteriser — real pixels, roughly an order of magnitude slower than hardware |
| `navigator.gpu` (WebGPU) | **absent**, under every flag combination tried |

So: **nothing on a page may require WebGPU.** `detectGraphicsTier()` can return `"webgpu"` on a
visitor's real machine, and a page that takes that branch and has no WebGL path renders nothing
where it is verified. Build the WebGL path first and treat WebGPU as an enhancement, or skip it.

Software rasterising is slow. Keep geometry small, prefer a few thousand triangles to a few
hundred thousand, and do not expect sixty frames a second.

## `fallback` is not decoration

It renders on the server and stays on screen until a context has actually been acquired, so a
canvas that cannot draw is never a blank rectangle. Make it something worth reading — the same
numbers as a list, a described conclusion, a still image. A blank box is how a canvas panel fails
verification while looking like it merely has nothing in it yet.

## Reduced motion

`reducedMotion` is passed into your renderer. When it is true, draw **one settled frame** and
stop — not frame zero, which for most simulations is empty. A visitor who asked for stillness
should still see the finished thing.

## Client component

Canvas work is client-side. The file needs `"use client"`, and `CanvasStage` already is one.

## Picking the medium

| Reach for | When the thing being shown is |
| --- | --- |
| `@/components/ui/chart` (Recharts) | a quantity against a dimension — series, distributions, comparisons |
| DOM/SVG, animated with Motion | discrete, labelled or clickable — states, small counts, diagrams |
| `CanvasStage` + `three` | continuous or spatial — fields, waves, 3D geometry, thousands of elements |

A chart is the right answer more often than a canvas is. Reach for this when the idea *is* spatial
or continuous, not to make a chart look more impressive.
