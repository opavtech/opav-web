/* eslint-disable @typescript-eslint/no-explicit-any */
import { STRAPI_URL, STRAPI_API_URL } from "./config";

// Cache matrix por tipo de contenido
const REVALIDATE = {
  navigation: 300,   // 5 min — home blocks, nav
  listing: 300,      // 5 min — blog listing, casos, servicios
  detail: 600,       // 10 min — blog detail, caso detail
  static: 3600,      // 1 hora — certificaciones, páginas corporativas
} as const;

// Helper para convertir objetos anidados a query params de Strapi
function buildStrapiQuery(params: Record<string, any>): string {
  const queryParts: string[] = [];

  const buildNestedQuery = (obj: any, prefix: string = ""): void => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            buildNestedQuery(item, `${fullKey}[${index}]`);
          } else {
            queryParts.push(`${fullKey}[${index}]=${encodeURIComponent(String(item))}`);
          }
        });
      } else if (typeof value === "object" && value !== null) {
        buildNestedQuery(value, fullKey);
      } else {
        queryParts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
      }
    });
  };

  buildNestedQuery(params);
  return queryParts.join("&");
}

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export async function fetchFromStrapi<T = any>(
  path: string,
  options: FetchOptions = {},
  revalidate: number = REVALIDATE.listing,
): Promise<T | null> {
  const { params, ...fetchOptions } = options;
  const queryString = params ? buildStrapiQuery(params) : "";
  const url = `${STRAPI_API_URL}${path}${queryString ? `?${queryString}` : ""}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      next: {
        revalidate: process.env.NODE_ENV === "development" ? 0 : revalidate,
      },
    });

    clearTimeout(timeoutId);

    if (res.status === 404) return null;

    if (res.status === 403) {
      console.error(`[Strapi] 403 Forbidden on ${path} — check Strapi permissions`);
      return null;
    }

    if (!res.ok) {
      console.error(`[Strapi] ${res.status} on ${path}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`[Strapi] Network error on ${path}`, error);
    return null;
  }
}

// Alias para compatibilidad con código existente
export const fetchAPI = fetchFromStrapi;

// Helper para obtener URL completa de imágenes con optimización
export function getStrapiMedia(
  media: any,
  format?: "thumbnail" | "small" | "medium" | "large",
): string | null {
  if (!media) return null;

  if (typeof media === "string") {
    if (media.startsWith("http")) return media;
    return `${STRAPI_URL}${media}`;
  }

  let url = null;

  if (format && media?.formats?.[format]?.url) {
    url = media.formats[format].url;
  } else if (format && media?.attributes?.formats?.[format]?.url) {
    url = media.attributes.formats[format].url;
  } else {
    url = media?.url || media?.attributes?.url;
  }

  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

// ============================================
// SERVICIOS
// ============================================

export async function getServicios(locale: string = "es") {
  const result = await fetchFromStrapi("/servicios", {
    params: {
      locale,
      populate: "*",
    },
  }, REVALIDATE.static);
  return result || { data: [] };
}

// ============================================
// CERTIFICACIONES
// ============================================

export async function getCertificaciones(locale: string = "es") {
  const result = await fetchFromStrapi("/certificaciones", {
    params: {
      locale,
      "populate[logo][fields][0]": "url",
      "populate[logo][fields][1]": "formats",
      "populate[logo][fields][2]": "alternativeText",
      "fields[0]": "nombre",
      "fields[1]": "descripcion",
      "fields[2]": "fechaEmision",
      "fields[3]": "fechaVencimiento",
      "fields[4]": "vigente",
      "fields[5]": "entidadEmisora",
      "fields[6]": "destacado",
      "fields[7]": "queAporta",
    },
  }, REVALIDATE.static);
  return result || { data: [] };
}

// ============================================
// CASOS DE ÉXITO
// ============================================

export async function getCasosExito(locale: string = "es") {
  const result = await fetchFromStrapi("/casos-exito", {
    params: {
      locale,
      populate: "*",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}

export async function getCasosExitoConUbicacion(locale: string = "es") {
  const result = await fetchFromStrapi("/casos-exito", {
    params: {
      locale,
      "populate[imagenPrincipal][fields][0]": "url",
      "populate[imagenPrincipal][fields][1]": "formats",
      "populate[imagenPrincipal][fields][2]": "alternativeText",
      "fields[0]": "titulo",
      "fields[1]": "Slug",
      "fields[2]": "cliente",
      "fields[3]": "ciudad",
      "fields[4]": "pais",
      "fields[5]": "latitud",
      "fields[6]": "longitud",
      "pagination[pageSize]": 100,
    },
  }, REVALIDATE.static);
  return result || { data: [] };
}

export async function getCasosExitoDestacados(locale: string = "es") {
  const result = await fetchFromStrapi("/casos-exito", {
    params: {
      locale,
      populate: "*",
      "filters[destacado][$eq]": true,
      "pagination[limit]": 6,
      sort: "createdAt:desc",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}

export async function getCasoExito(slug: string, locale: string = "es") {
  const result = await fetchFromStrapi("/casos-exito", {
    params: {
      locale,
      populate: "*",
      "filters[Slug][$eq]": slug,
    },
  }, REVALIDATE.detail);
  return result || { data: [] };
}

export async function getCasoExitoWithLocalizations(slug: string, locale: string = "es") {
  const result = await fetchFromStrapi("/casos-exito", {
    params: {
      locale,
      populate: "localizations",
      "filters[Slug][$eq]": slug,
    },
  }, REVALIDATE.detail);
  return result || { data: [] };
}

export async function getCasoExitoByDocumentId(documentId: string, locale: string = "es") {
  const result = await fetchFromStrapi("/casos-exito", {
    params: {
      locale,
      "populate[imagenPrincipal][fields][0]": "url",
      "populate[imagenPrincipal][fields][1]": "formats",
      "populate[imagenPrincipal][fields][2]": "alternativeText",
      "filters[documentId][$eq]": documentId,
    },
  }, REVALIDATE.detail);
  return result || { data: [] };
}

// ============================================
// VACANTES
// ============================================

export async function getVacantes(locale: string = "es") {
  const result = await fetchFromStrapi("/vacantes", {
    params: {
      locale,
      populate: "*",
      "filters[activa][$eq]": true,
      "filters[destacado][$eq]": true,
      "filters[publishedAt][$notNull]": true,
      sort: "createdAt:desc",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}

export async function getVacante(slug: string, locale: string = "es") {
  const result = await fetchFromStrapi("/vacantes", {
    params: {
      locale,
      populate: "*",
      "filters[slug][$eq]": slug,
      "filters[activa][$eq]": true,
      "filters[destacado][$eq]": true,
    },
  }, REVALIDATE.detail);
  return result || { data: [] };
}

export async function getVacanteWithLocalizations(slug: string, locale: string = "es") {
  const result = await fetchFromStrapi("/vacantes", {
    params: {
      locale,
      populate: "localizations",
      "filters[slug][$eq]": slug,
    },
  }, REVALIDATE.detail);
  return result || { data: [] };
}

export async function getVacanteByDocumentId(documentId: string, locale: string = "es") {
  const result = await fetchFromStrapi("/vacantes", {
    params: {
      locale,
      populate: "*",
      "filters[documentId][$eq]": documentId,
    },
  }, REVALIDATE.detail);
  return result || { data: [] };
}

export async function getCiudadesVacantes(locale: string = "es") {
  const response = await getVacantes(locale);
  if (!response?.data) return [];
  const ciudades = [...new Set(response.data.map((v: any) => v.ciudad))];
  return ciudades.sort();
}

export async function getAreasVacantes(locale: string = "es") {
  const response = await getVacantes(locale);
  if (!response?.data) return [];
  const areas = [...new Set(response.data.map((v: any) => v.area).filter(Boolean))];
  return areas.sort();
}

export async function createFormLead(data: any) {
  const result = await fetchFromStrapi("/form-leads", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  return result || { data: null };
}

// ============================================
// BLOG
// ============================================

export async function getBlogPostsDestacados(locale: string = "es") {
  const result = await fetchFromStrapi("/blog-posts", {
    params: {
      locale,
      "filters[isFeatured][$eq]": true,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[limit]": 6,
      sort: "fechaPublicacion:desc",
    },
  }, REVALIDATE.navigation);
  return result || { data: [] };
}

export async function getBlogPosts(
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
  categorySlug?: string,
) {
  const filters: any = { "filters[publishedAt][$notNull]": true };
  if (categorySlug) filters["filters[category][slug][$eq]"] = categorySlug;

  const result = await fetchFromStrapi("/blog-posts", {
    params: {
      locale,
      ...filters,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "fechaPublicacion:desc",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}

export async function getBlogPostBySlug(slug: string, locale: string = "es") {
  const response = await fetchFromStrapi("/blog-posts", {
    params: {
      locale,
      "filters[slug][$eq]": slug,
      "filters[publishedAt][$notNull]": true,
      populate: [
        "imagenPrincipal",
        "imagenesContenido",
        "category",
        "author",
        "author.avatar",
        "tags",
        "openGraphImage",
      ],
    },
  }, REVALIDATE.detail);
  return response?.data?.[0] || null;
}

export async function getRelatedBlogPosts(
  categoryId: number,
  currentPostId: number,
  locale: string = "es",
  limit: number = 3,
) {
  const result = await fetchFromStrapi("/blog-posts", {
    params: {
      locale,
      "filters[category][id][$eq]": categoryId,
      "filters[id][$ne]": currentPostId,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author"],
      "pagination[limit]": limit,
      sort: "fechaPublicacion:desc",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}

export async function getBlogCategories(locale: string = "es") {
  const result = await fetchFromStrapi("/blog-categories", {
    params: { locale, sort: "name:asc" },
  }, REVALIDATE.static);
  return result || { data: [] };
}

export async function getBlogTags() {
  const result = await fetchFromStrapi("/blog-tags", {
    params: { sort: "name:asc" },
  }, REVALIDATE.static);
  return result || { data: [] };
}

export async function getBlogPostsByTag(
  tagSlug: string,
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
) {
  const result = await fetchFromStrapi("/blog-posts", {
    params: {
      locale,
      "filters[tags][slug][$eq]": tagSlug,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "fechaPublicacion:desc",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}

export async function getBlogPostsByAuthor(
  authorId: number,
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
) {
  const result = await fetchFromStrapi("/blog-posts", {
    params: {
      locale,
      "filters[author][id][$eq]": authorId,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "fechaPublicacion:desc",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}

export async function getBlogSettings(locale: string = "es") {
  const result = await fetchFromStrapi("/blog-setting", {
    params: { locale, populate: "defaultSeoImage" },
  }, REVALIDATE.static);
  return result || { data: null };
}

export async function searchBlogPosts(
  query: string,
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
) {
  const result = await fetchFromStrapi("/blog-posts", {
    params: {
      locale,
      "filters[$or][0][titulo][$containsi]": query,
      "filters[$or][1][resumen][$containsi]": query,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "fechaPublicacion:desc",
    },
  }, REVALIDATE.listing);
  return result || { data: [] };
}
