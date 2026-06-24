import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js 16 dev server defaults to localhost; allow 127.0.0.1 for HMR and dev assets.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
