/**
 * Configuración de traducciones de rutas para URLs localizadas
 * Mapea slugs en español e inglés a la misma ruta interna
 */

export type Locale = "es" | "en";

export const routeTranslations = {
  company: {
    es: "compania",
    en: "company",
  },
  services: {
    es: "servicios",
    en: "services",
  },
  contact: {
    es: "contacto",
    en: "contact",
  },
  blog: {
    es: "blog",
    en: "blog",
  },
  "casos-exito": {
    es: "casos-exito",
    en: "success-cases",
  },
  certificaciones: {
    es: "certificaciones",
    en: "certifications",
  },
  vacantes: {
    es: "vacantes",
    en: "jobs",
  },
  cobertura: {
    es: "cobertura",
    en: "coverage",
  },
  proveedores: {
    es: "proveedores",
    en: "providers",
  },
} as const;

export type RouteKey = keyof typeof routeTranslations;

/**
 * Obtiene la ruta traducida para un locale específico
 */
export function getLocalizedRoute(route: RouteKey, locale: Locale): string {
  return routeTranslations[route][locale];
}

/**
 * Obtiene la clave de ruta a partir de un slug localizado
 */
export function getRouteKeyFromSlug(
  slug: string,
  locale: Locale,
): RouteKey | null {
  const entry = Object.entries(routeTranslations).find(
    ([_, translations]) => translations[locale] === slug,
  );
  return entry ? (entry[0] as RouteKey) : null;
}

/**
 * Mapeo inverso: de slug localizado a ruta canónica (nombre de carpeta)
 */
export const slugToCanonical: Record<string, RouteKey> = {
  // Español
  compania: "company",
  servicios: "services",
  contacto: "contact",
  blog: "blog",
  "casos-exito": "casos-exito",
  certificaciones: "certificaciones",
  vacantes: "vacantes",

  // Inglés
  company: "company",
  services: "services",
  contact: "contact",
  "success-cases": "casos-exito",
  certifications: "certificaciones",
  jobs: "vacantes",
};
