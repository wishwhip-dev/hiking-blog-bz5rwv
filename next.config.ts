import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The illustrations are local SVGs in `public/` — hand-written here, not remote content.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
};

export default nextConfig;
