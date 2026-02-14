"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessCaseCard from "./SuccessCaseCard";

interface SuccessCase {
  id: number;
  nombre: string;
  empresa: "OPAV" | "B&S";
  ubicacion: string;
  descripcion?: string;
  Slug: string;
  imagenPrincipal?: {
    url: string;
    alternativeText?: string;
  };
}

interface SuccessCasesFilterProps {
  cases: SuccessCase[];
  locale: string;
  translations: {
    opavTitle: string;
    opavDescription: string;
    bsTitle: string;
    bsDescription: string;
    all: string;
  };
}

type FilterType = "OPAV" | "B&S";

export default function SuccessCasesFilter({
  cases,
  locale,
  translations,
}: SuccessCasesFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("OPAV");

  const filteredCases = cases
    .filter((caso) => caso.empresa === activeFilter)
    .slice(0, 3); // Limitar a 3 casos

  return (
    <div className="w-full">
      {/* Filter Tabs - Pill Deslizante */}
      <div className="flex justify-center mb-10">
        <div className="relative inline-flex bg-gray-100 rounded-full p-1">
          {/* Pill animada que se desliza */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full"
            initial={false}
            animate={{
              x: activeFilter === "OPAV" ? 0 : "100%",
              backgroundColor: activeFilter === "OPAV" ? "#d50058" : "#00acc8",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              width: "calc(50% - 2px)",
              left: 2,
            }}
          />

          {/* OPAV Button */}
          <button
            onClick={() => setActiveFilter("OPAV")}
            className="relative z-10 px-8 py-3 text-sm font-medium transition-colors duration-200 rounded-full font-['Inter'] min-w-[140px]"
            style={{
              color: activeFilter === "OPAV" ? "#ffffff" : "#6b7280",
            }}
          >
            {translations.opavTitle}
          </button>

          {/* B&S Button */}
          <button
            onClick={() => setActiveFilter("B&S")}
            className="relative z-10 px-8 py-3 text-sm font-medium transition-colors duration-200 rounded-full font-['Inter'] min-w-[140px]"
            style={{
              color: activeFilter === "B&S" ? "#ffffff" : "#6b7280",
            }}
          >
            {translations.bsTitle}
          </button>
        </div>
      </div>

      {/* Descripción del filtro activo */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeFilter}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="text-center text-sm text-gray-500 mb-8 font-['Inter']"
        >
          {activeFilter === "OPAV"
            ? translations.opavDescription
            : translations.bsDescription}
        </motion.p>
      </AnimatePresence>

      {/* Cases Grid with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {filteredCases.map((caso, index) => (
            <SuccessCaseCard
              key={caso.id}
              caso={{
                nombre: caso.nombre,
                empresa: caso.empresa,
                ubicacion: caso.ubicacion,
                descripcion: caso.descripcion,
                Slug: caso.Slug,
                imagenPrincipal: caso.imagenPrincipal,
              }}
              index={index}
              locale={locale}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredCases.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Inter']">
            No hay casos disponibles
          </h3>
          <p className="text-gray-500 font-['Inter']">
            No se encontraron casos de éxito para esta categoría.
          </p>
        </div>
      )}
    </div>
  );
}
