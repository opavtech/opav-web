/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Resuelve la URL de un media de Strapi/Cloudinary.
 * Safe para usar en client components — no importa variables de entorno de servidor.
 */
export function getStrapiMedia(
  media: any,
  format?: "thumbnail" | "small" | "medium" | "large",
): string | null {
  if (!media) return null;

  if (typeof media === "string") return media;

  const url =
    (format && media?.formats?.[format]?.url) ||
    (format && media?.attributes?.formats?.[format]?.url) ||
    media?.url ||
    media?.attributes?.url;

  return url || null;
}
