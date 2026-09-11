import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler slows every compile in dev — only enable for production builds
  reactCompiler: isProd,

  // Standalone only needed for Docker production images
  ...(isProd ? { output: "standalone" } : {}),

  // Fewer filesystem hits while developing on OneDrive
  poweredByHeader: false,

  images: {
    // Allow next/image to optimize localhost API images in local dev
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/**",
      },
    ],
  },

  // Keep turbopack rooted at client folder (avoids watching whole Desktop/OneDrive)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
