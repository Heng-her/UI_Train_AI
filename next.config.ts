import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "truck-publishing-still-immune.trycloudflare.com",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media-cdn.tripadvisor.com",
      },
      {
        protocol: "https",
        hostname: "media.tacdn.com",
      },
      {
        protocol: "https",
        hostname: "res.klook.com",
      },
    ],
  },
};

export default nextConfig;
