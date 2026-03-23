import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

// Bundle Analyzer (solo se activa con ANALYZE=true)
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 100],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "opavsas.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "opav-web-production.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/la-compania", destination: "/es/compania", permanent: true },
      { source: "/clientes", destination: "/es/casos-exito", permanent: true },
      { source: "/modelos-de-gestion", destination: "/es/compania", permanent: true },
      { source: "/facility-managemnet", destination: "/es/compania", permanent: true },
      { source: "/facility-management", destination: "/es/compania", permanent: true },
      { source: "/gestion-de-instalaciones-corporativas", destination: "/es/servicios", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
