"use client";

import { useEffect, useRef } from "react";

interface VacantesHeroProps {
  totalVacantes: number;
  activas: number;
  locale: string;
  title: string;
  subtitle: string;
  badge: string;
}

export default function VacantesHero({
  totalVacantes,
  activas,
  locale,
  title,
  subtitle,
  badge,
}: VacantesHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load GSAP solo cuando sea necesario
    const loadGSAP = async () => {
      const gsap = (await import("@/lib/gsapClient")).default;
      const { ScrollTrigger } = await import("@/lib/gsapClient");

      const ctx = gsap.context(() => {
        // Parallax background
        gsap.to(".vacantes-bg", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Fade in animations
        gsap.from(".vacantes-content > *", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });
      }, heroRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[calc(100vh-80px)] flex items-center justify-center px-6 overflow-visible"
      aria-labelledby="vacantes-hero-title"
    >
      {/* Background Diagonal - Same as Certificaciones */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `#f7f7f8`,
        }}
      >
        {/* Diagonal con clip-path — magenta suave al 10% */}
        <div
          className="vacantes-bg absolute inset-0"
          style={{
            background: "rgba(251,106,157,0.10)",
            clipPath: "polygon(0 65%, 100% 45%, 100% 100%, 0% 100%)",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div
          ref={contentRef}
          className="vacantes-content max-w-5xl mx-auto text-center"
        >
          {/* Badge con stats */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-black/10 mb-8 shadow-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 bg-[#f5347b] rounded-full animate-pulse"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-900">{badge}</span>
            </div>
            <div className="w-px h-4 bg-black/10" aria-hidden="true" />
            <span className="text-sm text-gray-600">
              {activas} {locale === "es" ? "activas" : "active"}
            </span>
          </div>

          {/* Título */}
          <h1
            id="vacantes-hero-title"
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 mb-6 font-['Inter']"
          >
            {title}
          </h1>

          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <a
          href="#vacantes-intro-title"
          className="flex flex-col items-center gap-2 text-gray-600 hover:text-[#f5347b] transition-colors group"
          aria-label={locale === "es" ? "Desplazar hacia abajo" : "Scroll down"}
        >
          <span className="text-xs font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            {locale === "es" ? "Explora" : "Explore"}
          </span>
          <div className="w-6 h-10 border-2 border-current rounded-full p-1.5 flex justify-center">
            <div className="w-1 h-3 bg-current rounded-full animate-scroll" />
          </div>
        </a>
      </div>
    </section>
  );
}
