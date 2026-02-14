"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2 } from "lucide-react";
import type { CasoExitoLocation, GroupedCases } from "@/lib/colombiaCities";
import { getStrapiMedia } from "@/lib/strapi";

interface ProjectsPanelProps {
  groupedCases: GroupedCases;
  selectedCity: string | null;
  selectedCompany: "all" | "OPAV" | "B&S";
  onCompanyFilter: (company: "all" | "OPAV" | "B&S") => void;
  locale: string;
  translations: {
    title: string;
    filterAll: string;
    noCitySelected: string;
    selectCity: string;
    projects: string;
    viewCase: string;
    totalArea: string;
    recentProject: string;
    yearCompleted: string;
  };
}

export default function ProjectsPanel({
  groupedCases,
  selectedCity,
  selectedCompany,
  onCompanyFilter,
  locale,
  translations,
}: ProjectsPanelProps) {
  const cities = Object.keys(groupedCases).sort();

  const getCityProjects = (city: string) => {
    const cityData = groupedCases[city];
    if (!cityData) return [];

    if (selectedCompany === "OPAV") return cityData.opav;
    if (selectedCompany === "B&S") return cityData.bys;
    return [...cityData.opav, ...cityData.bys];
  };

  const selectedCityProjects = selectedCity
    ? getCityProjects(selectedCity)
    : [];

  const getTotalCount = () => {
    return cities.reduce((total, city) => {
      return total + getCityProjects(city).length;
    }, 0);
  };

  // Calcular estadísticas de la ciudad seleccionada
  const getCityStats = () => {
    if (!selectedCity) return null;

    const projects = selectedCityProjects;
    const totalArea = projects.reduce((sum, project) => {
      const area = Number(project.area_construida || 0);
      return sum + area;
    }, 0);

    // Encontrar proyecto más reciente
    const recentProject = projects.reduce((recent, project) => {
      const currentYear = Number(project.ano_finalizacion || 0);
      const recentYear = Number(recent?.ano_finalizacion || 0);
      return currentYear > recentYear ? project : recent;
    }, projects[0]);

    return {
      totalArea,
      recentProject: recentProject?.nombre || "",
      recentYear: recentProject?.ano_finalizacion || "",
    };
  };

  const cityStats = getCityStats();

  return (
    <div className="flex flex-col bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .projects-fade-in,
          .projects-fade-up {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        .projects-fade-in {
          opacity: 0;
          animation: projectsFadeIn 220ms ease-out forwards;
        }

        .projects-fade-up {
          opacity: 0;
          transform: translate3d(0, 12px, 0);
          animation: projectsFadeUp 450ms ease-out forwards;
          will-change: opacity, transform;
        }

        @keyframes projectsFadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes projectsFadeUp {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>

      {/* Header con filtros */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-xl font-bold text-gray-900 flex items-center gap-1.5 md:gap-2 font-['Inter']">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              {selectedCity || translations.title}
            </span>
          </h3>
          <div className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
            {getTotalCount()} {translations.projects}
          </div>
        </div>

        {/* Filtros de empresa - Movidos arriba en la sección principal */}
      </div>

      {/* Lista de proyectos */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-h-[400px] md:max-h-[500px]">
        <div key={selectedCity ?? "no-city"} className="projects-fade-in">
          {!selectedCity ? (
            <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <p className="text-base md:text-lg font-semibold text-gray-900 mb-1.5 md:mb-2 font-['Inter']">
                {translations.noCitySelected}
              </p>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6 font-['Inter'] px-4">
                {translations.selectCity}
              </p>

              {/* Lista de ciudades disponibles */}
              <div className="w-full">
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {cities.map((city) => {
                    const count = getCityProjects(city).length;
                    if (count === 0) return null;

                    return (
                      <div
                        key={city}
                        className="bg-gradient-to-br from-gray-50 to-white p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 text-left hover:border-primary-300 hover:shadow-md transition-all cursor-pointer transform-gpu duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className="text-xs md:text-sm font-semibold text-gray-900 mb-0.5 md:mb-1 font-['Inter'] truncate">
                          {city}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-600 font-['Inter']">
                          {count} {count === 1 ? "proyecto" : "proyectos"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Filtros de empresa */}
              <div
                className="flex gap-2 mb-4"
                role="group"
                aria-label="Filtrar proyectos por empresa"
              >
                <button
                  onClick={() => onCompanyFilter("all")}
                  aria-pressed={selectedCompany === "all"}
                  className={`px-4 py-2 rounded-lg font-medium transition-all font-['Inter'] transform-gpu duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                    selectedCompany === "all"
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {translations.filterAll}
                </button>
                <button
                  onClick={() => onCompanyFilter("OPAV")}
                  aria-pressed={selectedCompany === "OPAV"}
                  className={`px-4 py-2 rounded-lg font-medium transition-all font-['Inter'] transform-gpu duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                    selectedCompany === "OPAV"
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  OPAV
                </button>
                <button
                  onClick={() => onCompanyFilter("B&S")}
                  aria-pressed={selectedCompany === "B&S"}
                  className={`px-4 py-2 rounded-lg font-medium transition-all font-['Inter'] transform-gpu duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                    selectedCompany === "B&S"
                      ? "bg-cyan-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  B&S
                </button>
              </div>

              {/* Estadísticas de la ciudad */}
              {cityStats && cityStats.recentYear && (
                <div className="projects-fade-up bg-gradient-to-br from-primary-50 to-cyan-50 rounded-xl p-4 mb-6 border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 mb-1 font-['Inter']">
                      {translations.recentProject}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 font-['Inter'] line-clamp-1">
                      {cityStats.recentProject}
                    </p>
                    <p className="text-xs text-gray-600 font-['Inter']">
                      {cityStats.recentYear}
                    </p>
                  </div>
                </div>
              )}

              {/* Grid de proyectos */}
              <div className="space-y-3">
                {selectedCityProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="projects-fade-up"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Link
                      href={`/${locale}/casos-exito/${project.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all transform-gpu duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01]">
                        {/* Imagen */}
                        {project.imagenPrincipal && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={
                                getStrapiMedia(
                                  project.imagenPrincipal,
                                  "medium",
                                ) || "/placeholder.jpg"
                              }
                              alt={
                                project.imagenPrincipal.alternativeText ||
                                project.nombre
                              }
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            {/* Overlay con empresa */}
                            <div className="absolute top-3 right-3">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-md font-['Inter'] ${
                                  project.empresa === "OPAV"
                                    ? "bg-primary-600"
                                    : "bg-cyan-600"
                                }`}
                              >
                                {project.empresa}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Contenido */}
                        <div className="p-4">
                          <h5 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors font-['Inter']">
                            {project.nombre}
                          </h5>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-['Inter']">
                              {project.ubicacion}
                            </span>
                          </div>

                          {project.descripcion && (
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2 font-['Inter']">
                              {project.descripcion}
                            </p>
                          )}

                          {/* Stats y CTA */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              {project.area_construida && (
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="w-4 h-4 text-cyan-600" />
                                  <span className="text-sm font-medium text-gray-700 font-['Inter']">
                                    {Number(
                                      project.area_construida,
                                    ).toLocaleString()}{" "}
                                    m²
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-primary-600 font-medium font-['Inter']">
                              {translations.viewCase} →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
