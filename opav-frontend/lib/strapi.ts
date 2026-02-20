/* eslint-disable @typescript-eslint/no-explicit-any */
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

// Helper para convertir objetos anidados a query params de Strapi
function buildStrapiQuery(params: Record<string, any>): string {
  const queryParts: string[] = [];

  const buildNestedQuery = (obj: any, prefix: string = ""): void => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (value === null || value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            buildNestedQuery(item, `${fullKey}[${index}]`);
          } else {
            queryParts.push(
              `${fullKey}[${index}]=${encodeURIComponent(String(item))}`,
            );
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

export async function fetchAPI(path: string, options: FetchOptions = {}) {
  const { params, ...fetchOptions } = options;

  // Construir query params con soporte para objetos anidados
  const queryString = params ? buildStrapiQuery(params) : "";
  const url = `${STRAPI_API_URL}${path}${queryString ? `?${queryString}` : ""}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      // Revalidar cada 60 segundos en producción, sin caché en desarrollo
      next: {
        revalidate: process.env.NODE_ENV === "development" ? 0 : 60,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Strapi] Error fetching ${path}: ${response.statusText}`);
      return null;
    }

    return response.json();
  } catch (error) {
    // Durante build, CMS puede no estar disponible - retornar null en lugar de throw
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PHASE === "phase-production-build") {
      console.warn(`[Strapi] CMS not available during build for ${path}, returning null`);
      return null;
    }
    console.error(`[Strapi] Error fetching ${path}:`, error);
    return null;
  }
}

// Helper para obtener URL completa de imágenes con optimización
export function getStrapiMedia(
  media: any,
  format?: "thumbnail" | "small" | "medium" | "large",
): string | null {
  if (!media) return null;

  // Si es un string directo (URL)
  if (typeof media === "string") {
    if (media.startsWith("http")) return media;
    return `${STRAPI_URL}${media}`;
  }

  // Si es un objeto de Strapi v4
  let url = null;

  // Intentar usar formato optimizado si está disponible
  if (format && media?.formats?.[format]?.url) {
    url = media.formats[format].url;
  } else if (format && media?.attributes?.formats?.[format]?.url) {
    url = media.attributes.formats[format].url;
  } else {
    // Fallback a URL original
    url = media?.url || media?.attributes?.url;
  }

  if (!url) return null;

  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

// Funciones específicas
export async function getInmuebles(locale: string = "es") {
  const result = await fetchAPI("/inmuebles", {
    params: {
      locale,
      populate: "*",
    },
  });
  return result || { data: [] };
}

export async function getServicios(locale: string = "es") {
  const result = await fetchAPI("/servicios", {
    params: {
      locale,
      populate: "*",
    },
  });
  return result || { data: [] };
}

export async function getCertificaciones(locale: string = "es") {
  const result = await fetchAPI("/certificaciones", {
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
    next: { revalidate: 3600 }, // Cache por 1 hora
  });
  return result || { data: [] };
}

export async function getCasosExito(locale: string = "es") {
  const result = await fetchAPI("/casos-exito", {
    params: {
      locale,
      populate: "*",
    },
    next: { revalidate: 1800 }, // Cache por 30 minutos
  });
  return result || { data: [] };
}

// Obtener todos los casos de éxito con ubicación para el mapa
export async function getCasosExitoConUbicacion(locale: string = "es") {
  const result = await fetchAPI("/casos-exito", {
    params: {
      locale,
      populate: "imagenPrincipal",
      "pagination[pageSize]": 100,
    },
    next: { revalidate: 3600 }, // Cache por 1 hora
  });
  return result || { data: [] };
}

export async function getCasosExitoDestacados(locale: string = "es") {
  const result = await fetchAPI("/casos-exito", {
    params: {
      locale,
      populate: "*",
      "filters[destacado][$eq]": true,
      "pagination[limit]": 6,
      sort: "createdAt:desc",
    },
  });
  return result || { data: [] };
}

export async function getCasoExito(slug: string, locale: string = "es") {
  const result = await fetchAPI("/casos-exito", {
    params: {
      locale,
      populate: "*",
      "filters[Slug][$eq]": slug,
    },
  });
  return result || { data: [] };
}

// Obtener caso con sus localizaciones para cambio de idioma
export async function getCasoExitoWithLocalizations(
  slug: string,
  locale: string = "es",
) {
  const result = await fetchAPI("/casos-exito", {
    params: {
      locale,
      populate: "localizations",
      "filters[Slug][$eq]": slug,
    },
  });
  return result || { data: [] };
}

// Obtener caso por documentId (fallback)
export async function getCasoExitoByDocumentId(
  documentId: string,
  locale: string = "es",
) {
  const result = await fetchAPI("/casos-exito", {
    params: {
      locale,
      populate: "*",
      "filters[documentId][$eq]": documentId,
    },
  });
  return result || { data: [] };
}

// Obtener vacante con sus localizaciones para cambio de idioma
export async function getVacanteWithLocalizations(
  slug: string,
  locale: string = "es",
) {
  const result = await fetchAPI("/vacantes", {
    params: {
      locale,
      populate: "localizations",
      "filters[slug][$eq]": slug,
    },
  });
  return result || { data: [] };
}

// Obtener vacante por documentId (fallback)
export async function getVacanteByDocumentId(
  documentId: string,
  locale: string = "es",
) {
  const result = await fetchAPI("/vacantes", {
    params: {
      locale,
      populate: "*",
      "filters[documentId][$eq]": documentId,
    },
  });
  return result || { data: [] };
}

export async function createFormLead(data: any) {
  const result = await fetchAPI("/form-leads", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  return result || { data: null };
}

// Funciones para Vacantes
export async function getVacantes(locale: string = "es") {
  const result = await fetchAPI("/vacantes", {
    params: {
      locale,
      populate: "*",
      "filters[activa][$eq]": true,
      "filters[destacado][$eq]": true,
      "filters[publishedAt][$notNull]": true,
      sort: "createdAt:desc",
    },
  });
  return result || { data: [] };
}

export async function getVacante(slug: string, locale: string = "es") {
  const result = await fetchAPI("/vacantes", {
    params: {
      locale,
      populate: "*",
      "filters[slug][$eq]": slug,
      "filters[activa][$eq]": true,
      "filters[destacado][$eq]": true,
    },
  });
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
  const areas = [
    ...new Set(response.data.map((v: any) => v.area).filter(Boolean)),
  ];
  return areas.sort();
}

// ============================================
// FUNCIONES DEL BLOG
// ============================================

// Obtener posts destacados (featured) para el home
export async function getBlogPostsDestacados(locale: string = "es") {
  const result = await fetchAPI("/blog-posts", {
    params: {
      locale,
      "filters[isFeatured][$eq]": true,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[limit]": 6,
      sort: "fechaPublicacion:desc",
    },
  });
  return result || { data: [] };
}

// Obtener todos los posts con paginación
export async function getBlogPosts(
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
  categorySlug?: string,
) {
  const filters: any = {
    "filters[publishedAt][$notNull]": true,
  };

  if (categorySlug) {
    filters["filters[category][slug][$eq]"] = categorySlug;
  }

  const result = await fetchAPI("/blog-posts", {
    params: {
      locale,
      ...filters,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "fechaPublicacion:desc",
    },
  });
  return result || { data: [] };
}

// Obtener un post por slug
export async function getBlogPostBySlug(slug: string, locale: string = "es") {
  const response = await fetchAPI("/blog-posts", {
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
  });

  return response?.data?.[0] || null;
}

// Obtener posts relacionados (misma categoría, excluir el actual)
export async function getRelatedBlogPosts(
  categoryId: number,
  currentPostId: number,
  locale: string = "es",
  limit: number = 3,
) {
  const result = await fetchAPI("/blog-posts", {
    params: {
      locale,
      "filters[category][id][$eq]": categoryId,
      "filters[id][$ne]": currentPostId,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author"],
      "pagination[limit]": limit,
      sort: "fechaPublicacion:desc",
    },
  });
  return result || { data: [] };
}

// Obtener todas las categorías
export async function getBlogCategories(locale: string = "es") {
  const result = await fetchAPI("/blog-categories", {
    params: {
      locale,
      sort: "name:asc",
    },
  });
  return result || { data: [] };
}

// Obtener todas las tags
export async function getBlogTags() {
  const result = await fetchAPI("/blog-tags", {
    params: {
      sort: "name:asc",
    },
  });
  return result || { data: [] };
}

// Obtener posts por tag
export async function getBlogPostsByTag(
  tagSlug: string,
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
) {
  const result = await fetchAPI("/blog-posts", {
    params: {
      locale,
      "filters[tags][slug][$eq]": tagSlug,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "fechaPublicacion:desc",
    },
  });
  return result || { data: [] };
}

// Obtener posts por autor
export async function getBlogPostsByAuthor(
  authorId: number,
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
) {
  const result = await fetchAPI("/blog-posts", {
    params: {
      locale,
      "filters[author][id][$eq]": authorId,
      "filters[publishedAt][$notNull]": true,
      populate: ["imagenPrincipal", "category", "author", "tags"],
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort: "fechaPublicacion:desc",
    },
  });
  return result || { data: [] };
}

// Obtener configuración del blog
export async function getBlogSettings(locale: string = "es") {
  const result = await fetchAPI("/blog-setting", {
    params: {
      locale,
      populate: "defaultSeoImage",
    },
  });
  return result || { data: null };
}

// Búsqueda de posts
export async function searchBlogPosts(
  query: string,
  locale: string = "es",
  page: number = 1,
  pageSize: number = 12,
) {
  const result = await fetchAPI("/blog-posts", {
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
  });
  return result || { data: [] };
}
