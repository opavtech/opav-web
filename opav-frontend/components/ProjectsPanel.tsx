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
    project: string;
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

  // Si hay ciudad seleccionada, mostrar solo sus proyectos; si no, mostrar todos
  const displayedProjects: CasoExitoLocation[] = selectedCity
    ? getCityProjects(selectedCity)
    : cities.flatMap((city) => getCityProjects(city));

  const getTotalCount = () => displayedProjects.length;

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
          to { opacity: 1; }
        }

        @keyframes projectsFadeUp {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>

      {/* Header con filtros fijos */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-xl font-bold text-gray-900 flex items-center gap-1.5 md:gap-2 font-['Inter']">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              {selectedCity ?? translations.title}
            </span>
          </h3>
          <div className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
            {getTotalCount()} {translations.projects}
          </div>
        </div>

        {/* Filtros de empresa — siempre visibles */}
        <div
          className="flex gap-2"
          role="group"
          aria-label="Filtrar proyectos por empresa"
        >
          <button
            onClick={() => onCompanyFilter("all")}
            aria-pressed={selectedCompany === "all"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all font-['Inter'] transform-gpu duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all font-['Inter'] transform-gpu duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
              selectedCompany === "OPAV"
                ? "bg-[#d50058] text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            OPAV
          </button>
          <button
            onClick={() => onCompanyFilter("B&S")}
            aria-pressed={selectedCompany === "B&S"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all font-['Inter'] transform-gpu duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
              selectedCompany === "B&S"
                ? "bg-cyan-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            B&S
          </button>
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-h-[400px] md:max-h-[500px]">
        <div key={`${selectedCity ?? "all"}-${selectedCompany}`} className="projects-fade-in">
          {displayedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MapPin className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-['Inter']">
                {locale === "es"
                  ? "No hay proyectos para este filtro"
                  : "No projects for this filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="projects-fade-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <Link
                    href={`/${locale}/casos-exito/${project.slug}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all transform-gpu duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01]">
                      {project.imagenPrincipal && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={
                              getStrapiMedia(project.imagenPrincipal, "medium") ||
                              "/placeholder.jpg"
                            }
                            alt={
                              project.imagenPrincipal.alternativeText ||
                              project.nombre
                            }
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
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

                      <div className="p-4">
                        <h5 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors font-['Inter']">
                          {project.nombre}
                        </h5>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-['Inter']">{project.ubicacion}</span>
                        </div>

                        {project.descripcion && (
                          <p className="text-sm text-gray-700 mb-4 line-clamp-2 font-['Inter']">
                            {project.descripcion}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            {project.area_construida && (
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-cyan-600" />
                                <span className="text-sm font-medium text-gray-700 font-['Inter']">
                                  {Number(project.area_construida).toLocaleString()} m²
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
          )}
        </div>
      </div>
    </div>
  );
}
