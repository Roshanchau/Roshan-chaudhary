/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";
import createMDX from '@next/mdx'
 import withExportImages from "next-export-optimize-images";

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = withExportImages({
  output: "export",
    // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  reactStrictMode: true,
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "www.svgrepo.com",
        protocol: "https",
      },
      {
        hostname: "docs.pmnd.rs",
        protocol: "https",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
    ],
  },
});
 
const withMDX = createMDX({
  // Add markdown plugins here, as desired
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)