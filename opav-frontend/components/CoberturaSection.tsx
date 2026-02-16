"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Globe, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ProjectsPanel from "@/components/ProjectsPanel";
import AnimatedCounter from "@/components/AnimatedCounter";
import type { CasoExitoLocation, GroupedCases } from "@/lib/colombiaCities";

// Importar el mapa de forma dinámica para evitar problemas de SSR
const OSMColombiaMap = dynamic(() => import("@/components/OSMColombiaMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full min-h-[350px] md:min-h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Cargando mapa...</span>
      </div>
    </div>
  ),
});

interface CoberturaSectionProps {
  cases: unknown[];
  locale: string;
}

interface CoberturaAnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function CoberturaAnimatedSection({
  children,
  delay = 0,
  className = "",
}: CoberturaAnimatedSectionProps) {
  return (
    <div className={`cobertura-fade-up ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children as any}
    </div>
  );
}

export default function CoberturaSection({
  cases,
  locale,
}: CoberturaSectionProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<
    "all" | "OPAV" | "B&S"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Transformar y agrupar los datos
  const { casosConUbicacion, groupedCases } = useMemo(() => {
    const casosConUbicacion: CasoExitoLocation[] = (cases as any[])
      .filter((caso) => Boolean(caso?.ubicacion || caso?.attributes?.ubicacion))
      .map((caso) => ({
        id: caso.id,
        nombre: caso.nombre || caso.attributes?.nombre,
        ubicacion: caso.ubicacion || caso.attributes?.ubicacion,
        empresa: (caso.empresa || caso.attributes?.empresa) as "OPAV" | "B&S",
        slug: caso.Slug || caso.attributes?.Slug,
        area_construida:
          caso.area_construida || caso.attributes?.area_construida,
        ano_finalizacion:
          caso.ano_finalizacion || caso.attributes?.ano_finalizacion,
        descripcion: caso.descripcion || caso.attributes?.descripcion,
        imagenPrincipal: caso.imagenPrincipal?.data
          ? {
              url: caso.imagenPrincipal.data.attributes.url,
              alternativeText:
                caso.imagenPrincipal.data.attributes.alternativeText,
            }
          : caso.attributes?.imagenPrincipal?.data
            ? {
                url: caso.attributes.imagenPrincipal.data.attributes.url,
                alternativeText:
                  caso.attributes.imagenPrincipal.data.attributes
                    .alternativeText,
              }
            : undefined,
      }));

    const grouped: GroupedCases = {};
    casosConUbicacion.forEach((caso) => {
      const city = caso.ubicacion;
      if (!grouped[city]) {
        grouped[city] = { opav: [], bys: [] };
      }

      if (caso.empresa === "OPAV") {
        grouped[city].opav.push(caso);
      } else {
        grouped[city].bys.push(caso);
      }
    });

    return { casosConUbicacion, groupedCases: grouped };
  }, [cases]);

  // Filtrar casos por búsqueda
  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return casosConUbicacion;

    const query = searchQuery.toLowerCase();
    return casosConUbicacion.filter(
      (caso) =>
        caso.nombre?.toLowerCase().includes(query) ||
        caso.ubicacion?.toLowerCase().includes(query),
    );
  }, [casosConUbicacion, searchQuery]);

  // Reagrupar casos filtrados
  const filteredGroupedCases = useMemo(() => {
    const grouped: GroupedCases = {};
    filteredCases.forEach((caso) => {
      const city = caso.ubicacion;
      if (!grouped[city]) {
        grouped[city] = { opav: [], bys: [] };
      }

      if (caso.empresa === "OPAV") {
        grouped[city].opav.push(caso);
      } else {
        grouped[city].bys.push(caso);
      }
    });
    return grouped;
  }, [filteredCases]);

  // Estadísticas
  const stats = useMemo(() => {
    const cities = Object.keys(groupedCases).length;
    const opavCount = casosConUbicacion.filter(
      (c) => c.empresa === "OPAV",
    ).length;
    const bysCount = casosConUbicacion.filter(
      (c) => c.empresa === "B&S",
    ).length;

    return { cities, opavCount, bysCount, total: opavCount + bysCount };
  }, [groupedCases, casosConUbicacion]);

  const translations = {
    title:
      locale === "es" ? "Nuestra Cobertura Nacional" : "Our National Coverage",
    subtitle:
      locale === "es"
        ? "Presencia estratégica en las principales ciudades de Colombia"
        : "Strategic presence in Colombia's main cities",
    description:
      locale === "es"
        ? "Descubre dónde hemos llevado nuestros proyectos de excelencia. Cada punto en el mapa representa historias de éxito y transformación."
        : "Discover where we've delivered our excellence projects. Each point on the map represents success stories and transformation.",
    filterTitle: locale === "es" ? "Filtrar por empresa" : "Filter by company",
    filterAll: locale === "es" ? "Todas" : "All",
    noCitySelected: locale === "es" ? "Selecciona una ciudad" : "Select a city",
    selectCity:
      locale === "es"
        ? "Haz clic en un punto del mapa para ver los proyectos"
        : "Click on a map point to view projects",
    projects: locale === "es" ? "proyectos" : "projects",
    viewCase: locale === "es" ? "Ver caso" : "View case",
    statsCities: locale === "es" ? "Ciudades" : "Cities",
    statsProjects: locale === "es" ? "Proyectos" : "Projects",
    searchPlaceholder:
      locale === "es"
        ? "Buscar por proyecto o ciudad..."
        : "Search by project or city...",
    totalArea: locale === "es" ? "Total construido" : "Total built",
    recentProject: locale === "es" ? "Proyecto reciente" : "Recent project",
    yearCompleted: locale === "es" ? "Año" : "Year",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .cobertura-fade-up {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        .cobertura-fade-up {
          opacity: 0;
          transform: translate3d(0, 16px, 0);
          animation: coberturaFadeUp 600ms ease-out forwards;
          will-change: opacity, transform;
        }

        @keyframes coberturaFadeUp {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
        <div className="container mx-auto px-4 py-12 md:py-24">
          {/* Header */}
          <CoberturaAnimatedSection className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary-50 border border-primary-200 rounded-full mb-4 md:mb-6">
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600" />
              <span className="text-primary-700 font-semibold text-xs md:text-sm">
                {translations.subtitle}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900 font-['Inter']">
              {translations.title}
            </h1>

            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-['Inter'] px-2">
              {translations.description}
            </p>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-6 md:mt-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              <AnimatedCounter
                value={stats.cities}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
              />
              <div className="text-gray-600 text-xs md:text-sm font-medium">
                {translations.statsCities}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              <AnimatedCounter
                value={stats.opavCount}
                className="text-2xl md:text-3xl font-bold text-[#d50058] mb-1"
              />
              <div className="text-gray-600 text-xs md:text-sm font-medium">
                OPAV
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              <AnimatedCounter
                value={stats.bysCount}
                className="text-2xl md:text-3xl font-bold text-[#00acc8] mb-1"
              />
              <div className="text-gray-600 text-xs md:text-sm font-medium">
                B&S
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AnimatedCounter
                  value={stats.total}
                  className="text-2xl md:text-3xl font-bold text-gray-900"
                />
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-medium">
                {translations.statsProjects}
              </div>
            </div>
            </div>
          </CoberturaAnimatedSection>

          {/* Barra de búsqueda */}
          <CoberturaAnimatedSection className="mb-6 md:mb-8">
            <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translations.searchPlaceholder}
                aria-label={
                  locale === "es"
                    ? "Buscar proyectos por nombre o ciudad"
                    : "Search projects by name or city"
                }
                className="w-full px-4 md:px-5 py-2.5 md:py-3 pl-10 md:pl-12 bg-white border-2 border-gray-200 rounded-full text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all shadow-sm font-['Inter']"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    locale === "es" ? "Limpiar búsqueda" : "Clear search"
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            </div>
          </CoberturaAnimatedSection>

          {/* Filtros de empresa */}
          <CoberturaAnimatedSection className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0">
              {translations.filterTitle}:
            </span>
            <div
              className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full"
              role="group"
              aria-label={
                locale === "es" ? "Filtrar por empresa" : "Filter by company"
              }
            >
              <button
                onClick={() => setSelectedCompany("all")}
                aria-pressed={selectedCompany === "all"}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCompany === "all"
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {translations.filterAll}
              </button>
              <button
                onClick={() => setSelectedCompany("OPAV")}
                aria-pressed={selectedCompany === "OPAV"}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCompany === "OPAV"
                    ? "bg-[#d50058] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#d50058]/30"
                }`}
              >
                OPAV
              </button>
              <button
                onClick={() => setSelectedCompany("B&S")}
                aria-pressed={selectedCompany === "B&S"}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCompany === "B&S"
                    ? "bg-[#00acc8] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#00acc8]/30"
                }`}
              >
                B&S
              </button>
            </div>
          </div>
          </CoberturaAnimatedSection>

          {/* Mapa centrado */}
          <CoberturaAnimatedSection>
            <div className="flex flex-col items-center gap-8">
            {/* Mapa */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 overflow-hidden w-full max-w-5xl mx-auto h-[350px] md:h-[600px]">
              <OSMColombiaMap
                cases={filteredCases}
                selectedCity={selectedCity}
                onCitySelect={setSelectedCity}
                selectedCompany={selectedCompany}
                locale={locale}
              />
            </div>

            {/* Panel de proyectos */}
            <div className="w-full max-w-5xl mx-auto">
              <ProjectsPanel
                groupedCases={filteredGroupedCases}
                selectedCity={selectedCity}
                selectedCompany={selectedCompany}
                onCompanyFilter={setSelectedCompany}
                locale={locale}
                translations={translations}
              />
            </div>
            </div>
          </CoberturaAnimatedSection>
        </div>

      {/* Call to Action - Fuera del container para ocupar todo el ancho */}
      <section
        className="relative py-12 md:py-24 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #d50058 0%, #a0003d 50%, #d50058 100%)",
        }}
        aria-labelledby="cobertura-cta-section-title"
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 2px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        {/* Glow effects */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[600px] h-[200px] md:h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Línea decorativa superior */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-8">
              <div className="h-px w-8 md:w-12 bg-white/30" />
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/50" />
              <div className="h-px w-8 md:w-12 bg-white/30" />
            </div>

            <h2
              id="cobertura-cta-section-title"
              className="text-2xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6 font-['Inter'] tracking-tight leading-tight"
            >
              {locale === "es"
                ? "¿Tienes un proyecto en mente?"
                : "Have a project in mind?"}
            </h2>
            <p className="text-sm md:text-xl mb-6 md:mb-10 text-white/90 font-light leading-relaxed px-2">
              {locale === "es"
                ? "Únete a las empresas que confían en nuestra experiencia. Llevamos excelencia a cualquier rincón de Colombia."
                : "Join the companies that trust our expertise. We deliver excellence anywhere in Colombia."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-white text-[#d50058] px-6 md:px-10 py-3 md:py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-sm md:text-lg font-['Inter'] group"
              aria-label={
                locale === "es"
                  ? "Contactar para iniciar tu proyecto"
                  : "Contact to start your project"
              }
            >
              <span>{locale === "es" ? "Contáctanos" : "Contact Us"}</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
