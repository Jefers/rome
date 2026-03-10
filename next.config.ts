import type { NextConfig } from "next";

const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : 'standalone',
  basePath: isGithubPages ? '/rome' : '',
  trailingSlash: true,
  images: {
    unoptimized: isGithubPages,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint configuration removed - use separate eslint config file
  reactStrictMode: false,
};

export default nextConfig;
