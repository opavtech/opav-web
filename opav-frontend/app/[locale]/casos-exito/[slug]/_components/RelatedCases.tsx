/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getStrapiMedia } from "@/lib/strapi";
import SuccessCaseCard from "@/components/SuccessCaseCard";

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

          {/* Grid — mismo estilo que la parrilla principal */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casos.slice(0, 3).map((caso, index) => (
              <SuccessCaseCard
                key={caso.id}
                caso={{
                  nombre: caso.nombre,
                  empresa: caso.empresa,
                  ubicacion: caso.ubicacion,
                  Slug: caso.Slug,
                  imagenPrincipal: caso.imagenPrincipal
                    ? {
                        url:
                          getStrapiMedia(
                            caso.imagenPrincipal.url ?? caso.imagenPrincipal,
                          ) ?? "",
                        alternativeText: caso.imagenPrincipal.alternativeText,
                      }
                    : undefined,
                }}
                index={index}
                locale={locale}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
