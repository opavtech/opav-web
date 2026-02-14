"use client";

import { usePathname } from "next/navigation";
import { locales } from "@/i18n";
import {
  routeTranslations,
  slugToCanonical,
  type Locale,
} from "@/lib/routeTranslations";
import {
  getCasoExitoWithLocalizations,
  getVacanteWithLocalizations,
} from "@/lib/strapi";
import { useState } from "react";

interface LanguageSwitcherProps {
  currentLocale: string;
}

type CasoExitoLocalization = {
  locale: string;
  Slug?: string;
};

type CasoExitoWithLocalizations = {
  localizations?: CasoExitoLocalization[];
  documentId?: string;
};

type VacanteLocalization = {
  locale: string;
  slug?: string;
};

type VacanteWithLocalizations = {
  localizations?: VacanteLocalization[];
  documentId?: string;
};

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const switchLanguage = async (newLocale: Locale) => {
    if (isLoading) return;

    // Remover el prefijo de idioma actual
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

    // Obtener segmentos de la ruta
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    if (segments.length === 0) {
      // Si estamos en la home, forzar recarga completa
      window.location.href = `/${newLocale}`;
      return;
    }

    // Detectar si estamos en una página de caso de éxito individual
    const isCasoExitoPage =
      segments[0] === "casos-exito" && segments.length === 2;

    if (isCasoExitoPage) {
      const currentSlug = segments[1];
      setIsLoading(true);

      try {
        // Intentar obtener el caso con sus localizaciones
        const response = await getCasoExitoWithLocalizations(
          currentSlug,
          currentLocale,
        );
        const caso = response.data?.[0] as CasoExitoWithLocalizations | undefined;

        if (caso) {
          // Buscar la localización en el nuevo idioma
          const localization = caso.localizations?.find(
            (loc) => loc.locale === newLocale,
          );

          if (localization?.Slug) {
            // Éxito: Usar el slug traducido y forzar recarga
            window.location.href = `/${newLocale}/casos-exito/${localization.Slug}`;
            return;
          } else if (caso.documentId) {
            // Fallback: Usar documentId y forzar recarga
            window.location.href = `/${newLocale}/casos-exito/${caso.documentId}`;
            return;
          }
        }
      } catch (error) {
        console.error("Error switching language for caso de éxito:", error);
      }

      setIsLoading(false);
      // Si todo falla, intentar con el mismo slug y forzar recarga
      window.location.href = `/${newLocale}/casos-exito/${currentSlug}`;
      return;
    }

    // Detectar si estamos en una página de vacante individual
    const isVacantePage = segments[0] === "vacantes" && segments.length === 2;

    if (isVacantePage) {
      const currentSlug = segments[1];
      setIsLoading(true);

      try {
        // Intentar obtener la vacante con sus localizaciones
        const response = await getVacanteWithLocalizations(
          currentSlug,
          currentLocale,
        );
        const vacante =
          response.data?.[0] as VacanteWithLocalizations | undefined;

        if (vacante) {
          // Buscar la localización en el nuevo idioma
          const localization = vacante.localizations?.find(
            (loc) => loc.locale === newLocale,
          );

          if (localization?.slug) {
            // Éxito: Usar el slug traducido y forzar recarga
            window.location.href = `/${newLocale}/vacantes/${localization.slug}`;
            return;
          } else if (vacante.documentId) {
            // Fallback: Usar documentId y forzar recarga
            window.location.href = `/${newLocale}/vacantes/${vacante.documentId}`;
            return;
          }
        }
      } catch (error) {
        console.error("Error switching language for vacante:", error);
      }

      setIsLoading(false);
      // Si todo falla, intentar con el mismo slug y forzar recarga
      window.location.href = `/${newLocale}/vacantes/${currentSlug}`;
      return;
    }

    // Para el resto de rutas, usar la lógica existente
    const currentSlug = segments[0];
    const canonicalRoute = slugToCanonical[currentSlug];

    if (canonicalRoute) {
      const translatedSlug =
        routeTranslations[canonicalRoute][newLocale as Locale];
      const restOfPath = segments.slice(1).join("/");
      const newPath = `/${newLocale}/${translatedSlug}${
        restOfPath ? "/" + restOfPath : ""
      }`;
      window.location.href = newPath;
    } else {
      const newPathname = pathname.replace(
        `/${currentLocale}`,
        `/${newLocale}`,
      );
      window.location.href = newPathname;
    }
  };

  return (
    <div className="relative inline-flex items-center bg-gray-100 rounded-lg p-1 shadow-inner">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLanguage(locale)}
          disabled={isLoading}
          className={`relative z-10 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
            currentLocale === locale
              ? "text-white"
              : "text-gray-600 hover:text-[#d50058]"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}

      {/* Fondo deslizante animado */}
      <div
        className="absolute top-1 bottom-1 left-1 bg-[#d50058] rounded-md transition-transform duration-300 ease-out shadow-md"
        style={{
          width: `calc(50% - 4px)`,
          transform: `translateX(${
            currentLocale === "es" ? "0" : "calc(100% + 4px)"
          })`,
        }}
      />

      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="w-4 h-4 border-2 border-[#d50058] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
