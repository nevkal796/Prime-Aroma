/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Turbopack config (Next 16 default)
  turbopack: {
    // Alias Node-only image decoder `sharp` to a no-op stub in the browser
    resolveAlias: {
      sharp: { browser: "./sharp-browser-stub.js" },
    },
  },
  // Fallbacks for when you opt into webpack explicitly (e.g. `next dev --webpack`)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        child_process: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;

