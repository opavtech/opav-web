import { MetadataRoute } from "next";

// ─── Helpers ────────────────────────────────────────────────────────────────

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.opavsas.com"
).replace(/\/+$/, "");

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const LOCALES = ["es", "en"] as const;

/** Nombres de ruta localizados */
const STATIC_PAGES: Record<string, Record<string, string>> = {
  compania: { es: "company", en: "company" },
  servicios: { es: "services", en: "services" },
  cobertura: { es: "cobertura", en: "cobertura" },
  contacto: { es: "contact", en: "contact" },
  certificaciones: { es: "certificaciones", en: "certificaciones" },
  proveedores: { es: "proveedores", en: "proveedores" },
  "casos-exito": { es: "casos-exito", en: "casos-exito" },
  blog: { es: "blog", en: "blog" },
  vacantes: { es: "vacantes", en: "vacantes" },
};

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  url: string,
  opts?: { priority?: number; changeFrequency?: SitemapEntry["changeFrequency"]; lastModified?: Date }
): SitemapEntry {
  return {
    url,
    lastModified: opts?.lastModified ?? new Date(),
    changeFrequency: opts?.changeFrequency ?? "weekly",
    priority: opts?.priority ?? 0.8,
  };
}

/**
 * Fetch con timeout y tolerancia a fallo.
 * Retorna `null` si falla — nunca lanza excepción.
 */
async function safeFetch<T = unknown>(
  url: string,
  timeoutMs = 8_000
): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[sitemap] fetch ${url} responded ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[sitemap] fetch failed for ${url}:`, (err as Error).message);
    return null;
  }
}

// ─── CAPA 1: Rutas estáticas (nunca dependen del CMS) ──────────────────────

function buildStaticRoutes(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Raíz por idioma: /es  /en
  for (const locale of LOCALES) {
    routes.push(entry(`${BASE_URL}/${locale}`, { priority: 1, changeFrequency: "monthly" }));
  }

  // Páginas estáticas en cada idioma
  for (const [, paths] of Object.entries(STATIC_PAGES)) {
    for (const locale of LOCALES) {
      routes.push(entry(`${BASE_URL}/${locale}/${paths[locale]}`));
    }
  }

  return routes;
}

// ─── CAPA 2: Rutas dinámicas con tolerancia a fallo ─────────────────────────

interface StrapiItem {
  documentId: string;
  slug?: string;
  Slug?: string;
  updatedAt?: string;
  fechaPublicacion?: string;
}

interface StrapiResponse {
  data: StrapiItem[] | null;
}

async function buildDynamicRoutes(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  try {
    // Fetch todos los endpoints en paralelo
    const [casosES, casosEN, blogES, blogEN] = await Promise.all([
      safeFetch<StrapiResponse>(
        `${STRAPI_URL}/api/casos-de-exito?locale=es&pagination[limit]=100&fields[0]=Slug&fields[1]=updatedAt&fields[2]=documentId`
      ),
      safeFetch<StrapiResponse>(
        `${STRAPI_URL}/api/casos-de-exito?locale=en&pagination[limit]=100&fields[0]=Slug&fields[1]=updatedAt&fields[2]=documentId`
      ),
      safeFetch<StrapiResponse>(
        `${STRAPI_URL}/api/blog-posts?locale=es&pagination[limit]=100&fields[0]=slug&fields[1]=updatedAt&fields[2]=fechaPublicacion&fields[3]=documentId`
      ),
      safeFetch<StrapiResponse>(
        `${STRAPI_URL}/api/blog-posts?locale=en&pagination[limit]=100&fields[0]=slug&fields[1]=updatedAt&fields[2]=fechaPublicacion&fields[3]=documentId`
      ),
    ]);

    // ── Casos de éxito ──
    buildLocalizedEntries(
      casosES?.data,
      casosEN?.data,
      (item) => item.Slug,
      "casos-exito",
      routes
    );

    // ── Blog posts ──
    buildLocalizedEntries(
      blogES?.data,
      blogEN?.data,
      (item) => item.slug,
      "blog",
      routes
    );
  } catch (err) {
    console.warn("[sitemap] Error fetching dynamic routes, returning static-only:", (err as Error).message);
  }

  return routes;
}

function buildLocalizedEntries(
  itemsES: StrapiItem[] | null | undefined,
  itemsEN: StrapiItem[] | null | undefined,
  getSlug: (item: StrapiItem) => string | undefined,
  basePath: string,
  routes: MetadataRoute.Sitemap
): void {
  const byDocId = new Map<string, { es?: StrapiItem; en?: StrapiItem }>();

  for (const item of itemsES ?? []) {
    if (!byDocId.has(item.documentId)) byDocId.set(item.documentId, {});
    byDocId.get(item.documentId)!.es = item;
  }
  for (const item of itemsEN ?? []) {
    if (!byDocId.has(item.documentId)) byDocId.set(item.documentId, {});
    byDocId.get(item.documentId)!.en = item;
  }

  byDocId.forEach((variants) => {
    const esSlug = variants.es ? getSlug(variants.es) : undefined;
    const enSlug = variants.en ? getSlug(variants.en) : undefined;
    const updated = variants.es?.updatedAt || variants.en?.updatedAt;
    const lastMod = updated ? new Date(updated) : new Date();

    if (esSlug) {
      routes.push(entry(`${BASE_URL}/es/${basePath}/${esSlug}`, {
        priority: 0.7,
        changeFrequency: "monthly",
        lastModified: lastMod,
      }));
    }
    if (enSlug) {
      routes.push(entry(`${BASE_URL}/en/${basePath}/${enSlug}`, {
        priority: 0.7,
        changeFrequency: "monthly",
        lastModified: lastMod,
      }));
    }
  });
}

// ─── CAPA 3: Construcción final SEO-correcta ────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = buildStaticRoutes();
  const dynamicRoutes = await buildDynamicRoutes();

  return [...staticRoutes, ...dynamicRoutes];
}
