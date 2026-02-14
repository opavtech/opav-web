"use client";

import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";

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
  archivoDescripcion?: {
    url: string;
  };
  experienciaRequerida?: string;
  slug: string;
  empresa: string;
}

interface JobCardProps {
  job: Vacante;
  locale: string;
  index: number;
  translations: Record<string, string>;
  contractTypes: Record<string, string>;
  priority?: boolean;
}

function JobCard({
  job,
  locale,
  index,
  translations,
  contractTypes,
  priority = false,
}: JobCardProps) {
  const isOPAV = job.empresa?.toLowerCase().includes("opav");
  const brandColor = isOPAV ? "#d50058" : "#5b6770";
  const brandName = isOPAV ? "OPAV" : "B&S Facilities";

  const closingDate = job.fechaCierre
    ? new Date(job.fechaCierre).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      aria-label={`${translations.viewDetails}: ${job.titulo}`}
    >
      {/* Header con badges flotantes */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
            style={{ backgroundColor: brandColor }}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                clipRule="evenodd"
              />
            </svg>
            {brandName}
          </span>

          {job.tipoContrato && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {contractTypes[job.tipoContrato] || job.tipoContrato}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Título destacado */}
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {job.titulo}
        </h3>

        {/* Salario destacado */}
        {job.salario && (
          <div className="mb-6 p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 shadow-sm">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] md:text-xs font-semibold text-green-600 uppercase tracking-wide mb-0.5">
                  {translations.salary || "Salario"}
                </div>
                <div className="font-bold text-green-900 text-sm md:text-lg lg:text-xl break-words">
                  {job.salario}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Descripción */}
        {job.descripcion && (
          <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
            {job.descripcion.substring(0, 180)}...
          </p>
        )}

        {/* Metadata en grid */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-6 p-3 md:p-4 bg-white rounded-xl border border-gray-200">
          {job.ciudad && (
            <div className="flex items-start gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                  {translations.location}
                </div>
                <div
                  className="text-xs md:text-sm font-bold text-gray-900 break-words"
                  title={job.ciudad}
                >
                  {job.ciudad}
                </div>
              </div>
            </div>
          )}

          {job.area && (
            <div className="flex items-start gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-purple-50 rounded-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                  {translations.area}
                </div>
                <div
                  className="text-xs md:text-sm font-bold text-gray-900 break-words"
                  title={job.area}
                >
                  {job.area}
                </div>
              </div>
            </div>
          )}

          {job.experienciaRequerida && (
            <div className="flex items-start gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-orange-50 rounded-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                  {translations.experience}
                </div>
                <div
                  className="text-xs md:text-sm font-bold text-gray-900 break-words"
                  title={job.experienciaRequerida}
                >
                  {job.experienciaRequerida}
                </div>
              </div>
            </div>
          )}

          {closingDate && (
            <div className="flex items-start gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-red-50 rounded-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                  {translations.closingDate}
                </div>
                <div
                  className="text-xs md:text-sm font-bold text-red-600 truncate"
                  title={closingDate || ""}
                >
                  {closingDate}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer con botones de acción más prominentes */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex items-center gap-3">
        <Link
          href={`/${locale}/vacantes/${job.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 group"
          aria-label={`${translations.viewDetails}: ${job.titulo}`}
        >
          <span>{translations.viewDetails}</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
        <Link
          href={`/${locale}/vacantes/${job.slug}#apply`}
          className="flex-1 inline-flex items-center justify-center gap-2 text-white px-5 py-3.5 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          style={{ backgroundColor: brandColor }}
          aria-label={`${translations.applyNow}: ${job.titulo}`}
        >
          <span>{translations.applyNow}</span>
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

export default memo(JobCard);
