import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "myanimelist.net",
        pathname: "**",
      },
      // Note: Jikan API sometimes serves images from their CDN too.
      // It's a good idea to add it just in case!
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
