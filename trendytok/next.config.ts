import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pages that use runtime env vars (Supabase) must be dynamic
  experimental: {},
};

export default nextConfig;
