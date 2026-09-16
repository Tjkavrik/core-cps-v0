import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standalone output makes the app portable / container-friendly.
  output: "standalone",
  // Allow the shared database package to be transpiled from the monorepo.
  transpilePackages: ["@core-cps/database"],
};

export default nextConfig;
