"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const VALUES_KEYS = [
  "values.value1",
  "values.value2",
  "values.value3",
  "values.value4",
  "values.value5",
  "values.value6",
];

export default function CompanyValues() {
  const t = useTranslations("company");
  const sectionRef = useRef<HTMLElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const angleStep = 360 / VALUES_KEYS.length;
  const radius = isMobile ? 200 : 350;

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMounted || isPaused) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + angleStep) % 360);
    }, 4000);

    return () => clearInterval(interval);
  }, [isMounted, isPaused, angleStep]);

  const goToIndex = (index: number) => {
    const targetRotation = index * angleStep;
    setRotation(targetRotation);
    setIsPaused(true);

    setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="values-title"
      className="py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #fefefe 0%, #f8f9fa 50%, #f3f4f6 100%)",
      }}
    >
      {/* Título */}
      <div className="max-w-5xl mx-auto px-6 text-center mb-14">
        <h2
          id="values-title"
          className="text-4xl md:text-5xl font-['Inter'] font-light tracking-tight text-gray-900"
        >
          {t("values.title")}
        </h2>
      </div>

      {/* CARRUSEL HEXAGONAL 3D */}
      {!isMounted ? (
        // Placeholder durante SSR
        <div className="relative h-[500px] md:h-[500px] flex items-center justify-center">
          <div className="text-gray-400 animate-pulse">Cargando valores...</div>
        </div>
      ) : (
        <div
          className="relative h-[420px] md:h-[500px] flex items-center justify-center"
          style={{ perspective: isMobile ? "1200px" : "2000px" }}
        >
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateY: rotation,
            }}
            transition={{
              duration: 0,
              ease: "linear",
            }}
          >
            {VALUES_KEYS.map((key, index) => {
              // Calcular posición en el hexágono
              const angle = index * angleStep;
              const radian = (angle * Math.PI) / 180;

              // Posición 3D en el hexágono
              const x = Math.sin(radian) * radius;
              const z = Math.cos(radian) * radius;

              // Determinar si esta card está al frente (cerca de z = radius)
              const currentAngle = (((rotation + angle) % 360) + 360) % 360;
              const isFront = currentAngle < 30 || currentAngle > 330;
              const isNearFront = currentAngle < 60 || currentAngle > 300;

              // Tamaños responsive
              const cardWidth = isMobile ? "w-[200px]" : "w-[280px]";
              const cardHeight = isMobile ? "h-[280px]" : "h-[360px]";

              return (
                <motion.div
                  key={key}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${-rotation}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => goToIndex(index)}
                    className={[
                      `relative ${cardWidth} ${cardHeight} rounded-2xl p-4 md:p-8`,
                      "backdrop-blur-xl border",
                      "transition-all duration-500",
                      "flex flex-col items-center justify-center text-center",
                      isFront
                        ? "bg-white/95 border-white/70 shadow-[0_30px_60px_rgba(0,0,0,0.2)] cursor-pointer"
                        : isNearFront
                          ? "bg-white/70 border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-white/85"
                          : "bg-white/50 border-white/30 shadow-[0_15px_30px_rgba(0,0,0,0.08)] cursor-pointer hover:bg-white/65",
                    ].join(" ")}
                    style={{
                      opacity: isFront ? 1 : isNearFront ? 0.8 : 0.5,
                      pointerEvents: "auto",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Accent line top (solo en la card frontal) */}
                    {isFront && (
                      <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[3px] bg-[#b8004b] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    )}

                    {/* Número elegante */}
                    <div className="mb-4 md:mb-8 relative">
                      <div
                        className={[
                          "text-5xl md:text-7xl font-light leading-none transition-all duration-500",
                          isFront ? "text-[#b8004b]" : "text-gray-300",
                        ].join(" ")}
                        style={{
                          fontFamily:
                            "var(--font-libre-caslon), Georgia, serif",
                          fontVariantNumeric: "lining-nums",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      {/* Línea decorativa debajo del número */}
                      {isFront && (
                        <motion.div
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-px bg-[#b8004b]"
                          initial={{ width: 0 }}
                          animate={{ width: 40 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 0.2,
                          }}
                        />
                      )}
                    </div>

                    <h3
                      className={[
                        "text-lg md:text-2xl font-light tracking-tight mb-2 md:mb-3 transition-colors duration-500",
                        isFront ? "text-gray-900" : "text-gray-600",
                      ].join(" ")}
                    >
                      {t(`${key}.title`)}
                    </h3>

                    <p
                      className={[
                        "text-xs md:text-base leading-relaxed font-light transition-colors duration-500",
                        isFront ? "text-gray-600" : "text-gray-500",
                      ].join(" ")}
                    >
                      {t(`${key}.description`)}
                    </p>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Frase inspiracional */}
      {isMounted && (
        <div className="mt-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Línea decorativa superior */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-[#b8004b] to-transparent w-24"></div>
            </div>

            <p className="text-2xl md:text-3xl font-['Inter'] font-light tracking-tight text-gray-900 leading-relaxed">
              {t("values.quote")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
