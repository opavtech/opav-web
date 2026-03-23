const isProd = process.env.NODE_ENV === "production";

function requireEnv(key: string, fallback: string): string {
  const value = process.env[key];
  if (!value) {
    if (isProd) throw new Error(`Missing required env var: ${key}`);
    return fallback;
  }
  return value;
}

export const SITE_URL = requireEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

export const STRAPI_URL = requireEnv("NEXT_PUBLIC_STRAPI_URL", "http://localhost:1337");

export const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || `${STRAPI_URL}/api`;
