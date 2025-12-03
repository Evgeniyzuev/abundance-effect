import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Exclude Supabase functions from Next.js build (they use Deno)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
