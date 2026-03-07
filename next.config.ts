import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/test-wisp",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
