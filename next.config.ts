import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.prismic.io', // or whatever your image source is
    },
  ],
  },
  // You can keep other config options here
};

export default nextConfig;
