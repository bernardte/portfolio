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
      },
      {
        protocol: "https",
        hostname: "bright-white-8zv92gdj.edgeone.dev"
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  }
};

export default nextConfig;
