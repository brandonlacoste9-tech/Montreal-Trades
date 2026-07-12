import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack root so Windows monorepo inference doesn't break
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
