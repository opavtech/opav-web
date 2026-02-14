"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ImmersiveCTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  locale: string;
}

export default function ImmersiveCTA({
  title,
  subtitle,
  buttonText,
  buttonHref,
  locale,
}: ImmersiveCTAProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Animated gradient background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    const animate = () => {
      if (!ctx) return;

      timeRef.current += 0.01;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Create animated gradient
      const gradient1 = ctx.createRadialGradient(
        width * (0.5 + Math.sin(timeRef.current) * 0.3),
        height * (0.5 + Math.cos(timeRef.current) * 0.3),
        0,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );

      gradient1.addColorStop(0, "rgba(213, 0, 88, 0.15)");
      gradient1.addColorStop(0.5, "rgba(160, 0, 61, 0.08)");
      gradient1.addColorStop(1, "rgba(213, 0, 88, 0.02)");

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      // Secondary gradient
      const gradient2 = ctx.createRadialGradient(
        width * (0.5 - Math.sin(timeRef.current * 0.7) * 0.3),
        height * (0.5 - Math.cos(timeRef.current * 0.7) * 0.3),
        0,
        width * 0.3,
        height * 0.3,
        width * 0.6
      );

      gradient2.addColorStop(0, "rgba(255, 26, 140, 0.1)");
      gradient2.addColorStop(1, "rgba(255, 26, 140, 0)");

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  // Ripple effect on click
  const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden" onClick={handleRipple}>
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: prefersReducedMotion ? "auto" : "contents" }}
        aria-hidden="true"
      />

      {/* Glass Morph Container */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: "easeOut",
          }}
          className="max-w-4xl mx-auto text-center relative"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: "32px",
            padding: "60px 40px",
            border: "1px solid rgba(213, 0, 88, 0.15)",
            boxShadow: "0 20px 60px rgba(213, 0, 88, 0.12)",
          }}
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.2,
            }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-['Inter']"
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.3,
            }}
            className="text-xl text-gray-700 mb-10 font-['Inter']"
          >
            {subtitle}
          </motion.p>

          {/* Magnetic Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.4,
            }}
          >
            <Link
              ref={buttonRef}
              href={`/${locale}${buttonHref}`}
              className="inline-block relative group"
            >
              <motion.div
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                className="relative px-10 py-4 rounded-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
                  boxShadow: "0 10px 30px rgba(213, 0, 88, 0.3)",
                }}
              >
                {/* Gradient border animation */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                    transform: "translateX(-100%)",
                    animation: prefersReducedMotion
                      ? "none"
                      : "shimmer 2s infinite",
                  }}
                  aria-hidden="true"
                />

                <span className="relative z-10 text-white font-bold text-lg font-['Inter']">
                  {buttonText}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{
            x: ripple.x,
            y: ripple.y,
            scale: 0,
            opacity: 0.5,
          }}
          animate={{
            scale: 4,
            opacity: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "100px",
            height: "100px",
            border: "2px solid rgba(213, 0, 88, 0.3)",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        />
      ))}

      {/* Shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
