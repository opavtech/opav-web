"use client";

import { useInView } from "react-intersection-observer";
import { getStrapiMedia } from "@/lib/strapi";

interface SidebarInfoProps {
  tipoContrato: string | null;
  experienciaRequerida: string | null;
  nivelEducativo: string | null;
  ciudad: string | null;
  area: string | null;
  archivoDescripcion: any;
  brandColor: string;
  translations: {
    jobInfo: string;
    contractType: string;
    experience: string;
    education: string;
    location: string;
    area: string;
    applyForPosition: string;
    downloadDescription: string;
  };
  contractTypeTranslated?: string;
  educationTranslated?: string;
}

export default function SidebarInfo({
  tipoContrato,
  experienciaRequerida,
  nivelEducativo,
  ciudad,
  area,
  archivoDescripcion,
  brandColor,
  translations,
  contractTypeTranslated,
  educationTranslated,
}: SidebarInfoProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`lg:col-span-1 transition-all duration-1000 ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      }`}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 sticky top-24 border-t-4"
        style={{ borderTopColor: brandColor }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {translations.jobInfo}
        </h3>

        <div className="space-y-5">
          {tipoContrato && (
            <div className="pb-5 border-b border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                {translations.contractType}
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {contractTypeTranslated || tipoContrato}
              </div>
            </div>
          )}

          {experienciaRequerida && (
            <div className="pb-5 border-b border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                {translations.experience}
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {experienciaRequerida}
              </div>
            </div>
          )}

          {nivelEducativo && (
            <div className="pb-5 border-b border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                {translations.education}
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {educationTranslated || nivelEducativo}
              </div>
            </div>
          )}

          {ciudad && (
            <div className="pb-5 border-b border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                {translations.location}
              </div>
              <div className="font-bold text-gray-900 text-lg">{ciudad}</div>
            </div>
          )}

          {area && (
            <div className="pb-5">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                {translations.area}
              </div>
              <div className="font-bold text-gray-900 text-lg">{area}</div>
            </div>
          )}
        </div>

        {/* Botón de aplicar */}
        <a
          href="#apply"
          className="block w-full mt-8 text-center text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
          style={{
            backgroundColor: brandColor,
            boxShadow: `0 10px 30px ${brandColor}40`,
          }}
        >
          {translations.applyForPosition}
        </a>

        {/* Descargar descripción */}
        {archivoDescripcion && getStrapiMedia(archivoDescripcion.url) && (
          <a
            href={getStrapiMedia(archivoDescripcion.url) || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-4 text-center bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {translations.downloadDescription}
          </a>
        )}
      </div>
    </div>
  );
}
