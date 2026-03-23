export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.opavsas.com";

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || `${STRAPI_URL}/api`;
