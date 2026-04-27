import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudflareusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
    ],
  },
};

export default withMDX(nextConfig);
