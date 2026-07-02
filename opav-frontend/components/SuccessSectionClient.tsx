"use client";

import Link from "next/link";
import { SuccessBrandFilterProvider } from "./SuccessBrandFilterContext";
import DynamicBrandLayer from "./DynamicBrandLayer";
import SuccessCasesFilter from "./SuccessCasesFilter";
import AnimatedSection from "./AnimatedSection";

interface SuccessCase {
  id: number;
  nombre: string;
  empresa: "OPAV" | "B&S";
  ubicacion: string;
  descripcion?: string;
  Slug: string;
  imagenPrincipal?: { url: string; alternativeText?: string };
}

interface Props {
  cases: SuccessCase[];
  locale: string;
  ctaHref: string;
  translations: {
    title: string;
    subtitle: string;
    filterOpav: string;
    opavDescription: string;
    filterBs: string;
    bsDescription: string;
    filterAll: string;
    viewAll: string;
    noResults: string;
  };
}

/**
 * Sección completa de Casos de Éxito como Client Component.
 *
 * Consolida SuccessBrandFilterProvider + DynamicBrandLayer + SuccessCasesFilter
 * en un único árbol de React de cliente, garantizando que el contexto
 * SuccessBrandFilterContext se propague correctamente entre el fondo
 * dinámico y el filtro de marca OPAV ⇄ B&S.
 *
 * Recibe todos los datos del Server Component (page.tsx) como props serializables.
 */
export default function SuccessSectionClient({
  cases,
  locale,
  ctaHref,
  translations,
}: Props) {
  return (
    <SuccessBrandFilterProvider>
      {/* Layer 1: Base blanca */}
      <div className="absolute inset-0 bg-white" />

      {/* Layer 2: Gradiente blanco → gris muy claro */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(165deg, #ffffff 0%, #f9fafb 100%)",
        }}
      />

      {/* Layer 3: Patrón geométrico ultra-sutil */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "url(/patterns/geometric-noise.png)",
          backgroundSize: "64px 64px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Layer 4: Nube de marca — magenta (OPAV) ⇄ cian (B&S)
          Directamente en el mismo árbol de React que el Provider,
          garantizando la propagación del contexto. */}
      <DynamicBrandLayer />

      {/* Contenido de la sección */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-10 sm:mb-14 lg:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 font-['Inter'] tracking-tight">
              {translations.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-['Inter'] font-light">
              {translations.subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Grid de casos */}
        <div className="max-w-7xl mx-auto">
          {cases.length > 0 ? (
            <>
              <SuccessCasesFilter
                cases={cases}
                locale={locale}
                translations={{
                  opavTitle: translations.filterOpav,
                  opavDescription: translations.opavDescription,
                  bsTitle: translations.filterBs,
                  bsDescription: translations.bsDescription,
                  all: translations.filterAll,
                }}
              />

              {/* CTA Button */}
              <div className="mt-16">
                <AnimatedSection delay={0.4}>
                  <div className="text-center">
                    <Link
                      href={ctaHref}
                      className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105 font-['Inter']"
                      style={{
                        background:
                          "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <span>{translations.viewAll}</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </AnimatedSection>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-['Inter']">
                {translations.noResults}
              </p>
            </div>
          )}
        </div>
      </div>
    </SuccessBrandFilterProvider>
  );
}
