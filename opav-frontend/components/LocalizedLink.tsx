"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { routeTranslations, type RouteKey, type Locale } from "@/lib/routeTranslations";
import { ComponentProps } from "react";

interface LocalizedLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: RouteKey | `/${string}`;
  children: React.ReactNode;
}

/**
 * Componente Link que automáticamente traduce las rutas según el locale activo
 *
 * @example
 * <LocalizedLink href="company">Ir a Compañía</LocalizedLink>
 * // En español: /es/compania
 * // En inglés: /en/company
 */
export default function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
  const locale = useLocale() as Locale;

  // Si href es una ruta absoluta (comienza con /), usarla tal cual
  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  // Si href es una RouteKey, traducirla
  const routeKey = href as RouteKey;
  const translatedRoute = routeTranslations[routeKey]?.[locale];

  if (!translatedRoute) {
    console.warn(`No translation found for route: ${href} in locale: ${locale}`);
    return (
      <Link href={`/${locale}/${href}`} {...props}>
        {children}
      </Link>
    );
  }

  const localizedHref = `/${locale}/${translatedRoute}`;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}

/**
 * Hook para obtener una ruta localizada programáticamente
 */
export function useLocalizedRoute(route: RouteKey): string {
  const locale = useLocale() as Locale;
  const translatedRoute = routeTranslations[route]?.[locale];

  if (!translatedRoute) {
    console.warn(`No translation found for route: ${route} in locale: ${locale}`);
    return `/${locale}/${route}`;
  }

  return `/${locale}/${translatedRoute}`;
}
