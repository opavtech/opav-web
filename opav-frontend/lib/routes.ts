/**
 * Centralized routing configuration for localized URLs
 * This ensures URLs are correctly translated based on the current locale
 */

export const routes = {
  // Home
  home: {
    es: '/',
    en: '/',
  },

  // Company
  company: {
    es: '/compania',
    en: '/company',
  },

  // Services
  services: {
    es: '/servicios',
    en: '/services',
  },

  // Success Cases / Casos de Éxito
  successCases: {
    es: '/casos-exito',
    en: '/success-cases',
  },

  // Certifications / Certificaciones
  certifications: {
    es: '/certificaciones',
    en: '/certifications',
  },

  // Jobs / Vacantes
  jobs: {
    es: '/vacantes',
    en: '/jobs',
  },

  // Contact
  contact: {
    es: '/contacto',
    en: '/contact',
  },

  // Blog
  blog: {
    es: '/blog',
    en: '/blog',
  },

  // Coverage / Cobertura
  coverage: {
    es: '/cobertura',
    en: '/coverage',
  },

  // Providers / Proveedores
  providers: {
    es: '/proveedores',
    en: '/providers',
  },
} as const;

/**
 * Get the localized path for a given route
 * @param route - The route key from the routes object
 * @param locale - The current locale ('es' or 'en')
 * @returns The localized path with the locale prefix
 */
export function getLocalizedPath(
  route: keyof typeof routes,
  locale: 'es' | 'en' = 'es'
): string {
  const path = routes[route][locale];
  return `/${locale}${path}`;
}

/**
 * Get the localized path without locale prefix
 * Useful for rewrites and internal routing
 */
export function getPathWithoutLocale(
  route: keyof typeof routes,
  locale: 'es' | 'en' = 'es'
): string {
  return routes[route][locale];
}
