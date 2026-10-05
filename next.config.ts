import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Wisp covers can be SVG. Next serves them as-is (no resizing); the CSP
    // blocks scripts inside the file and "attachment" stops it opening as a page.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.wisp.blog" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
