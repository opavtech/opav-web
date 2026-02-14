"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getStrapiMedia } from "@/lib/strapi";
import Link from "next/link";
import Image from "next/image";

interface CasoExito {
  id: number;
  nombre: string;
  descripcion: string;
  empresa: "OPAV" | "B&S";
  ubicacion: string;
  Slug: string;
  destacado: boolean;
  imagenPrincipal?: any;
}

interface CasosExitoGridProps {
  casosExito: CasoExito[];
  casosOPAV: CasoExito[];
  casosBS: CasoExito[];
  locale: string;
  translations: {
    all: string;
    opav: string;
    bs: string;
    results: string;
    loadMore: string;
  };
}

type FilterType = "ALL" | "OPAV" | "B&S";

export default function CasosExitoGrid({
  casosExito,
  casosOPAV,
  casosBS,
  locale,
  translations,
}: CasosExitoGridProps) {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  // Determine initial filter from URL params
  const getInitialFilter = (): FilterType => {
    if (filterParam === "OPAV") return "OPAV";
    if (filterParam === "B&S") return "B&S";
    return "ALL";
  };

  const [activeFilter, setActiveFilter] = useState<FilterType>(
    getInitialFilter()
  );

  // Update filter when URL params change
  useEffect(() => {
    const newFilter = getInitialFilter();
    setActiveFilter(newFilter);
  }, [filterParam]);

  // Filtrar casos según selección
  const getFilteredCases = () => {
    switch (activeFilter) {
      case "OPAV":
        return casosOPAV;
      case "B&S":
        return casosBS;
      default:
        return casosExito;
    }
  };

  const filteredCases = getFilteredCases();

  return (
    <div className="w-full">
      {/* Filter Tabs - Enhanced Design */}
      <div className="flex flex-col items-center justify-center mb-12 md:mb-16 gap-6">
        {/* Filter Buttons */}
        <div
          className="inline-flex gap-2 p-1.5 bg-gray-50 rounded-full border border-gray-100"
          role="group"
          aria-label="Filtros de casos de éxito"
        >
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`relative px-6 py-2.5 text-sm font-light transition-all duration-300 rounded-full font-['Inter'] ${
              activeFilter === "ALL"
                ? "text-white bg-gradient-to-r from-gray-900 to-gray-700 shadow-md"
                : "text-gray-500 hover:text-gray-900 hover:bg-white"
            }`}
            aria-pressed={activeFilter === "ALL"}
            aria-label={`Mostrar todos los casos (${casosExito.length})`}
          >
            <span className="flex items-center gap-2">
              {translations.all}
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-all duration-300 ${
                  activeFilter === "ALL"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {casosExito.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("OPAV")}
            className={`relative px-6 py-2.5 text-sm font-light transition-all duration-300 rounded-full font-['Inter'] ${
              activeFilter === "OPAV"
                ? "text-white shadow-md"
                : "text-gray-500 hover:text-[#d50058] hover:bg-white"
            }`}
            style={{
              background:
                activeFilter === "OPAV"
                  ? "linear-gradient(to right, #d50058, #ff1a8c)"
                  : "transparent",
            }}
            aria-pressed={activeFilter === "OPAV"}
            aria-label={`Mostrar casos OPAV (${casosOPAV.length})`}
          >
            <span className="flex items-center gap-2">
              {translations.opav}
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-all duration-300 ${
                  activeFilter === "OPAV"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {casosOPAV.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("B&S")}
            className={`relative px-6 py-2.5 text-sm font-light transition-all duration-300 rounded-full font-['Inter'] ${
              activeFilter === "B&S"
                ? "text-white shadow-md"
                : "text-gray-500 hover:text-[#0e7490] hover:bg-white"
            }`}
            style={{
              background:
                activeFilter === "B&S"
                  ? "linear-gradient(to right, #0e7490, #06b6d4)"
                  : "transparent",
            }}
            aria-pressed={activeFilter === "B&S"}
            aria-label={`Mostrar casos B&S (${casosBS.length})`}
          >
            <span className="flex items-center gap-2">
              {translations.bs}
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-all duration-300 ${
                  activeFilter === "B&S"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {casosBS.length}
              </span>
            </span>
          </button>
        </div>

        {/* Results Counter */}
        <div className="text-sm text-gray-500 font-light">
          <span className="text-gray-900 font-normal">
            {filteredCases.length}
          </span>{" "}
          {translations.results}
        </div>
      </div>

      {/* Cases Grid - Goldbeck Style */}
      <div className="w-full mt-8">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {filteredCases.map((caso, index) => {
            const isOPAV = caso.empresa === "OPAV";
            const brandColor = isOPAV ? "#d50058" : "#0e7490";
            const brandColorLight = isOPAV ? "#ff1a8c" : "#06b6d4";

            return (
              <li key={caso.id}>
                <Link
                  href={`/${locale}/casos-exito/${caso.Slug}`}
                  aria-label={`Ver caso de éxito: ${caso.nombre} - ${caso.empresa}, ${caso.ubicacion}`}
                  className="group/card relative block h-[400px] md:h-[450px] overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={
                    {
                      opacity: 0,
                      animation: `fadeInUp 0.6s ease-out forwards`,
                      animationDelay: `${index * 100}ms`,
                      "--brand-color": brandColor,
                      "--brand-color-light": brandColorLight,
                    } as React.CSSProperties
                  }
                >
                  {/* Background Image - Full Card */}
                  {caso.imagenPrincipal &&
                    (() => {
                      const imageUrl = getStrapiMedia(
                        caso.imagenPrincipal,
                        "large"
                      );
                      if (!imageUrl) return null;

                      return (
                        <Image
                          src={imageUrl}
                          alt={`${caso.nombre} - ${caso.empresa} en ${caso.ubicacion}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                          priority={index < 3}
                          quality={85}
                        />
                      );
                    })()}

                  {/* Dark Overlay - Stays visible, fades slightly on hover */}
                  <div className="absolute inset-0 z-[1] bg-black/70 transition-opacity duration-500 group-hover/card:opacity-40" />

                  {/* Brand-tinted Background - Slides diagonally from bottom-right to top-left */}
                  <div
                    className="absolute left-0 top-[-2px] z-[2] block h-[calc(100%+4px)] w-[calc(100%+200px)] translate-x-full transition-transform duration-500 ease-out group-hover/card:translate-x-[-200px] group-focus/card:translate-x-[-200px] pointer-events-none"
                    style={{
                      backgroundColor: isOPAV ? "#fff5f8" : "#f0fdfa",
                      clipPath: "polygon(150px 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* Diagonal Stripe Accent - Follows the background, adds brand color edge */}
                  <div
                    className="absolute left-0 top-[-2px] z-[3] block h-[calc(100%+4px)] w-[calc(100%+200px)] translate-x-full transition-transform duration-500 ease-out delay-[50ms] group-hover/card:translate-x-[-200px] group-focus/card:translate-x-[-200px] pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${brandColorLight}, transparent 80px)`,
                      clipPath: "polygon(150px 0, 100% 0, 100% 100%, 0 100%)",
                      opacity: 0.3,
                    }}
                  />

                  {/* Content - Text transitions from white to black */}
                  <div className="absolute inset-0 z-[4] flex flex-col justify-between p-6">
                    {/* Top Row - Category & Date */}
                    <div className="flex items-start justify-between">
                      {/* Category Badge */}
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-300 border-white/20 group-hover/card:border-gray-200 group-hover/card:backdrop-blur-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full transition-colors duration-300"
                          style={{ backgroundColor: brandColorLight }}
                        />
                        <span className="uppercase tracking-wider transition-colors duration-300 text-white group-hover/card:text-gray-900">
                          {caso.empresa}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="space-y-3">
                      {/* Title */}
                      <h3 className="text-2xl md:text-2xl font-semibold leading-tight font-['Inter'] line-clamp-2 transition-colors duration-300 text-white group-hover/card:text-gray-900">
                        {caso.nombre}
                      </h3>

                      {/* City with Arrow */}
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-sm font-light flex items-center gap-2 transition-colors duration-300 text-white/60 group-hover/card:text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {caso.ubicacion}
                        </p>

                        {/* Arrow Indicator */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center transform transition-all duration-300 bg-white/10 backdrop-blur-sm group-hover/card:translate-x-1"
                          style={{
                            backgroundColor: isOPAV
                              ? "rgba(213, 0, 88, 0.1)"
                              : "rgba(14, 116, 144, 0.1)",
                          }}
                        >
                          <svg
                            className="w-5 h-5 transition-colors duration-300 text-white group-hover/card:text-gray-900"
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
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle border */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none z-[5] transition-all duration-300 ring-1 ring-inset ring-white/10 group-hover/card:ring-gray-200" />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* No Results State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">
              No hay casos de éxito disponibles
            </div>
            <div className="text-gray-400">
              Ajusta los filtros para ver más resultados
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filteredCases.length > 0 && (
          <div className="mt-12 flex flex-col items-center space-y-8 lg:flex-row lg:justify-center lg:space-x-8 lg:space-y-0">
            <button className="inline-flex cursor-pointer justify-center items-center gap-2 transition-all duration-300 focus:outline-none focus-visible:ring focus-visible:ring-[#d50058]/50 disabled:pointer-events-none disabled:opacity-30 bg-[#d50058] text-white focus:ring-4 active:bg-[#a0003d] hover:bg-[#ff1a6c] hover:shadow-lg hover:shadow-[#d50058]/25 w-60 p-4 rounded-full font-semibold min-h-[56px] font-['Inter'] group">
              <span className="font-medium">{translations.loadMore}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
