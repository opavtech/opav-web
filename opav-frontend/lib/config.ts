function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (fallback) return fallback;
  throw new Error(`Missing required env var: ${name}`);
}

export const SITE_URL = requiredEnv(
  "NEXT_PUBLIC_SITE_URL",
  "https://www.opavsas.com"
);

export const STRAPI_URL = requiredEnv(
  "NEXT_PUBLIC_STRAPI_URL",
  "https://cms.opavsas.com"
);
export const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.trim() || `${STRAPI_URL}/api`;
