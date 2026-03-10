import type { NextConfig } from "next";

const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : 'standalone',
  basePath: isGithubPages ? '/rome' : '',
  images: {
    unoptimized: isGithubPages, // Required for static export
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
