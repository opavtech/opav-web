/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

interface CertificacionesHeroProps {
  totalCertificaciones: number;
  vigentes: number;
  destacadas: number;
  locale: string;
  title: string;
  description: string;
  badge: string;
}

export default function CertificacionesHero({
  totalCertificaciones,
  vigentes,
  destacadas,
  locale,
  title,
  description,
  badge,
}: CertificacionesHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load GSAP only when component mounts (after initial render)
    let ctx: any;

    const loadGSAP = async () => {
      const { default: gsap } = await import("@/lib/gsapClient");

      ctx = gsap.context(() => {
        // Parallax título (P2 — medio)
        gsap.to(".hero-title", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Fade-in general
        gsap.from(".hero-title", {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: "power3.out",
        });

        gsap.from(".hero-description, .hero-badge", {
          opacity: 0,
          y: 20,
          duration: 1,
          delay: 0.3,
          stagger: 0.1,
          ease: "power2.out",
        });
      }, heroRef);
    };

    loadGSAP();

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[calc(100vh-80px)] flex items-center justify-center px-6 overflow-visible"
      role="banner"
      aria-label={
        locale === "es"
          ? "Sección principal de certificaciones"
          : "Certifications hero section"
      }
    >
      {/* Background Diagonal - Same as Company */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `#f7f7f8`,
        }}
      >
        {/* Diagonal con clip-path — magenta suave al 10% */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(251,106,157,0.10)",
            clipPath: "polygon(0 65%, 100% 45%, 100% 100%, 0% 100%)",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge Superior */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/10 text-xs uppercase tracking-[0.18em] font-medium text-gray-700 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5347b] animate-pulse" />
            <span>{badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight font-['Inter'] will-change-transform">
            {title}
          </h1>

          {/* Description */}
          <p className="hero-description text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
