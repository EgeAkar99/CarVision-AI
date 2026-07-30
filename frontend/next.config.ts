import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i0.shbdn.com",
      },
      {
        protocol: "https",
        hostname: "i1.shbdn.com",
      },
      {
        protocol: "https",
        hostname: "i2.shbdn.com",
      },
      {
        protocol: "https",
        hostname: "i3.shbdn.com",
      },
      {
        protocol: "https",
        hostname: "i4.shbdn.com",
      },
      {
        protocol: "https",
        hostname: "i5.shbdn.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;