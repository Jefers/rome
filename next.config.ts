import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  //basePath: '/rome',
  //assetPrefix: '/rome/',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;