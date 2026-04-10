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

  return (
    <>
      {/* Capa OPAV — magenta */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(213, 0, 88, 0.04) 80%, rgba(213, 0, 88, 0.07) 100%)",
          opacity: isOPAV ? 1 : 0,
        }}
        aria-hidden="true"
      />
      {/* Capa B&S — cian */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0, 172, 200, 0.04) 80%, rgba(0, 172, 200, 0.07) 100%)",
          opacity: isOPAV ? 0 : 1,
        }}
        aria-hidden="true"
      />
    </>
  );
}
