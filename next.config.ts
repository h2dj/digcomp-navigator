import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  // Dev only: allow 127.0.0.1 when the dev server starts on localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
