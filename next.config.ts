import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "https://learn.smktelkom-mlg.sch.id/bank_sampah/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
