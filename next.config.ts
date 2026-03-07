import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wisp-blog",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
