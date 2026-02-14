"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";

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
  const getBadgeStyles = (empresa: string) => {
    if (empresa === "OPAV") {
      return {
        bg: "rgba(213, 0, 88, 0.1)",
        text: "rgb(213, 0, 88)",
        border: "rgba(213, 0, 88, 0.2)",
      };
    }
    // B&S - Cyan corporativo
    return {
      bg: "rgba(0, 172, 200, 0.1)",
      text: "rgb(0, 172, 200)",
      border: "rgba(0, 172, 200, 0.2)",
    };
  };

  const badgeStyles = getBadgeStyles(caso.empresa);

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
    >
      <Link href={`/${locale}/casos-exito/${encodeURIComponent(caso.Slug)}`}>
        <div
          className="case-card group relative bg-white rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          {/* Image Section with Smart Focal Cropping & European Premium Hover */}
          <div className="relative aspect-[16/9] md:aspect-[4/3] overflow-hidden bg-gray-100">
            {caso.imagenPrincipal?.url ? (
              <>
                <Image
                  src={caso.imagenPrincipal.url}
                  alt={
                    caso.imagenPrincipal.alternativeText?.trim() ||
                    `${caso.nombre} - ${caso.ubicacion}`
                  }
                  fill
                  className="object-cover object-center min-w-full min-h-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectPosition: "50% 50%",
                  }}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                />
                {/* Multi-layer overlay system */}
                {/* Layer 1: Subtle gradient mask for irregular edges */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/10"></div>

                {/* Layer 2: Dynamic darken overlay (enhances on hover) */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>

                {/* Layer 3: Bottom gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent"></div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Building2 className="w-14 h-14 text-gray-300" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Badge Corporativo */}
            <span
              className="inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: badgeStyles.bg,
                color: badgeStyles.text,
                border: `1px solid ${badgeStyles.border}`,
              }}
            >
              {caso.empresa}
            </span>

            {/* Título */}
            <h3 className="text-xl font-bold leading-tight text-gray-900 line-clamp-2 font-['Inter']">
              {caso.nombre}
            </h3>

            {/* Info Row - Ubicación */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="w-4 h-4" strokeWidth={2} />
              <span className="font-['Inter']">{caso.ubicacion}</span>
            </div>

            {/* Descripción */}
            {caso.descripcion && (
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed font-['Inter']">
                {caso.descripcion}
              </p>
            )}
          </div>

          {/* Hover Shadow Enhancement */}
          <style jsx>{`
            .case-card:hover {
              box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12) !important;
            }
          `}</style>
        </div>
      </Link>
    </motion.div>
  );
}
