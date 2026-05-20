import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "play.google.com" },
    ],
  },
};

export default nextConfig;
