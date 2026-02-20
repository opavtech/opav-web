/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Service3DCardProps {
  servicio: any;
  index: number;
  color: "magenta" | "secondary";
}

export default function Service3DCard({
  servicio,
  index,
  color,
}: Service3DCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const colorScheme =
    color === "magenta"
      ? {
          gradient: "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
          glow: "rgba(213, 0, 88, 0.3)",
          border: "rgba(213, 0, 88, 0.2)",
          text: "#d50058",
        }
      : {
          gradient: "linear-gradient(135deg, #00acc8 0%, #0088aa 100%)",
          glow: "rgba(0, 172, 200, 0.3)",
          border: "rgba(0, 172, 200, 0.2)",
          text: "#00acc8",
        };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intersection Observer for lazy animation
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut",
      }}
      className="perspective-1000"
      style={{
        perspective: "1000px",
        willChange: isVisible ? "transform" : "auto",
      }}
    >
      <div
        className="relative w-full h-[400px] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${servicio.nombre} - Click para ver más detalles`}
        aria-pressed={isFlipped}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: prefersReducedMotion
            ? "none"
            : "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-6 md:p-8 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${colorScheme.border}`,
            boxShadow: `0 10px 40px ${colorScheme.glow}`,
          }}
        >
          {/* Glow border on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.glow} 0%, transparent 100%)`,
            }}
            aria-hidden="true"
          />

          {/* Title */}
          <h3
            className="text-2xl md:text-3xl font-bold mb-4 font-['Inter']"
            style={{
              color: colorScheme.text,
              lineHeight: "1.2",
            }}
          >
            {servicio.nombre}
          </h3>

          {/* Description */}
          <div
            className="text-gray-700 font-['Inter']"
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
            }}
            dangerouslySetInnerHTML={{
              __html: servicio.descripcion || "",
            }}
          />

          {/* Flip indicator */}
          <div className="absolute bottom-6 right-6 text-sm text-gray-500 font-['Inter']">
            Click para ver más →
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-6 md:p-8 overflow-auto"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: colorScheme.gradient,
            boxShadow: `0 20px 60px ${colorScheme.glow}`,
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 font-['Inter']">
            Beneficios
          </h3>

          {servicio.beneficios ? (
            <div
              className="text-white/90 font-['Inter'] prose prose-invert prose-sm"
              style={{
                fontSize: "14px",
                lineHeight: "1.7",
              }}
              dangerouslySetInnerHTML={{
                __html: servicio.beneficios,
              }}
            />
          ) : (
            <p className="text-white/90 font-['Inter']">
              Soluciones integrales y personalizadas para su organización
            </p>
          )}

          {/* Back indicator */}
          <div className="absolute bottom-6 right-6 text-sm text-white/70 font-['Inter']">
            ← Click para regresar
          </div>
        </div>
      </div>
    </motion.div>
  );
}
