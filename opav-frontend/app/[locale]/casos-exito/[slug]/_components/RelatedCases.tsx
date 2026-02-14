"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";

interface CasoExito {
  id: number;
  nombre: string;
  empresa: "OPAV" | "B&S";
  ubicacion: string;
  Slug: string;
  imagenPrincipal?: any;
}

interface RelatedCasesProps {
  casos: CasoExito[];
  locale: string;
  translations: {
    title: string;
    viewAll: string;
  };
}

export default function RelatedCases({
  casos,
  locale,
  translations,
}: RelatedCasesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!casos || casos.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-['Inter']">
              {translations.title}
            </h2>
          </div>

          {/* Cases Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casos.slice(0, 3).map((caso, index) => (
              <RelatedCaseCard
                key={caso.id}
                caso={caso}
                locale={locale}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RelatedCaseCard({
  caso,
  locale,
  index,
  isInView,
}: {
  caso: CasoExito;
  locale: string;
  index: number;
  isInView: boolean;
}) {
  const isOPAV = caso.empresa === "OPAV";
  const brandColor = isOPAV ? "#d50058" : "#0e7490";
  const brandColorLight = isOPAV ? "#fff5f8" : "#f0fdfa";

  const imageUrl = caso.imagenPrincipal
    ? getStrapiMedia(caso.imagenPrincipal.url || caso.imagenPrincipal)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/${locale}/casos-exito/${caso.Slug}`}
        className="group block relative h-[320px] rounded-xl overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${caso.nombre} - ${caso.empresa} en ${caso.ubicacion}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: isOPAV
                  ? "linear-gradient(135deg, #d50058 0%, #a0003d 100%)"
                  : "linear-gradient(135deg, #0e7490 0%, #0a5a6e 100%)",
              }}
            />
          )}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 transition-opacity duration-500 group-hover:opacity-40" />

        {/* Diagonal Color Wipe Effect */}
        <div
          className="absolute left-0 top-0 z-[2] block h-full w-[calc(100%+200px)] translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-[-200px]"
          style={{
            clipPath: "polygon(150px 0, 100% 0, 100% 100%, 0 100%)",
            backgroundColor: brandColorLight,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 z-[4] flex flex-col justify-between p-6">
          {/* Top: Badge */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-300 bg-white/10 border-white/20 text-white group-hover:bg-gray-100 group-hover:border-gray-200 group-hover:text-gray-700">
              {caso.empresa}
            </span>
          </div>

          {/* Bottom: Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold leading-tight font-['Inter'] line-clamp-2 transition-colors duration-300 text-white group-hover:text-gray-900">
              {caso.nombre}
            </h3>
            <p className="text-sm font-light flex items-center gap-2 transition-colors duration-300 text-white/60 group-hover:text-gray-500">
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
          </div>
        </div>

        {/* Border */}
        <div className="absolute inset-0 rounded-xl pointer-events-none z-[5] transition-all duration-300 ring-1 ring-inset ring-white/10 group-hover:ring-gray-200" />
      </Link>
    </motion.div>
  );
}
