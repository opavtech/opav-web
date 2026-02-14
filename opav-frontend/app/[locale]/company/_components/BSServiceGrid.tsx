"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { JSX, useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedBackground3D from "@/components/AnimatedBackground3D";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BSServiceGridProps {
  locale: string;
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function BSServiceGrid({ locale }: BSServiceGridProps) {
  const t = useTranslations("company.bsManagement");
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Glass Morph Animation on Viewport Entry
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const glassLayer = card.querySelector(".glass-layer") as HTMLElement;
      if (!glassLayer) return;

      gsap.fromTo(
        card,
        {
          scaleX: 0.3,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
          delay: index * 0.1,
        }
      );

      gsap.fromTo(
        glassLayer,
        {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
        {
          backgroundColor: "rgba(255, 255, 255, 0.20)",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
          delay: index * 0.1,
        }
      );
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setMousePosition({ x, y });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const services: ServiceCard[] = [
    {
      id: "card1",
      title: t("card1.title"),
      description: t("card1.description"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "card2",
      title: t("card2.title"),
      description: t("card2.description"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "card3",
      title: t("card3.title"),
      description: t("card3.description"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "card4",
      title: t("card4.title"),
      description: t("card4.description"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="bs-services-title"
      className="py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      {/* Animated 3D Background */}
      <AnimatedBackground3D />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center justify-center mb-4">
            <span className="w-8 h-px bg-gray-400"></span>
            <Image
              src="/images/logos/bs-facilities-logo-hor.png"
              alt="B&S Facilities"
              width={100}
              height={24}
              className="mx-3 h-6 w-auto object-contain"
            />
            <span className="w-8 h-px bg-gray-400"></span>
          </div>

          <h2
            id="bs-services-title"
            className="text-4xl md:text-5xl font-['Inter'] font-light text-gray-900 mb-4 tracking-tight"
          >
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-['Inter'] font-light">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const iconTransform = isHovered
              ? `translate(${mousePosition.x * -8}px, ${
                  mousePosition.y * -8
                }px)`
              : "translate(0, 0)";
            const titleTransform = isHovered
              ? `translate(${mousePosition.x * 4}px, ${mousePosition.y * 3}px)`
              : "translate(0, 0)";

            return (
              <article
                key={service.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                tabIndex={0}
                className="service-card group relative rounded-2xl p-8 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                style={{
                  transformOrigin: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Glass Layer - animated background */}
                <div
                  className="glass-layer absolute inset-0 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px) saturate(150%)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                />

                {/* Border Glow - scan effect */}
                <div
                  className="border-glow absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: isHovered
                      ? `radial-gradient(600px circle at ${
                          mousePosition.x * 50 + 50
                        }% ${mousePosition.y * 50 + 50}%, 
                          rgba(100, 116, 139, 0.15), 
                          transparent 40%)`
                      : "none",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />

                {/* Diagonal Shine - metallic reflection */}
                <div
                  className="diagonal-shine absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)",
                      transform: isHovered
                        ? "translateX(100%)"
                        : "translateX(-100%)",
                      transition: "transform 0.8s ease",
                    }}
                  />
                </div>

                {/* Icon Container - Parallax */}
                <div
                  className="relative z-10 mb-6"
                  style={{
                    transform: iconTransform,
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(100, 116, 139, 0.15) 100%)",
                    }}
                  >
                    {service.icon}
                  </div>
                </div>

                {/* Title - Parallax */}
                <h3
                  className="relative z-10 text-xl font-semibold text-gray-900 mb-3 font-['Inter'] group-hover:text-gray-800 transition-colors duration-300"
                  style={{
                    transform: titleTransform,
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  {service.title}
                </h3>

                {/* Description - Static */}
                <p className="relative z-10 text-gray-600 font-['Inter'] leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative border */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{
                    background:
                      "linear-gradient(90deg, #64748b 0%, #94a3b8 100%)",
                  }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
