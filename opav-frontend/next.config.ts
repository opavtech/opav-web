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
  eslint: {
    ignoreDuringBuilds: true,
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
        hostname: "opav.com.co",
        pathname: "/uploads/**",
      },
    ],
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
  async rewrites() {
    return [
      // URLs en ESPAÑOL apuntan a carpetas en INGLÉS
      {
        source: "/es/compania",
        destination: "/es/company",
      },
      {
        source: "/es/compania/:path*",
        destination: "/es/company/:path*",
      },
      {
        source: "/es/servicios",
        destination: "/es/services",
      },
      {
        source: "/es/servicios/:path*",
        destination: "/es/services/:path*",
      },
      {
        source: "/es/contacto",
        destination: "/es/contact",
      },
      {
        source: "/es/contacto/:path*",
        destination: "/es/contact/:path*",
      },

      // URLs en INGLÉS apuntan a carpetas en ESPAÑOL
      {
        source: "/en/success-cases",
        destination: "/en/casos-exito",
      },
      {
        source: "/en/success-cases/:path*",
        destination: "/en/casos-exito/:path*",
      },
      {
        source: "/en/certifications",
        destination: "/en/certificaciones",
      },
      {
        source: "/en/certifications/:path*",
        destination: "/en/certificaciones/:path*",
      },
      {
        source: "/en/jobs",
        destination: "/en/vacantes",
      },
      {
        source: "/en/jobs/:path*",
        destination: "/en/vacantes/:path*",
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
