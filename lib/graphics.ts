/**
 * What the current browser can actually draw with.
 *
 * Measured in the browser this project is verified with (headless Chromium, no GPU):
 * WebGL 1 and WebGL 2 both work, through SwiftShader's software rasteriser — a real context
 * returning real pixels, roughly an order of magnitude slower than hardware. `navigator.gpu`
 * is absent, so WebGPU in the browser degrades there and a post must never require it.
 *
 * Every function here is safe to call during a server render: they return the pessimistic
 * answer (`"none"`, `false`) when there is no `window`, and the real one after hydration.
 */

export type GraphicsTier = "webgpu" | "webgl2" | "webgl" | "none";

/**
 * The order matters: this returns the best tier available, and a caller that only knows how to
 * use WebGL should ask `supportsWebGL()` instead of comparing against `"webgpu"`.
 */
export function detectGraphicsTier(): GraphicsTier {
  if (typeof window === "undefined") return "none";
  if (typeof navigator !== "undefined" && "gpu" in navigator) return "webgpu";
  if (hasContext("webgl2")) return "webgl2";
  if (hasContext("webgl")) return "webgl";
  return "none";
}

export function supportsWebGL(): boolean {
  const tier = detectGraphicsTier();
  return tier === "webgl2" || tier === "webgl" || (tier === "webgpu" && hasContext("webgl2"));
}

/**
 * Whether the reader has asked for stillness.
 *
 * Anything that moves on its own must consult this and settle into a meaningful static frame —
 * not freeze at frame zero, which for most simulations is an empty one.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A throwaway canvas rather than the real one: asking an element for a `"webgl"` context after it
 * has been given a `"webgl2"` one returns null, so probing the canvas you intend to draw into is
 * how detection ends up reporting failure on a canvas that works perfectly.
 */
function hasContext(kind: "webgl" | "webgl2"): boolean {
  try {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    return probe.getContext(kind) !== null;
  } catch {
    return false;
  }
}
