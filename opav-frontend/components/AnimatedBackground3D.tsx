"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  connections: number[];
}

export default function AnimatedBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);
  const gridRotationRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Intersection Observer para pausar cuando no está visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          // Reiniciar animación si vuelve a ser visible
          if (entry.isIntersecting && !animationRef.current) {
            animate();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      connections: [],
    }));

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Animate grid rotation based on mouse position
      gsap.to(gridRotationRef.current, {
        x: (e.clientY / window.innerHeight - 0.5) * 0.2,
        y: (e.clientX / window.innerWidth - 0.5) * 0.2,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Draw 3D Grid
    const draw3DGrid = () => {
      const gridSize = 40;
      const gridSpacing = 60;
      const perspective = 800;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.strokeStyle = "rgba(100, 116, 139, 0.08)";
      ctx.lineWidth = 1;

      // Rotate grid continuously
      const time = Date.now() * 0.0002;
      const rotX = gridRotationRef.current.x + Math.sin(time) * 0.1;
      const rotY = gridRotationRef.current.y + Math.cos(time * 0.7) * 0.1;

      // Draw grid lines
      for (let i = -gridSize / 2; i <= gridSize / 2; i += 2) {
        ctx.beginPath();
        for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
          const x = i * gridSpacing;
          const y = 0;
          const z = j * gridSpacing - 200;

          // 3D rotation
          const x1 = x;
          const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
          const z1 = y * Math.sin(rotX) + z * Math.cos(rotX);

          const x2 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY);
          const z2 = -x1 * Math.sin(rotY) + z1 * Math.cos(rotY);

          // Perspective projection
          const scale = perspective / (perspective + z2);
          const projX = x2 * scale + centerX;
          const projY = y1 * scale + centerY;

          if (j === -gridSize / 2) {
            ctx.moveTo(projX, projY);
          } else {
            ctx.lineTo(projX, projY);
          }
        }
        ctx.stroke();
      }

      // Perpendicular lines
      for (let i = -gridSize / 2; i <= gridSize / 2; i += 2) {
        ctx.beginPath();
        for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
          const x = j * gridSpacing;
          const y = 0;
          const z = i * gridSpacing - 200;

          const x1 = x;
          const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
          const z1 = y * Math.sin(rotX) + z * Math.cos(rotX);

          const x2 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY);
          const z2 = -x1 * Math.sin(rotY) + z1 * Math.cos(rotY);

          const scale = perspective / (perspective + z2);
          const projX = x2 * scale + centerX;
          const projY = y1 * scale + centerY;

          if (j === -gridSize / 2) {
            ctx.moveTo(projX, projY);
          } else {
            ctx.lineTo(projX, projY);
          }
        }
        ctx.stroke();
      }
    };

    // Draw particles and connections
    const drawParticles = () => {
      const particles = particlesRef.current;
      const maxDistance = 150;

      particles.forEach((particle, i) => {
        // Mouse repulsion
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.vx -= (dx / dist) * force * 0.2;
          particle.vy -= (dy / dist) * force * 0.2;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundaries
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 116, 139, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(100, 116, 139, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Pulsing effect on some particles
        if (Math.random() > 0.995) {
          particle.opacity = Math.min(1, particle.opacity + 0.1);
        }
        particle.opacity = Math.max(0.3, particle.opacity * 0.99);
      });
    };

    // Glassmorphism layers
    const drawGlassLayers = () => {
      const time = Date.now() * 0.0003;

      // Layer 1
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath();
      ctx.ellipse(
        canvas.width * 0.3 + Math.sin(time) * 100,
        canvas.height * 0.4 + Math.cos(time * 0.7) * 80,
        300,
        200,
        time * 0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Layer 2
      ctx.fillStyle = "rgba(100, 116, 139, 0.02)";
      ctx.beginPath();
      ctx.ellipse(
        canvas.width * 0.7 + Math.cos(time * 0.8) * 120,
        canvas.height * 0.6 + Math.sin(time * 0.6) * 100,
        350,
        250,
        -time * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      // Pausar si no está visible
      if (!isVisibleRef.current) {
        animationRef.current = undefined;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#f8f9fa");
      gradient.addColorStop(1, "#ffffff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw layers
      drawGlassLayers();
      draw3DGrid();
      drawParticles();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
