"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface CaseHeroProps {
  nombre: string;
  ubicacion: string;
  empresa: "OPAV" | "B&S";
  imagenUrl: string | null;
  locale: string;
  translations: {
    home: string;
    successCases: string;
    area: string;
    savings: string;
    employees: string;
    duration: string;
  };
}

export default function CaseHero({
  nombre,
  ubicacion,
  empresa,
  imagenUrl,
  locale,
  translations,
}: CaseHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const isOPAV = empresa === "OPAV";
  const brandColor = isOPAV ? "#d50058" : "#0e7490";
  const brandGradient = isOPAV
    ? "linear-gradient(135deg, #d50058 0%, #a0003d 100%)"
    : "linear-gradient(135deg, #0e7490 0%, #0a5a6e 100%)";

  return (
    <div ref={containerRef} className="relative min-h-[85vh] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY, scale }}>
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={`${nombre} - Caso de éxito de ${empresa} en ${ubicacion}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: brandGradient }}
          />
        )}

        {/* Overlay Layers */}
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${brandColor}40 0%, transparent 50%)`,
          }}
        />
      </motion.div>

      {/* Animated Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 z-[1]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 pt-32 pb-20"
        style={{ opacity }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <ol className="flex items-center flex-wrap gap-2 text-sm font-light">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  {translations.home}
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li>
                <Link
                  href={`/${locale}/casos-exito`}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  {translations.successCases}
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white/90 line-clamp-1">{nombre}</li>
            </ol>
          </motion.nav>

          {/* Company Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border"
              style={{
                backgroundColor: `${brandColor}20`,
                borderColor: `${brandColor}40`,
                color: "white",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: brandColor }}
              />
              {empresa}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Inter'] font-light tracking-tight text-white mb-6 leading-[1.1]"
          >
            {nombre}
          </motion.h1>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2 text-white/80">
              <svg
                className="w-5 h-5"
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
              <span className="text-lg font-light">{ubicacion}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-white/80 rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
