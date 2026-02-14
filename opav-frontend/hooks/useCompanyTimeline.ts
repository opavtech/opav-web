"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsapClient";

interface TimelineRefs {
  container: React.RefObject<HTMLDivElement | null>;
  path: React.RefObject<SVGPathElement | null>;
  items: React.RefObject<(HTMLDivElement | null)[]>;
}

export function useCompanyTimeline({ container, path, items }: TimelineRefs) {
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  useEffect(() => {
    if (!container.current || !path.current) return;

    // Pequeño delay para asegurar que el DOM esté renderizado
    const timeoutId = setTimeout(() => {
      if (!container.current || !path.current) return;

      const svgPath = path.current;
      const historyItems = items.current.filter(Boolean) as HTMLDivElement[];

      // ============================================
      // CREAR CONTEXTO GSAP
      // ============================================
      ctxRef.current = gsap.context(() => {
        // ============================================
        // CONFIGURAR ANIMACIÓN DEL PATH
        // ============================================
        const pathLength = svgPath.getTotalLength();

        gsap.set(svgPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 1,
        });

        // ============================================
        // PATH - Se dibuja con scroll del contenedor
        // ============================================
        gsap.to(svgPath, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.3,
          },
        });

        // ============================================
        // ANIMAR CADA ITEM - Con su propio ScrollTrigger
        // ============================================
        historyItems.forEach((item, idx) => {
          const isLeft = idx % 2 === 0;

          // Elementos del componente
          const hex = item.querySelector(".hex");
          const hexInner = item.querySelector(".hex-inner");
          const hexGlow = item.querySelector(".hex-glow");
          const connector = item.querySelector(".connector-line");
          const cardContainer = item.querySelector(".history-card-container");
          const card = item.querySelector(".history-card");
          const sheenEffect = item.querySelector(".sheen-effect");
          const yearWatermark = item.querySelector(".year-watermark");
          const cardTitle = item.querySelector(".card-title");
          const cardDescription = item.querySelector(".card-description");

          // ============================================
          // ESTADOS INICIALES
          // ============================================
          gsap.set(hex, { scale: 0, opacity: 0 });
          gsap.set(hexInner, { rotation: -60 });
          gsap.set(hexGlow, { scale: 0.5, opacity: 0 });
          gsap.set(connector, {
            scaleX: 0,
            opacity: 0,
            transformOrigin: isLeft ? "left center" : "right center",
          });
          gsap.set(cardContainer, { opacity: 0 });
          // Card viene desde el fondo con efecto 3D parallax
          gsap.set(card, {
            opacity: 0,
            y: 80,
            z: -200, // Empieza "lejos" en el eje Z
            rotateX: 25, // Rotación hacia atrás
            rotateY: isLeft ? -15 : 15, // Rotación lateral según lado
            scale: 0.8,
          });
          gsap.set(sheenEffect, { x: "-100%" });
          gsap.set(yearWatermark, { opacity: 0, y: 20 });
          gsap.set(cardTitle, { opacity: 0, y: 15 });
          gsap.set(cardDescription, { opacity: 0, y: 10 });

          // ============================================
          // TIMELINE POR ITEM - Se activa cuando el item entra en viewport
          // ============================================
          const itemTl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 85%", // Item aparece cuando su top llega al 85% del viewport
              end: "top 40%",
              scrub: 0.3,
            },
          });

          // FASE 1: Hexágono aparece
          itemTl.to(
            hex,
            {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              ease: "back.out(1.5)",
            },
            0
          );

          itemTl.to(
            hexInner,
            {
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );

          itemTl.to(
            hexGlow,
            {
              scale: 1.3,
              opacity: 0.7,
              duration: 0.4,
              ease: "power2.out",
            },
            0.1
          );

          // FASE 2: Conector se extiende
          itemTl.to(
            connector,
            {
              opacity: 1,
              scaleX: 1,
              duration: 0.3,
              ease: "power3.out",
            },
            0.2
          );

          // FASE 3: Card aparece con efecto 3D parallax desde el fondo
          itemTl.to(
            cardContainer,
            {
              opacity: 1,
              duration: 0.2,
            },
            0.35
          );

          itemTl.to(
            card,
            {
              opacity: 1,
              y: 0,
              z: 0, // Viene hacia el frente
              rotateX: 0, // Se endereza
              rotateY: 0, // Se endereza
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            0.4
          );

          // FASE 4: Contenido interno
          itemTl.to(
            yearWatermark,
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
            },
            0.5
          );

          itemTl.to(
            cardTitle,
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
            },
            0.6
          );

          itemTl.to(
            cardDescription,
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
            },
            0.7
          );

          // FASE 5: Sheen sweep
          itemTl.to(
            sheenEffect,
            {
              x: "200%",
              duration: 0.5,
              ease: "power2.inOut",
            },
            0.8
          );

          // ============================================
          // HOVER INTERACTIVO - Scale + Sheen
          // ============================================
          if (card && sheenEffect) {
            const hoverTl = gsap.timeline({ paused: true });

            // Solo escala la card (cambio de border-radius lo hace CSS)
            hoverTl.to(
              card,
              {
                scale: 1.02,
                duration: 0.35,
                ease: "power2.out",
              },
              0
            );

            // Brillo deslizante (sheen)
            hoverTl.fromTo(
              sheenEffect,
              { x: "-100%" },
              {
                x: "250%",
                duration: 0.8,
                ease: "power2.inOut",
              },
              0
            );

            const cardEl = card as HTMLElement;
            cardEl.addEventListener("mouseenter", () => hoverTl.restart());
            cardEl.addEventListener("mouseleave", () => {
              gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            });
          }
        });
      }, container);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
    };
  }, [container, path, items]);
}
