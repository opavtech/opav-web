"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface BSInteractiveCardProps {
  servicio: any;
  index: number;
  totalCards: number;
}

export default function BSInteractiveCard({
  servicio,
  index,
  totalCards,
}: BSInteractiveCardProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mouse position for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(
    useTransform(mouseX, [-300, 300], [-20, 20]),
    springConfig
  );
  const y = useSpring(
    useTransform(mouseY, [-300, 300], [-20, 20]),
    springConfig
  );

  const colorScheme = {
    gradient: "linear-gradient(135deg, #00acc8 0%, #0088aa 100%)",
    glow: "rgba(0, 172, 200, 0.25)",
    border: "rgba(0, 172, 200, 0.15)",
    text: "#00acc8",
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mobileQuery.matches);

    const handleMotionChange = () =>
      setPrefersReducedMotion(mediaQuery.matches);
    const handleMobileChange = () => setIsMobile(mobileQuery.matches);

    mediaQuery.addEventListener("change", handleMotionChange);
    mobileQuery.addEventListener("change", handleMobileChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  // Intersection Observer
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Stack effect: Calculate position offset based on index
  const stackOffset = {
    x: (index - Math.floor(totalCards / 2)) * 5,
    y: index * -3,
    rotate: (index - Math.floor(totalCards / 2)) * 2,
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={
        isVisible
          ? {
              opacity: 1,
              scale: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut",
      }}
      style={{
        x: prefersReducedMotion || isMobile ? 0 : x,
        y: prefersReducedMotion || isMobile ? 0 : y,
        willChange: isHovered ? "transform" : "auto",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <div
        ref={contentRef}
        className="relative bg-white rounded-2xl p-6 md:p-8 overflow-hidden"
        style={{
          border: `1px solid ${colorScheme.border}`,
          boxShadow: isHovered
            ? `0 20px 60px ${colorScheme.glow}, 0 0 0 2px ${colorScheme.border}`
            : `0 10px 30px rgba(0, 0, 0, 0.08)`,
          transition: prefersReducedMotion
            ? "none"
            : "box-shadow 0.3s ease, border 0.3s ease",
          transform: prefersReducedMotion
            ? "none"
            : `translateX(${stackOffset.x}px) translateY(${stackOffset.y}px) rotate(${stackOffset.rotate}deg)`,
        }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at 50% 0%, ${colorScheme.glow} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Title */}
        <h3
          className="text-2xl md:text-3xl font-bold mb-4 font-['Inter'] relative z-10"
          style={{
            color: colorScheme.text,
            lineHeight: "1.2",
          }}
        >
          {servicio.nombre}
        </h3>

        {/* Description */}
        <div
          className="text-gray-700 font-['Inter'] mb-6 prose prose-sm relative z-10"
          style={{
            fontSize: "15px",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{
            __html: servicio.descripcion || "",
          }}
        />

        {/* Benefits */}
        {servicio.beneficios && (
          <div
            className="text-sm text-gray-600 prose prose-sm relative z-10"
            dangerouslySetInnerHTML={{
              __html: servicio.beneficios,
            }}
          />
        )}

        {/* Hover indicator */}
        <motion.div
          className="absolute bottom-4 right-4 text-xs font-['Inter']"
          style={{ color: colorScheme.text }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Interactúa →
        </motion.div>

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colorScheme.glow} 50%, transparent 100%)`,
            transform: "translateX(-100%)",
          }}
          animate={{
            transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}
