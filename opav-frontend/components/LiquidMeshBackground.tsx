"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
}

export default function LiquidMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);
  const ripples = useRef<
    Array<{ x: number; y: number; radius: number; maxRadius: number }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles for constellation effect
    const particleCount = 40;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      // Create ripple effect on click
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 200,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Draw liquid mesh gradient
    const drawLiquidMesh = (time: number) => {
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * 0.0003) * 200,
        canvas.height * 0.5 + Math.cos(time * 0.0002) * 150,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );

      // Breathing effect - opacity pulses
      const breathe = Math.sin(time * 0.001) * 0.15 + 0.85;

      gradient.addColorStop(0, `rgba(255, 26, 140, ${0.08 * breathe})`); // magenta
      gradient.addColorStop(0.3, `rgba(213, 0, 88, ${0.05 * breathe})`); // magenta darker
      gradient.addColorStop(0.6, `rgba(248, 249, 250, ${0.95 * breathe})`); // light gray
      gradient.addColorStop(1, `rgba(255, 255, 255, ${1 * breathe})`); // white

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Secondary gradient for depth
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.cos(time * 0.0004) * 150,
        canvas.height * 0.7 + Math.sin(time * 0.0003) * 100,
        0,
        canvas.width * 0.3,
        canvas.height * 0.7,
        canvas.width * 0.5
      );

      gradient2.addColorStop(0, `rgba(160, 0, 61, ${0.06 * breathe})`); // dark magenta
      gradient2.addColorStop(0.5, "rgba(248, 249, 250, 0)");
      gradient2.addColorStop(1, "transparent");

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Draw floating particles
    const drawParticles = () => {
      const particles = particlesRef.current;
      const maxDistance = 120;

      particles.forEach((particle, i) => {
        // Mouse interaction - attraction/repulsion
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const force = (100 - dist) / 100;
          particle.vx -= (dx / dist) * force * 0.15;
          particle.vy -= (dy / dist) * force * 0.15;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundaries with bounce
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Damping
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Draw particle (magenta glow)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(213, 0, 88, ${particle.opacity})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 8, 0, Math.PI * 2);
        const particleGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          8
        );
        particleGradient.addColorStop(
          0,
          `rgba(255, 26, 140, ${particle.opacity * 0.3})`
        );
        particleGradient.addColorStop(1, "transparent");
        ctx.fillStyle = particleGradient;
        ctx.fill();

        // Draw connections (constellation lines)
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity =
              (1 - distance / maxDistance) * 0.4 * particle.opacity;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(213, 0, 88, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Random opacity pulse
        if (Math.random() > 0.98) {
          particle.opacity = Math.min(0.8, particle.opacity + 0.1);
        }
        particle.opacity = Math.max(0.2, particle.opacity * 0.995);
      });
    };

    // Draw ripple waves
    const drawRipples = () => {
      ripples.current = ripples.current.filter((ripple) => {
        ripple.radius += 3;

        if (ripple.radius > ripple.maxRadius) return false;

        const progress = ripple.radius / ripple.maxRadius;
        const opacity = (1 - progress) * 0.4;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(213, 0, 88, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        return true;
      });
    };

    // Dynamic lighting effect
    const drawLighting = (time: number) => {
      const lightX = mouseRef.current.x;
      const lightY = mouseRef.current.y;

      const lightGradient = ctx.createRadialGradient(
        lightX,
        lightY,
        0,
        lightX,
        lightY,
        300
      );

      lightGradient.addColorStop(0, "rgba(255, 26, 140, 0.08)");
      lightGradient.addColorStop(0.5, "rgba(213, 0, 88, 0.03)");
      lightGradient.addColorStop(1, "transparent");

      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Animation loop
    const animate = () => {
      const time = Date.now();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawLiquidMesh(time);
      drawRipples();
      drawParticles();
      drawLighting(time);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
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
