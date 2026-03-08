import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gxhrpxuhqyiyzfbgraig.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
