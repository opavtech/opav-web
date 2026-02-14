"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import JobCard from "./JobCard";
import { useDebounce } from "@/hooks/useDebounce";
import { AnimatePresence } from "framer-motion";

interface Vacante {
  id: number;
  titulo: string;
  descripcion: string;
  tipoContrato: string;
  salario?: string;
  ciudad: string;
  area: string;
  nivelEducativo?: string;
  fechaCierre?: string;
  activa: boolean;
  requisitos?: string;
  beneficios?: string;
  archivoDescripcion?: {
    url: string;
  };
  experienciaRequerida?: string;
  slug: string;
  empresa: string;
}

interface VacantesGridProps {
  vacantes: Vacante[];
  locale: string;
  translations: {
    filters: Record<string, string>;
    card: Record<string, string>;
    contractTypes: Record<string, string>;
    noJobs: Record<string, string>;
  };
}

export default function VacantesGrid({
  vacantes,
  locale,
  translations,
}: VacantesGridProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const cities = useMemo(() => {
    const uniqueCities = [
      ...new Set(vacantes.map((v) => v.ciudad).filter(Boolean)),
    ];
    return uniqueCities.sort();
  }, [vacantes]);

  const areas = useMemo(() => {
    const uniqueAreas = [
      ...new Set(vacantes.map((v) => v.area).filter(Boolean)),
    ];
    return uniqueAreas.sort();
  }, [vacantes]);

  const filteredVacantes = useMemo(() => {
    return vacantes.filter((job) => {
      if (debouncedSearchQuery.trim()) {
        const searchLower = debouncedSearchQuery.toLowerCase();
        const matchesTitle = job.titulo?.toLowerCase().includes(searchLower);
        const matchesDescription = job.descripcion
          ?.toLowerCase()
          .includes(searchLower);
        const matchesArea = job.area?.toLowerCase().includes(searchLower);

        if (!matchesTitle && !matchesDescription && !matchesArea) {
          return false;
        }
      }

      if (selectedCompany !== "all") {
        const isOPAV = job.empresa?.toLowerCase().includes("opav");
        if (selectedCompany === "opav" && !isOPAV) return false;
        if (selectedCompany === "bs" && isOPAV) return false;
      }

      if (selectedCity !== "all" && job.ciudad !== selectedCity) {
        return false;
      }

      if (selectedArea !== "all" && job.area !== selectedArea) {
        return false;
      }

      return true;
    });
  }, [
    vacantes,
    selectedCompany,
    selectedCity,
    selectedArea,
    debouncedSearchQuery,
  ]);

  const totalPages = Math.ceil(filteredVacantes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVacantes = filteredVacantes.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCompany, selectedCity, selectedArea, debouncedSearchQuery]);

  const clearFilters = useCallback(() => {
    setSelectedCompany("all");
    setSelectedCity("all");
    setSelectedArea("all");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      selectedCompany !== "all" ||
      selectedCity !== "all" ||
      selectedArea !== "all" ||
      searchQuery.trim() !== "",
    [selectedCompany, selectedCity, selectedArea, searchQuery]
  );

  return (
    <section className="py-16 bg-white" aria-labelledby="vacantes-grid-title">
      <div className="container mx-auto px-4">
        <h2 id="vacantes-grid-title" className="sr-only">
          {translations.filters.searchLabel}
        </h2>

        {/* Filtros */}
        <div
          className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-t-4"
          style={{ borderTopColor: "#d50058" }}
          role="search"
          aria-label={translations.filters.searchLabel}
        >
          <div className="mb-6">
            <label
              htmlFor="search-input"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {translations.filters.search}
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
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
              </div>
              <input
                id="search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translations.filters.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                aria-label={translations.filters.search}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="filter-company"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {translations.filters.all}
              </label>
              <select
                id="filter-company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                aria-label={
                  locale === "es" ? "Filtrar por empresa" : "Filter by company"
                }
              >
                <option value="all">{translations.filters.all}</option>
                <option value="opav">{translations.filters.opav}</option>
                <option value="bs">{translations.filters.bs}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-city"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {translations.filters.byCity}
              </label>
              <select
                id="filter-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                aria-label={
                  locale === "es" ? "Filtrar por ciudad" : "Filter by city"
                }
              >
                <option value="all">{translations.filters.all}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-area"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {translations.filters.byArea}
              </label>
              <select
                id="filter-area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                aria-label={
                  locale === "es" ? "Filtrar por área" : "Filter by area"
                }
              >
                <option value="all">{translations.filters.all}</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition flex items-center justify-center gap-2"
                  aria-label={translations.filters.clear}
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
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
                  {translations.filters.clear}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p
              className="text-sm text-gray-600"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {translations.filters.showing}{" "}
              <span className="font-bold text-gray-900">
                {filteredVacantes.length}
              </span>{" "}
              {translations.filters.results}
            </p>
          </div>
        </div>

        {filteredVacantes.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              role="list"
              aria-label={
                locale === "es"
                  ? "Lista de vacantes disponibles"
                  : "Available positions list"
              }
            >
              <AnimatePresence mode="wait">
                {paginatedVacantes.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    locale={locale}
                    index={index}
                    translations={translations.card}
                    contractTypes={translations.contractTypes}
                    priority={index < 3}
                  />
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-2"
                aria-label={
                  locale === "es" ? "Paginación de vacantes" : "Job pagination"
                }
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  aria-label={
                    locale === "es" ? "Página anterior" : "Previous page"
                  }
                >
                  {locale === "es" ? "← Anterior" : "← Previous"}
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          currentPage === page
                            ? "text-white shadow-lg"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        style={
                          currentPage === page
                            ? { backgroundColor: "#d50058" }
                            : {}
                        }
                        aria-label={`${
                          locale === "es" ? "Página" : "Page"
                        } ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  aria-label={
                    locale === "es" ? "Página siguiente" : "Next page"
                  }
                >
                  {locale === "es" ? "Siguiente →" : "Next →"}
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {translations.noJobs.title}
              </h3>
              <p className="text-gray-600 mb-8">
                {translations.noJobs.description}
              </p>
              <a
                href="#cta-section-title"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {locale === "es" ? "Enviar hoja de vida" : "Send resume"}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
