"use client";

import { useSuccessBrandFilter } from "./SuccessBrandFilterContext";

/**
 * "Nube" de fondo que cambia de magenta (OPAV) a cian (B&S)
 * según la marca activa en la sección de casos de éxito del Home.
 *
 * Se renderiza DOS capas superpuestas con opacidad animada para
 * lograr una transición suave entre gradientes (los gradientes en
 * CSS no se animan directamente).
 *
 * Debe estar dentro de un `<section>` con `position: relative` y
 * bajo un `SuccessBrandFilterProvider`.
 */
export default function DynamicBrandLayer() {
  const ctx = useSuccessBrandFilter();
  // Por defecto (sin provider) arrancamos en OPAV para mantener
  // compatibilidad con el look previo.
  const isOPAV = (ctx?.activeFilter ?? "OPAV") !== "B&S";

  // Combina el gradiente lineal sutil con un blob radial más marcado
  // para que el cambio magenta ⇄ cian sea claramente visible.
  const opavBackground = [
    "radial-gradient(ellipse 80% 55% at 50% 110%, rgba(213, 0, 88, 0.18) 0%, rgba(213, 0, 88, 0.08) 40%, transparent 70%)",
    "linear-gradient(to bottom, transparent 0%, rgba(213, 0, 88, 0.05) 70%, rgba(213, 0, 88, 0.10) 100%)",
  ].join(", ");

  const bsBackground = [
    "radial-gradient(ellipse 80% 55% at 50% 110%, rgba(0, 172, 200, 0.18) 0%, rgba(0, 172, 200, 0.08) 40%, transparent 70%)",
    "linear-gradient(to bottom, transparent 0%, rgba(0, 172, 200, 0.05) 70%, rgba(0, 172, 200, 0.10) 100%)",
  ].join(", ");

  return (
    <>
      {/* Capa OPAV — magenta */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
        style={{
          background: opavBackground,
          opacity: isOPAV ? 1 : 0,
        }}
        aria-hidden="true"
        data-brand-layer="opav"
        data-active={isOPAV}
      />
      {/* Capa B&S — cian */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
        style={{
          background: bsBackground,
          opacity: isOPAV ? 0 : 1,
        }}
        aria-hidden="true"
        data-brand-layer="bs"
        data-active={!isOPAV}
      />
    </>
  );
}
