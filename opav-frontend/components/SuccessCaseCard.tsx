"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

interface SuccessCaseCardProps {
  caso: {
    nombre: string;
    empresa: "OPAV" | "B&S";
    ubicacion: string;
    descripcion?: string;
    Slug: string;
    imagenPrincipal?: {
      url: string;
      alternativeText?: string;
    };
  };
  index: number;
  locale: string;
}

export default function SuccessCaseCard({
  caso,
  index,
  locale,
}: SuccessCaseCardProps) {
  const isOPAV = caso.empresa === "OPAV";

  // Brand palette — coherente con SuccessCasesFilter (#d50058 / #00acc8)
  const brand = isOPAV
    ? {
        color: "#d50058",
        colorRgb: "213, 0, 88",
        logoSrc: "/images/logos/opav-logo.svg",
        logoAlt: "OPAV SAS",
        logoHeightClass: "h-10",
      }
    : {
        color: "#00acc8",
        colorRgb: "0, 172, 200",
        logoSrc: "/images/logos/bs-facilities-logo-hor.png",
        logoAlt: "B&S Facilities",
        logoHeightClass: "h-8",
      };

  const ctaLabel = locale === "es" ? "Ver caso" : "View case";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        href={`/${locale}/casos-exito/${encodeURIComponent(caso.Slug)}`}
        className="h-full block"
      >
        <div
          className="case-card group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
          style={
            {
              // Subtle brand-tinted background (se percibe apenas, pero da "vida")
              backgroundColor: `rgba(${brand.colorRgb}, 0.025)`,
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              ["--brand-color" as string]: brand.color,
              ["--brand-rgb" as string]: brand.colorRgb,
            } as React.CSSProperties
          }
        >
          {/* Accent bar lateral en color de marca */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{
              background: `linear-gradient(180deg, ${brand.color} 0%, rgba(${brand.colorRgb},0.4) 100%)`,
            }}
            aria-hidden="true"
          />

          {/* Content Section */}
          <div className="p-7 pl-8 flex-1 flex flex-col">
            {/* Logo de la marca (reemplaza el badge) */}
            <div className="flex items-center h-12 mb-5">
              <Image
                src={brand.logoSrc}
                alt={brand.logoAlt}
                width={160}
                height={48}
                className={`${brand.logoHeightClass} w-auto object-contain`}
                loading="lazy"
              />
            </div>

            {/* Gradient divider sutil */}
            <div
              className="h-px w-full mb-5"
              style={{
                background: `linear-gradient(90deg, rgba(${brand.colorRgb}, 0.35) 0%, rgba(${brand.colorRgb}, 0.08) 50%, transparent 100%)`,
              }}
              aria-hidden="true"
            />

            {/* Título */}
            <h3 className="text-xl font-bold leading-tight text-gray-900 line-clamp-2 font-['Inter']">
              {caso.nombre}
            </h3>

            {/* Info Row - Ubicación */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-3">
              <MapPin className="w-4 h-4" strokeWidth={2} />
              <span className="font-['Inter']">{caso.ubicacion}</span>
            </div>

            {/* Descripción */}
            {caso.descripcion && (
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed font-['Inter'] mt-3">
                {caso.descripcion}
              </p>
            )}

            {/* CTA al pie con flecha animada */}
            <div
              className="mt-auto pt-5 flex items-center gap-2 text-sm font-semibold font-['Inter']"
              style={{ color: brand.color }}
            >
              <span>{ctaLabel}</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={2.4}
              />
            </div>
          </div>

          {/* Hover effects: lift, brand glow, shadow enhancement */}
          <style jsx>{`
            .case-card {
              position: relative;
            }
            .case-card::before {
              content: "";
              position: absolute;
              inset: -1px;
              border-radius: inherit;
              padding: 1px;
              background: linear-gradient(
                135deg,
                rgba(var(--brand-rgb), 0) 0%,
                rgba(var(--brand-rgb), 0) 100%
              );
              -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              pointer-events: none;
              transition: background 0.4s ease;
            }
            .case-card:hover {
              box-shadow:
                0 18px 40px -18px rgba(var(--brand-rgb), 0.35),
                0 6px 18px rgba(0, 0, 0, 0.08) !important;
            }
            .case-card:hover::before {
              background: linear-gradient(
                135deg,
                rgba(var(--brand-rgb), 0.45) 0%,
                rgba(var(--brand-rgb), 0.05) 100%
              );
            }
          `}</style>
        </div>
      </Link>
    </motion.div>
  );
}
