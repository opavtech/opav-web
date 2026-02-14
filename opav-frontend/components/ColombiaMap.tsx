"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import { colombiaCities, CityName } from "@/lib/colombiaCities";
import type { CasoExitoLocation, GroupedCases } from "@/lib/colombiaCities";
import CityMarker from "./CityMarker";
import { useMapParticles } from "@/hooks/useMapParticles";

interface ColombiaMapProps {
  cases: CasoExitoLocation[];
  selectedCity: string | null;
  onCitySelect: (city: string | null) => void;
  selectedCompany: "all" | "OPAV" | "B&S";
}

export default function ColombiaMap({
  cases,
  selectedCity,
  onCitySelect,
  selectedCompany,
}: ColombiaMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hook para partículas de fondo
  useMapParticles(canvasRef);

  // Agrupar casos por ciudad y empresa
  const groupedCases = useMemo(() => {
    const grouped: GroupedCases = {};

    cases.forEach((caso) => {
      const city = caso.ubicacion;
      if (!grouped[city]) {
        grouped[city] = { opav: [], bys: [] };
      }

      if (caso.empresa === "OPAV") {
        grouped[city].opav.push(caso);
      } else {
        grouped[city].bys.push(caso);
      }
    });

    return grouped;
  }, [cases]);

  // Filtrar ciudades según la empresa seleccionada
  const visibleCities = useMemo(() => {
    return Object.keys(groupedCases).filter((city) => {
      if (selectedCompany === "all") return true;
      if (selectedCompany === "OPAV") return groupedCases[city].opav.length > 0;
      return groupedCases[city].bys.length > 0;
    });
  }, [groupedCases, selectedCompany]);

  const getCityCount = (city: string) => {
    const cityData = groupedCases[city];
    if (!cityData) return 0;

    if (selectedCompany === "OPAV") return cityData.opav.length;
    if (selectedCompany === "B&S") return cityData.bys.length;
    return cityData.opav.length + cityData.bys.length;
  };

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Fondo con efecto de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-50 rounded-2xl" />

      {/* Canvas de partículas interconectadas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-2xl"
      />

      {/* SVG del mapa de Colombia */}
      <svg
        viewBox="0 0 800 1000"
        className="relative z-10 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Contorno detallado de Colombia */}
        <motion.path
          d="M 250,100 L 280,90 L 310,85 L 340,80 L 370,85 L 390,95 L 410,110 L 425,130 L 435,150 L 440,175 L 445,200 L 448,225 L 450,250 L 455,275 L 462,295 L 470,310 L 480,325 L 490,340 L 495,360 L 498,380 L 500,400 L 502,420 L 505,445 L 508,470 L 510,495 L 512,520 L 510,545 L 505,570 L 498,595 L 490,615 L 480,635 L 468,655 L 455,675 L 440,695 L 425,715 L 410,735 L 395,755 L 380,770 L 365,785 L 348,798 L 330,810 L 310,820 L 290,828 L 270,835 L 250,840 L 230,842 L 210,840 L 192,835 L 175,828 L 160,818 L 148,805 L 138,790 L 130,773 L 125,755 L 122,735 L 120,715 L 118,695 L 115,675 L 112,655 L 108,635 L 105,615 L 103,595 L 102,575 L 101,555 L 100,535 L 100,515 L 102,495 L 105,475 L 108,455 L 112,435 L 118,415 L 125,395 L 133,375 L 142,358 L 152,342 L 162,327 L 172,313 L 182,300 L 192,288 L 202,277 L 212,267 L 220,258 L 228,250 L 235,243 L 240,237 L 244,232 L 247,228 L 248,225 L 248,222 L 247,219 L 245,216 L 242,213 L 238,210 L 233,208 L 228,207 L 223,207 L 218,208 L 214,210 L 211,213 L 209,217 L 208,222 L 208,227 L 209,232 L 211,237 L 214,241 L 218,245 L 223,248 L 228,250 L 233,251 L 238,251 L 242,250 L 245,248 L 247,245 L 248,241 L 248,237 L 247,233 L 245,230 L 242,227 L 238,225 L 233,224 L 228,224 L 223,225 L 218,227 L 214,230 L 211,234 L 209,238 L 208,243 L 208,248 L 210,253 L 213,257 L 217,260 L 222,262 L 228,263 L 234,263 L 240,262 L 245,260 L 249,257 L 252,253 L 254,248 L 255,243 L 255,238 L 254,233 L 252,228 L 249,224 L 245,221 L 240,219 L 234,218 L 228,218 L 222,219 L 217,221 L 213,224 L 210,228 L 208,233 L 208,238 L 209,243 L 211,247 L 214,250 L 218,252 L 223,253 L 228,253 L 233,252 L 237,250 L 240,247 L 242,243 L 243,238 L 243,233 L 242,228 L 240,224 L 237,221 L 233,219 L 228,218 L 223,218 L 218,219 L 214,221 L 211,224 L 209,228 L 208,233 L 208,238 L 210,242 L 213,245 L 217,247 L 222,248 L 228,248 L 234,247 L 239,245 L 243,242 L 246,238 L 248,233 L 248,228 L 247,223 L 245,219 L 242,216 L 238,214 L 233,213 L 228,213 Z"
          fill="url(#mapGradient)"
          stroke="url(#strokeGradient)"
          strokeWidth="2"
          className="drop-shadow-2xl"
          initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
          animate={{ pathLength: 1, opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />

        {/* Efectos de brillo interno */}
        <motion.path
          d="M 250,100 L 280,90 L 310,85 L 340,80 L 370,85 L 390,95 L 410,110 L 425,130 L 435,150 L 440,175 L 445,200 L 448,225 L 450,250 L 455,275 L 462,295 L 470,310 L 480,325 L 490,340 L 495,360 L 498,380 L 500,400 L 502,420 L 505,445 L 508,470 L 510,495 L 512,520 L 510,545 L 505,570 L 498,595 L 490,615 L 480,635 L 468,655 L 455,675 L 440,695 L 425,715 L 410,735 L 395,755 L 380,770 L 365,785 L 348,798 L 330,810 L 310,820 L 290,828 L 270,835 L 250,840 L 230,842 L 210,840 L 192,835 L 175,828 L 160,818 L 148,805 L 138,790 L 130,773 L 125,755 L 122,735 L 120,715 L 118,695 L 115,675 L 112,655 L 108,635 L 105,615 L 103,595 L 102,575 L 101,555 L 100,535 L 100,515 L 102,495 L 105,475 L 108,455 L 112,435 L 118,415 L 125,395 L 133,375 L 142,358 L 152,342 L 162,327 L 172,313 L 182,300 L 192,288 L 202,277 L 212,267 L 220,258 L 228,250 Z"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Líneas de conexión entre ciudades */}
        <g className="opacity-20">
          {visibleCities.map((city, i) => {
            if (i === 0) return null;
            const prevCity = visibleCities[i - 1];
            const cityCoords = colombiaCities[city as CityName];
            const prevCoords = colombiaCities[prevCity as CityName];

            if (!cityCoords || !prevCoords) return null;

            return (
              <motion.line
                key={`line-${city}`}
                x1={prevCoords.x}
                y1={prevCoords.y}
                x2={cityCoords.x}
                y2={cityCoords.y}
                stroke="url(#lineGradient)"
                strokeWidth="0.2"
                strokeDasharray="2,2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              />
            );
          })}
        </g>

        {/* Gradientes mejorados */}
        <defs>
          {/* Gradiente para el mapa */}
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(148, 163, 184, 0.15)" />
            <stop offset="50%" stopColor="rgba(148, 163, 184, 0.25)" />
            <stop offset="100%" stopColor="rgba(148, 163, 184, 0.1)" />
          </linearGradient>

          {/* Gradiente para el borde del mapa */}
          <linearGradient
            id="strokeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#E91E63" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00BCD4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E91E63" stopOpacity="0.6" />
          </linearGradient>

          {/* Gradiente para las líneas */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E91E63" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00BCD4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E91E63" stopOpacity="0.4" />
          </linearGradient>

          {/* Filtro de resplandor */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Marcadores de ciudades */}
        <AnimatePresence>
          {Object.keys(groupedCases).map((city) => {
            const cityData = groupedCases[city];
            const coords = colombiaCities[city as CityName];

            if (!coords) return null;

            const hasOPAV = cityData.opav.length > 0;
            const hasBYS = cityData.bys.length > 0;
            const count = getCityCount(city);

            // Filtrar según empresa seleccionada
            if (selectedCompany === "OPAV" && !hasOPAV) return null;
            if (selectedCompany === "B&S" && !hasBYS) return null;

            return (
              <CityMarker
                key={city}
                city={city}
                x={coords.x}
                y={coords.y}
                hasOPAV={hasOPAV}
                hasBYS={hasBYS}
                count={count}
                isSelected={selectedCity === city}
                isHovered={hoveredCity === city}
                onSelect={onCitySelect}
                onHover={setHoveredCity}
                selectedCompany={selectedCompany}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Leyenda */}
      <motion.div
        className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col gap-2 text-sm">
          {(selectedCompany === "all" || selectedCompany === "OPAV") && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E91E63] shadow-lg shadow-[#E91E63]/50" />
              <span className="text-white">OPAV</span>
            </div>
          )}
          {(selectedCompany === "all" || selectedCompany === "B&S") && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00BCD4] shadow-lg shadow-[#00BCD4]/50" />
              <span className="text-white">B&S</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
