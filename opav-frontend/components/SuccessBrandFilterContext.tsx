"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FilterType = "OPAV" | "B&S";

interface ContextValue {
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
}

const SuccessBrandFilterContext = createContext<ContextValue | null>(null);

/**
 * Provider compartido para la sección de casos de éxito del Home.
 * Comparte el estado del filtro activo (OPAV / B&S) entre:
 *   - SuccessCasesFilter (los pills y el grid de cards)
 *   - DynamicBrandLayer (el glow/nube de fondo de la sección que
 *     cambia de magenta a cian según la marca seleccionada).
 */
export function SuccessBrandFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("OPAV");
  return (
    <SuccessBrandFilterContext.Provider
      value={{ activeFilter, setActiveFilter }}
    >
      {children}
    </SuccessBrandFilterContext.Provider>
  );
}

/** Devuelve el contexto si está presente, o `null` si el componente
 *  se usa fuera de un `SuccessBrandFilterProvider`. */
export function useSuccessBrandFilter() {
  return useContext(SuccessBrandFilterContext);
}
