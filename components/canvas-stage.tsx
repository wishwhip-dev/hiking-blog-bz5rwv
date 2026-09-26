"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/graphics";

/**
 * The canvas host every drawn panel in a post should sit in.
 *
 * It exists because the five things that break a canvas panel are the same five every time, and
 * none of them are the thing the post is about: the context failing to exist, the backing store
 * not matching the element's size, device pixel ratio, the animation loop outliving the
 * component, and a reader who has asked for no motion. Those are handled here once.
 *
 * The rule it enforces is the important one. `fallback` renders on the server and stays on screen
 * until a context has actually been acquired, so a canvas that cannot draw is never a blank
 * rectangle — it is whatever you passed as the fallback. Make that something worth reading: a
 * pre-rendered still, a table of the same numbers, a described conclusion. The browser this
 * project is verified with has no GPU and is slow, but it does have WebGL, so the fallback is
 * insurance rather than the expected path.
 */

export type StageContext<T extends RenderingContext = RenderingContext> = {
  canvas: HTMLCanvasElement;
  /** The acquired context, of whichever `mode` was asked for. */
  ctx: T;
  /** CSS pixels — what layout and pointer coordinates are in. */
  width: number;
  height: number;
  /** Backing-store scale, capped at 2. `canvas.width === width * dpr`. */
  dpr: number;
  /** True when the reader has asked for reduced motion; draw one settled frame and stop. */
  reducedMotion: boolean;
};

export type StageRenderer = {
  /** Called once per animation frame with elapsed seconds. Omit it for a static drawing. */
  frame?: (elapsedSeconds: number) => void;
  /** Called after every resize, before the next frame. Re-create size-dependent resources here. */
  resize?: (width: number, height: number, dpr: number) => void;
  /** Release GPU resources here. Always called on unmount and on context loss. */
  dispose?: () => void;
};

type CanvasStageProps<T extends RenderingContext = RenderingContext> = {
  /**
   * Set up the drawing and return how to drive it. Runs once per acquired context — and again
   * after a context loss, so it must not close over anything it does not re-create.
   */
  start: (stage: StageContext<T>) => StageRenderer | void;
  /** Which context to acquire. Default `"webgl2"`. */
  mode?: "webgl2" | "webgl" | "2d";
  /** Shown on the server, and kept if no context can be acquired. Required, deliberately. */
  fallback: React.ReactNode;
  /** Describes the drawing for a reader who cannot see it. Required, deliberately. */
  label: string;
  /** Height as a fraction of width. Default 0.5625 (16:9). */
  aspect?: number;
  className?: string;
};

export function CanvasStage<T extends RenderingContext = RenderingContext>({
  start,
  mode = "webgl2",
  fallback,
  label,
  aspect = 0.5625,
  className,
}: CanvasStageProps<T>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef(start);
  const [live, setLive] = useState(false);

  // `start` is almost always an inline arrow function, so it is a new value on every render.
  // Keeping it in a ref is what stops the effect below from tearing down and re-creating the
  // whole GPU setup on every parent state change — which, for a panel driven by a slider, is
  // every drag event. `useRef(start)` already holds the first one, so the setup effect below
  // never sees a stale value even though this runs after it on mount.
  useEffect(() => {
    startRef.current = start;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext(mode, mode === "2d" ? undefined : { antialias: true }) as T | null;
    if (!ctx) return;

    const reducedMotion = prefersReducedMotion();
    let renderer: StageRenderer | void;
    let raf = 0;
    let disposed = false;
    const startedAt = performance.now();

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      return { dpr, width, height };
    };

    const applySize = () => {
      const { dpr, width, height } = measure();
      const backingWidth = Math.round(width * dpr);
      const backingHeight = Math.round(height * dpr);
      if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
        canvas.width = backingWidth;
        canvas.height = backingHeight;
      }
      renderer?.resize?.(width, height, dpr);
      // A static drawing has no loop to pick the new size up on its next tick, so it is redrawn
      // here. An animated one is about to draw anyway.
      if (!raf) renderer?.frame?.((performance.now() - startedAt) / 1000);
    };

    const { dpr, width, height } = measure();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    renderer = startRef.current({ canvas, ctx, width, height, dpr, reducedMotion });
    setLive(true);

    const observer = new ResizeObserver(applySize);
    observer.observe(canvas);

    // Reduced motion gets exactly one frame: the renderer was told, and is expected to have used
    // that to draw a settled state rather than the first instant of an animation.
    if (renderer?.frame && !reducedMotion) {
      const tick = () => {
        raf = requestAnimationFrame(tick);
        renderer?.frame?.((performance.now() - startedAt) / 1000);
      };
      raf = requestAnimationFrame(tick);
    } else {
      renderer?.frame?.(0);
    }

    // A lost context leaves a canvas that silently draws nothing. Falling back is the honest
    // response, and preventDefault is what allows the browser to offer a restore at all.
    const onLost = (event: Event) => {
      event.preventDefault();
      if (disposed) return;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      renderer?.dispose?.();
      renderer = undefined;
      setLive(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      observer.disconnect();
      renderer?.dispose?.();
      setLive(false);
    };
  }, [mode]);

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg border border-border bg-card", className)}
      style={{ aspectRatio: `1 / ${aspect}` }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className={cn("absolute inset-0 h-full w-full", live ? "opacity-100" : "opacity-0")}
      />
      {/* Kept mounted rather than swapped out: it is the accessible description of the drawing as
          well as the fallback, and unmounting it would leave a route whose only content is a
          canvas — which the verification browser reads as a page that rendered nothing. */}
      <div
        aria-hidden={live}
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground",
          live && "sr-only",
        )}
      >
        {fallback}
      </div>
    </div>
  );
}
