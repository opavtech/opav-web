"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Node {
  x: number;
  y: number;
  size: number;
  color: string;
  connections: number[];
  pulseDelay: number;
}

interface CasosExitoHeroProps {
  totalCasos: number;
  casosOPAV: number;
  casosBS: number;
}

export default function CasosExitoHero({
  totalCasos,
  casosOPAV,
  casosBS,
}: CasosExitoHeroProps) {
  const t = useTranslations("successCases.hero");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    setIsClient(true);

    // Check for prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    // Intersection Observer para pausar animaciones fuera de viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isClient, prefersReducedMotion]);

  useEffect(() => {
    if (!isClient || prefersReducedMotion || !isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Generate nodes
    const generateNodes = () => {
      const nodes: Node[] = [];
      const gridSize = 8;
      const spacing = canvas.width / (gridSize + 1);

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          // Random skip some nodes for organic look
          if (Math.random() > 0.65) {
            const x = spacing * (i + 1) + (Math.random() - 0.5) * spacing * 0.3;
            const y = spacing * (j + 1) + (Math.random() - 0.5) * spacing * 0.3;
            const isOPAV = Math.random() > 0.5;

            nodes.push({
              x,
              y,
              size: Math.random() * 3 + 2,
              color: isOPAV ? "#d50058" : "#0e7490",
              connections: [],
              pulseDelay: Math.random() * 2000,
            });
          }
        }
      }

      // Create connections between nearby nodes
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.hypot(
              node.x - otherNode.x,
              node.y - otherNode.y
            );
            if (distance < spacing * 1.8 && node.connections.length < 4) {
              node.connections.push(j);
            }
          }
        });
      });

      nodesRef.current = nodes;
    };

    generateNodes();

    // Animation loop
    let lastTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw isometric grid
      ctx.strokeStyle = "rgba(100, 100, 120, 0.08)";
      ctx.lineWidth = 1;
      const gridSpacing = 40;

      for (let i = 0; i < rect.width / gridSpacing; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSpacing, 0);
        ctx.lineTo(i * gridSpacing, rect.height);
        ctx.stroke();
      }

      for (let i = 0; i < rect.height / gridSpacing; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSpacing);
        ctx.lineTo(rect.width, i * gridSpacing);
        ctx.stroke();
      }

      // Mouse parallax effect (subtle)
      const parallaxX = (mousePos.x - rect.width / 2) * 0.008;
      const parallaxY = (mousePos.y - rect.height / 2) * 0.008;

      // Draw connections
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach((targetIndex) => {
          const target = nodesRef.current[targetIndex];
          if (!target) return;

          const gradient = ctx.createLinearGradient(
            node.x + parallaxX,
            node.y + parallaxY,
            target.x + parallaxX,
            target.y + parallaxY
          );
          gradient.addColorStop(0, node.color + "20");
          gradient.addColorStop(0.5, node.color + "40");
          gradient.addColorStop(1, target.color + "20");

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(node.x + parallaxX, node.y + parallaxY);
          ctx.lineTo(target.x + parallaxX, target.y + parallaxY);
          ctx.stroke();
        });
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.progress += deltaTime * 0.0005;

        if (particle.progress >= 1) return false;

        const x =
          particle.x + (particle.targetX - particle.x) * particle.progress;
        const y =
          particle.y + (particle.targetY - particle.y) * particle.progress;

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x + parallaxX, y + parallaxY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          x + parallaxX,
          y + parallaxY,
          0,
          x + parallaxX,
          y + parallaxY,
          8
        );
        gradient.addColorStop(0, particle.color + "80");
        gradient.addColorStop(1, particle.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + parallaxX, y + parallaxY, 8, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Spawn new particles randomly
      if (Math.random() > 0.95 && particlesRef.current.length < 20) {
        const randomNode =
          nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)];
        if (randomNode && randomNode.connections.length > 0) {
          const targetIndex =
            randomNode.connections[
              Math.floor(Math.random() * randomNode.connections.length)
            ];
          const target = nodesRef.current[targetIndex];

          if (target) {
            particlesRef.current.push({
              x: randomNode.x,
              y: randomNode.y,
              targetX: target.x,
              targetY: target.y,
              progress: 0,
              color: randomNode.color,
            });
          }
        }
      }

      // Draw nodes with pulse effect
      nodesRef.current.forEach((node) => {
        const pulseScale =
          1 + Math.sin((currentTime + node.pulseDelay) * 0.002) * 0.3;

        // Node glow
        const gradient = ctx.createRadialGradient(
          node.x + parallaxX,
          node.y + parallaxY,
          0,
          node.x + parallaxX,
          node.y + parallaxY,
          node.size * 4 * pulseScale
        );
        gradient.addColorStop(0, node.color + "80");
        gradient.addColorStop(0.5, node.color + "40");
        gradient.addColorStop(1, node.color + "00");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          node.x + parallaxX,
          node.y + parallaxY,
          node.size * 4 * pulseScale,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Node core
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(
          node.x + parallaxX,
          node.y + parallaxY,
          node.size * pulseScale,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(
          node.x + parallaxX - node.size * 0.3,
          node.y + parallaxY - node.size * 0.3,
          node.size * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClient, mousePos, isVisible, prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419]"
      onMouseMove={handleMouseMove}
      style={{ willChange: isVisible ? "transform" : "auto" }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Canvas for network visualization */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#d50058]/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#0e7490]/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0f1419] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex items-center justify-center h-full px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5347b] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-white/90">
              {t("badge")}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight font-['Inter'] mb-6"
          >
            <span className="bg-gradient-to-r from-[#d50058] via-[#ff1a8c] to-[#0e7490] bg-clip-text text-transparent">
              {t("title")}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto"
          >
            {t("description")}
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/40 uppercase tracking-widest">
            {t("scrollIndicator")}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/60 rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
