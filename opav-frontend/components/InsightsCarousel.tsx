"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogInsightCard from "./BlogInsightCard";
import { BlogPost } from "@/types/blog";

interface InsightsCarouselProps {
  posts: BlogPost[];
  locale: string;
}

export default function InsightsCarousel({
  posts,
  locale,
}: InsightsCarouselProps) {
  // Usar todos los posts disponibles
  const displayPosts = posts ?? [];

  // Índice central - comienza en 0 (el más reciente)
  const [centerIndex, setCenterIndex] = useState(0);

  if (displayPosts.length === 0) return null;

  const totalPosts = displayPosts.length;

  const leftIndex = (centerIndex - 1 + totalPosts) % totalPosts;
  const rightIndex = (centerIndex + 1) % totalPosts;

  const goNext = () => {
    setCenterIndex((prev) => (prev + 1) % totalPosts);
  };

  const goPrev = () => {
    setCenterIndex((prev) => (prev - 1 + totalPosts) % totalPosts);
  };

  // Transición suave Apple
  const transition = {
    duration: 0.75,
    ease: [0.22, 1, 0.36, 1],
  };

  // Variants con rotación 3D visible y separación clara
  const variants = {
    left: {
      x: -420,
      y: 0,
      scale: 0.85,
      rotateY: 25,
      opacity: 0.6,
      zIndex: 1,
    },
    center: {
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      opacity: 1,
      zIndex: 10,
    },
    right: {
      x: 420,
      y: 0,
      scale: 0.85,
      rotateY: -25,
      opacity: 0.6,
      zIndex: 1,
    },
  };

  return (
    <div className="relative">
      {/* Contenedor del carrusel */}
      <div className="relative px-4 md:px-12 py-12">
        {/* Flecha izquierda - minimalista en móvil */}
        <motion.button
          onClick={goPrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-40
                     w-8 h-8 md:w-14 md:h-14
                     bg-black/10 md:bg-white/95 backdrop-blur-sm md:backdrop-blur-md
                     md:shadow-xl md:border md:border-gray-200 rounded-full
                     flex items-center justify-center
                     hover:bg-black/20 md:hover:shadow-2xl transition-all"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4 md:w-7 md:h-7 text-white md:text-gray-800" />
        </motion.button>

        {/* Contenedor con perspectiva 3D */}
        <div
          className="relative flex justify-center items-center h-[460px] md:h-[600px]"
          style={{
            perspective: "2000px",
            perspectiveOrigin: "center center",
          }}
        >
          {/* Card IZQUIERDA - Solo visible en desktop */}
          <motion.div
            key={`left-${leftIndex}`}
            variants={variants}
            animate="left"
            transition={transition}
            className="absolute hidden md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <BlogInsightCard post={displayPosts[leftIndex]} locale={locale} />
          </motion.div>

          {/* Card CENTRAL - Más grande y destacada */}
          <motion.div
            key={`center-${centerIndex}`}
            variants={variants}
            animate="center"
            transition={transition}
            className="absolute"
            style={{ transformStyle: "preserve-3d" }}
          >
            <BlogInsightCard
              post={displayPosts[centerIndex]}
              locale={locale}
              isCenter
            />
          </motion.div>

          {/* Card DERECHA - Solo visible en desktop */}
          <motion.div
            key={`right-${rightIndex}`}
            variants={variants}
            animate="right"
            transition={transition}
            className="absolute hidden md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <BlogInsightCard post={displayPosts[rightIndex]} locale={locale} />
          </motion.div>
        </div>

        {/* Flecha derecha - minimalista en móvil */}
        <motion.button
          onClick={goNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-40
                     w-8 h-8 md:w-14 md:h-14
                     bg-black/10 md:bg-white/95 backdrop-blur-sm md:backdrop-blur-md
                     md:shadow-xl md:border md:border-gray-200 rounded-full
                     flex items-center justify-center
                     hover:bg-black/20 md:hover:shadow-2xl transition-all"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-4 h-4 md:w-7 md:h-7 text-white md:text-gray-800" />
        </motion.button>
      </div>

      {/* CTA minimalista con pulso suave */}
      <motion.div
        className="text-center"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <p className="text-sm text-gray-500 font-['Inter'] font-light tracking-wide">
          {locale === "es"
            ? "Desliza para explorar más artículos →"
            : "Slide to explore more →"}
        </p>
      </motion.div>
    </div>
  );
}
