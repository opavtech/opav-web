"use client";

import { useState } from "react";
import { getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import type { Certificacion } from "@/types/certificacion";

// CSS Variables for consistent theming
const cssVars = {
  primary: "#d50058",
  primaryLight: "rgba(213, 0, 88, 0.1)",
} as const;

// Componente para texto expandible (solo en mobile usando CSS)
function ExpandableText({
  text,
  maxLength = 150,
  showMoreLabel,
  showLessLabel,
}: {
  text: string;
  maxLength?: number;
  showMoreLabel: string;
  showLessLabel: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = text.length > maxLength;

  // En desktop siempre muestra todo, en mobile puede truncar
  if (!needsTruncation) {
    return (
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    );
  }

  const truncatedText = text.slice(0, maxLength) + "...";

  return (
    <div>
      {/* Mobile: muestra texto truncado/expandido con botón */}
      <div className="md:hidden">
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {isExpanded ? text : truncatedText}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-[#d50058] text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d50058] focus-visible:ring-offset-2 rounded"
          aria-expanded={isExpanded}
        >
          {isExpanded ? showLessLabel : showMoreLabel}
        </button>
      </div>
      {/* Desktop: muestra todo el texto */}
      <p className="hidden md:block text-gray-600 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}

// Skeleton component for loading state
function CertificacionSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="flex flex-col lg:flex-row">
        {/* Logo Skeleton */}
        <div className="lg:w-64 flex-shrink-0 bg-gray-50 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="w-40 h-32 bg-gray-200 rounded" />
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-7 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-20" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
          <div className="flex gap-6 pt-4 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Export skeleton for use in parent component
export function CertificacionesGridSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <CertificacionSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

interface CertificacionesGridProps {
  certificaciones: Certificacion[];
  locale: string;
  translations: {
    all: string;
    vigentes: string;
    results: string;
    noResults: string;
    filterBy: string;
    viewDetails: string;
    issuedBy: string;
    issuedOn: string;
    validUntil: string;
    expired: string;
    active: string;
    whatItBrings: string;
    showMore: string;
    showLess: string;
  };
}

type FilterType = "ALL" | "VIGENTES";

export default function CertificacionesGrid({
  certificaciones,
  locale,
  translations,
}: CertificacionesGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  // Filter certifications
  const getFilteredCertificaciones = () => {
    let filtered = certificaciones;

    switch (activeFilter) {
      case "VIGENTES":
        filtered = filtered.filter((c) => c.vigente);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredCertificaciones = getFilteredCertificaciones();

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="w-full">
        {/* Filter Section - Minimal */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div
            className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg"
            role="group"
            aria-label={translations.filterBy}
          >
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d50058] focus-visible:ring-offset-2 ${
                activeFilter === "ALL"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-pressed={activeFilter === "ALL"}
              aria-label={`${translations.all} (${certificaciones.length})`}
            >
              {translations.all} ({certificaciones.length})
            </button>
            <button
              onClick={() => setActiveFilter("VIGENTES")}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d50058] focus-visible:ring-offset-2 ${
                activeFilter === "VIGENTES"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-pressed={activeFilter === "VIGENTES"}
              aria-label={`${translations.vigentes} (${
                certificaciones.filter((c) => c.vigente).length
              })`}
            >
              {translations.vigentes} (
              {certificaciones.filter((c) => c.vigente).length})
            </button>
          </div>

          <p className="text-sm text-gray-500">
            {filteredCertificaciones.length} {translations.results}
          </p>
        </div>

        {/* Certifications List */}
        <AnimatePresence mode="wait">
          {filteredCertificaciones.length > 0 ? (
            <m.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {filteredCertificaciones.map((cert, index) => {
                const logoUrl = getStrapiMedia(cert.logo, "medium");
                const fechaVenc = cert.fechaVencimiento;
                const fechaEmis = cert.fechaEmision;
                const entidad = cert.entidadEmisora;
                const queAporta = cert.queAporta;

                return (
                  <m.article
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-[#d50058] focus-within:ring-offset-2"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Logo Section */}
                      <div className="lg:w-64 flex-shrink-0 bg-gray-50 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                        {logoUrl ? (
                          <div className="relative w-40 h-32">
                            <Image
                              src={logoUrl}
                              alt={`Logo de ${cert.nombre}`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 1024px) 160px, 160px"
                              priority={index < 2}
                              loading={index < 2 ? "eager" : "lazy"}
                              quality={85}
                              placeholder="blur"
                              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-6 lg:p-8">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div>
                            {cert.destacado && (
                              <span className="inline-block px-2 py-0.5 bg-[#d50058]/10 text-[#d50058] text-xs font-medium rounded mb-2">
                                Destacada
                              </span>
                            )}
                            <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">
                              {cert.nombre}
                            </h3>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              cert.vigente
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {cert.vigente
                              ? translations.active
                              : translations.expired}
                          </span>
                        </div>

                        {/* Issuer */}
                        {entidad && (
                          <p className="text-sm text-gray-600 mb-4">
                            <span className="font-medium">
                              {translations.issuedBy}:
                            </span>{" "}
                            {entidad}
                          </p>
                        )}

                        {/* Description - Expandable on mobile */}
                        <div className="prose prose-sm prose-gray max-w-none mb-6">
                          <ExpandableText
                            text={cert.descripcion}
                            maxLength={150}
                            showMoreLabel={translations.showMore}
                            showLessLabel={translations.showLess}
                          />
                        </div>

                        {/* What it brings - Expandable on mobile */}
                        {queAporta && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-[#d50058]">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {translations.whatItBrings}
                            </p>
                            <div className="text-sm">
                              <ExpandableText
                                text={queAporta}
                                maxLength={150}
                                showMoreLabel={translations.showMore}
                                showLessLabel={translations.showLess}
                              />
                            </div>
                          </div>
                        )}

                        {/* Dates */}
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-6 text-sm">
                            {fechaEmis && (
                              <div>
                                <span className="text-gray-500">
                                  {translations.issuedOn}:
                                </span>{" "}
                                <span className="text-gray-900 font-medium">
                                  {formatDate(fechaEmis)}
                                </span>
                              </div>
                            )}
                            {fechaVenc && (
                              <div>
                                <span className="text-gray-500">
                                  {translations.validUntil}:
                                </span>{" "}
                                <span
                                  className={`font-medium ${
                                    cert.vigente
                                      ? "text-gray-900"
                                      : "text-red-600"
                                  }`}
                                >
                                  {formatDate(fechaVenc)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </m.article>
                );
              })}
            </m.div>
          ) : (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-500">{translations.noResults}</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
