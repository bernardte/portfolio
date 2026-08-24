import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "enchanting-azure-txnjdohk.edgeone.dev"
      },
      {
        protocol: "https",
        hostname: "potential-turquoise-549xxhxf.edgeone.dev"
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org"
      }
    ]
  }
};

export default nextConfig;
