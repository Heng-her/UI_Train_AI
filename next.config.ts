import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "nascar-theory-ease-alternate.trycloudflare.com",

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
