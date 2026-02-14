"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ServicesHeroProps {
  title: string;
  subtitle: string;
}

interface Block {
  x: number; // Grid position X
  y: number; // Grid position Y
  z: number; // Height/floor
  targetZ: number; // Target height for animation
  color: string; // "magenta" or "cyan"
  lit: boolean; // Window is lit
  opacity: number;
  buildProgress: number; // 0 to 1 animation
}

interface Particle {
  x: number;
  y: number;
  vy: number;
  opacity: number;
  color: string;
}

export default function ServicesHero({ title, subtitle }: ServicesHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // Normalized 0-1
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Iniciar en true para que arranque

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    setIsMobile(window.innerWidth < 768);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intersection Observer to pause animation when not visible
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) {
      // Cancel animation if not visible
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 550;
      setIsMobile(window.innerWidth < 768);
    };
    resizeCanvas();

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener("resize", debouncedResize, { passive: true });

    // Isometric projection constants
    const BLOCK_SIZE = isMobile ? 28 : 40;
    const GRID_COLS = isMobile ? 12 : 16;
    const GRID_ROWS = isMobile ? 8 : 12;

    // Initialize building blocks - Corporate City Layout
    blocksRef.current = [];

    const centerX = GRID_COLS / 2;
    const centerY = GRID_ROWS / 2;

    // Create corporate city skyline with downtown and suburbs
    for (let x = 0; x < GRID_COLS; x++) {
      for (let y = 0; y < GRID_ROWS; y++) {
        // Skip some positions for streets/spacing
        if (Math.random() > 0.75) continue;

        // Calculate distance from center (downtown)
        const distFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );

        // Buildings taller in center, shorter on edges
        const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
        const heightFactor = 1 - distFromCenter / maxDist;

        // Downtown skyscrapers (center) vs suburban buildings (edges)
        let maxHeight;
        if (distFromCenter < 3) {
          // Downtown - tall buildings
          maxHeight = Math.floor(6 + Math.random() * 5); // 6-10 floors
        } else if (distFromCenter < 5) {
          // Mid-town
          maxHeight = Math.floor(4 + Math.random() * 3); // 4-6 floors
        } else {
          // Suburbs
          maxHeight = Math.floor(2 + Math.random() * 2); // 2-3 floors
        }

        // Determine color: left side = OPAV (magenta), right side = B&S (cyan)
        const color = x < GRID_COLS / 2 ? "magenta" : "cyan";

        blocksRef.current.push({
          x,
          y,
          z: 0,
          targetZ: maxHeight,
          color,
          lit: Math.random() > 0.4,
          opacity: 1,
          buildProgress: Math.random() * 0.3,
        });
      }
    }

    // Initialize particles
    particlesRef.current = [];

    // Mouse tracking (normalized)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / canvas.width,
        y: e.clientY / canvas.height,
      };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Isometric projection helper
    const toIso = (x: number, y: number, z: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2.5;

      const isoX = (x - y) * BLOCK_SIZE;
      const isoY = (x + y) * BLOCK_SIZE * 0.5 - z * BLOCK_SIZE * 0.7;

      return {
        x: centerX + isoX,
        y: centerY + isoY,
      };
    };

    // Draw isometric block
    const drawBlock = (block: Block, rotation: number) => {
      if (block.buildProgress < 1) {
        block.buildProgress = Math.min(1, block.buildProgress + 0.02);
      }

      const currentZ =
        block.z + (block.targetZ - block.z) * block.buildProgress;

      // Apply rotation based on mouse
      const rotatedX =
        block.x * Math.cos(rotation) - block.y * Math.sin(rotation);
      const rotatedY =
        block.x * Math.sin(rotation) + block.y * Math.cos(rotation);

      const base = toIso(rotatedX, rotatedY, currentZ);
      const top = toIso(rotatedX, rotatedY, currentZ + 1);

      // Color scheme
      const colors = {
        magenta: {
          top: "#d50058",
          left: "#a0003d",
          right: "#ff1a8c",
        },
        cyan: {
          top: "#0e7490",
          left: "#155e75",
          right: "#06b6d4",
        },
      };

      const palette = colors[block.color as keyof typeof colors];

      ctx.globalAlpha = block.opacity * block.buildProgress;

      // Top face
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(top.x + BLOCK_SIZE, top.y + BLOCK_SIZE * 0.5);
      ctx.lineTo(top.x, top.y + BLOCK_SIZE);
      ctx.lineTo(top.x - BLOCK_SIZE, top.y + BLOCK_SIZE * 0.5);
      ctx.closePath();
      ctx.fillStyle = palette.top;
      ctx.fill();

      // Left face
      ctx.beginPath();
      ctx.moveTo(base.x - BLOCK_SIZE, base.y + BLOCK_SIZE * 0.5);
      ctx.lineTo(top.x - BLOCK_SIZE, top.y + BLOCK_SIZE * 0.5);
      ctx.lineTo(top.x, top.y + BLOCK_SIZE);
      ctx.lineTo(base.x, base.y + BLOCK_SIZE);
      ctx.closePath();
      ctx.fillStyle = palette.left;
      ctx.fill();

      // Right face
      ctx.beginPath();
      ctx.moveTo(base.x, base.y + BLOCK_SIZE);
      ctx.lineTo(top.x, top.y + BLOCK_SIZE);
      ctx.lineTo(top.x + BLOCK_SIZE, top.y + BLOCK_SIZE * 0.5);
      ctx.lineTo(base.x + BLOCK_SIZE, base.y + BLOCK_SIZE * 0.5);
      ctx.closePath();
      ctx.fillStyle = palette.right;
      ctx.fill();

      // Windows (lit effect)
      if (block.lit && currentZ > 0.5) {
        ctx.fillStyle = "rgba(255, 255, 200, 0.9)";
        const windowX = top.x - BLOCK_SIZE * 0.3;
        const windowY = top.y + BLOCK_SIZE * 0.6;
        ctx.fillRect(windowX, windowY, BLOCK_SIZE * 0.3, BLOCK_SIZE * 0.2);
      }

      ctx.globalAlpha = 1;

      // Randomly toggle lights
      if (Math.random() > 0.99) {
        block.lit = !block.lit;
      }
    };

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016;

      // Gradient background (blueprint style)
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#0f1419");
      gradient.addColorStop(1, "#1a1f2e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid (architectural blueprint)
      ctx.strokeStyle = "rgba(100, 150, 200, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Rotation based on mouse position
      const rotation = (mouseRef.current.x - 0.5) * 0.3;

      // Sort blocks by depth for proper rendering
      const sortedBlocks = [...blocksRef.current].sort((a, b) => {
        return a.x + a.y - (b.x + b.y);
      });

      // Draw all blocks
      sortedBlocks.forEach((block) => drawBlock(block, rotation));

      // Update and draw particles
      if (Math.random() > 0.9 && particlesRef.current.length < 50) {
        const randomBlock =
          blocksRef.current[
            Math.floor(Math.random() * blocksRef.current.length)
          ];
        if (randomBlock && randomBlock.buildProgress > 0.8) {
          const pos = toIso(
            randomBlock.x,
            randomBlock.y,
            randomBlock.targetZ + 1
          );
          particlesRef.current.push({
            x: pos.x + (Math.random() - 0.5) * 20,
            y: pos.y,
            vy: -1 - Math.random() * 2,
            opacity: 1,
            color: randomBlock.color === "magenta" ? "#ff1a8c" : "#06b6d4",
          });
        }
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.y += p.vy;
        p.opacity -= 0.01;

        if (p.opacity > 0) {
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [prefersReducedMotion, isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative h-[calc(100vh-80px)] overflow-hidden w-full max-w-full"
      style={{
        background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)",
      }}
      role="banner"
      aria-label="Services Hero Section"
    >
      {/* Corporate Building Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          willChange: isVisible && !prefersReducedMotion ? "contents" : "auto",
        }}
        aria-hidden="true"
      />

      {/* Semi-transparent overlay for text readability */}
      <div
        className="absolute inset-0 z-[5]"
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 20, 25, 0.7) 0%, rgba(26, 31, 46, 0.8) 100%)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              ease: "backOut",
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5347b] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-white/90">
              Servicios de Calidad
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.2,
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight font-['Inter'] mb-8"
            style={{
              textShadow:
                "0 0 40px rgba(213, 0, 88, 0.6), 0 0 80px rgba(14, 116, 144, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)",
            }}
          >
            <span className="bg-gradient-to-r from-[#d50058] via-[#ff1a8c] to-[#0e7490] bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.4,
            }}
            className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto mb-12"
          >
            {subtitle}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.6,
            }}
          >
            <motion.button
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              onClick={() => {
                const opavSection =
                  document.querySelector(
                    'section[aria-label="OPAV Services"]'
                  ) ||
                  document.querySelector(
                    ".py-24.bg-linear-to-b.from-white.to-gray-50"
                  );
                if (opavSection) {
                  opavSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="relative px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #d50058 0%, #0e7490 100%)",
                color: "#ffffff",
                boxShadow:
                  "0 10px 40px rgba(213, 0, 88, 0.5), 0 10px 40px rgba(14, 116, 144, 0.3)",
                willChange: "transform",
              }}
              aria-label="Explorar servicios"
            >
              <span className="relative z-10">Explorar Servicios</span>

              {/* Animated shine */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                }}
                aria-hidden="true"
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
