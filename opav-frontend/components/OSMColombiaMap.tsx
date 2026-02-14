"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CasoExitoLocation, GroupedCases } from "@/lib/colombiaCities";
import { colombiaCities, CityName } from "@/lib/colombiaCities";
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";

interface OSMColombiaMapProps {
  cases: CasoExitoLocation[];
  selectedCity: string | null;
  onCitySelect: (city: string | null) => void;
  selectedCompany: "all" | "OPAV" | "B&S";
  locale: string;
}

// Componente para animar el mapa cuando se selecciona una ciudad
function MapController({ selectedCity }: { selectedCity: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCity && colombiaCities[selectedCity as CityName]) {
      const coords = colombiaCities[selectedCity as CityName];
      map.flyTo([coords.lat, coords.lng], 12, {
        duration: 1.5,
      });
    } else {
      // Volver a vista de Colombia
      map.flyTo([4.5709, -74.2973], 6, {
        duration: 1.5,
      });
    }
  }, [selectedCity, map]);

  return null;
}

export default function OSMColombiaMap({
  cases,
  selectedCity,
  onCitySelect,
  selectedCompany,
  locale,
}: OSMColombiaMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Solo marcar como montado en el cliente
    setIsMounted(true);

    // Cleanup no necesario - react-leaflet maneja su propia limpieza
    return () => {
      setIsMounted(false);
    };
  }, []);

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

  // Crear íconos personalizados con tamaño proporcional (mapa de calor)
  const createCustomIcon = (
    color: string,
    count: number,
    isSelected: boolean,
  ) => {
    // Tamaño base proporcional al número de proyectos (mapa de calor)
    const baseSize = Math.min(20 + count * 5, 60); // Min 25px, Max 60px
    const size = isSelected ? baseSize + 10 : baseSize;
    const glowSize = size + 20;

    return L.divIcon({
      html: `
        <div style="position: relative; width: ${size}px; height: ${size}px;">
          <!-- Glow effect (heat map) -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${glowSize}px;
            height: ${glowSize}px;
            background: radial-gradient(circle, ${color}50 0%, ${color}20 40%, transparent 70%);
            animation: pulse 2.5s ease-in-out infinite;
          "></div>
          
          <!-- Círculo principal (proporcional) -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 16px ${color}90, 0 0 30px ${color}50;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: ${isSelected ? 1 : 0.85};
          "></div>
          
          <!-- Contador centrado -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: ${size > 40 ? "16px" : "12px"};
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            pointer-events: none;
          ">${count}</div>
        </div>
        
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.15); }
          }
        </style>
      `,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const getCityColor = (city: string) => {
    const cityData = groupedCases[city];
    if (!cityData) return "#E91E63";

    if (selectedCompany === "OPAV") return "#E91E63";
    if (selectedCompany === "B&S") return "#00BCD4";

    // Si es "all" y tiene ambas, mostrar magenta
    if (cityData.opav.length > 0 && cityData.bys.length > 0) return "#E91E63";
    if (cityData.opav.length > 0) return "#E91E63";
    return "#00BCD4";
  };

  const getCityCount = (city: string) => {
    const cityData = groupedCases[city];
    if (!cityData) return 0;

    if (selectedCompany === "OPAV") return cityData.opav.length;
    if (selectedCompany === "B&S") return cityData.bys.length;
    return cityData.opav.length + cityData.bys.length;
  };

  const getCityProjects = (city: string) => {
    const cityData = groupedCases[city];
    if (!cityData) return [];

    if (selectedCompany === "OPAV") return cityData.opav;
    if (selectedCompany === "B&S") return cityData.bys;
    return [...cityData.opav, ...cityData.bys];
  };

  if (!isMounted) {
    return (
      <div className="w-full h-[350px] md:h-[600px] bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center">
        <div className="text-gray-600 text-sm md:text-base">
          Cargando mapa...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] md:h-[600px] rounded-xl md:rounded-2xl overflow-hidden">
      <MapContainer
        center={[4.5709, -74.2973]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-[350px] md:h-[600px] z-10"
        style={{ background: "#f9fafb" }}
      >
        {/* Capa de tiles de OpenStreetMap - estilo con mejor contraste */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          className="map-tiles"
        />

        {/* Controlador de animación */}
        <MapController selectedCity={selectedCity} />

        {/* Marcadores de ciudades */}
        {Object.keys(groupedCases).map((city) => {
          const coords = colombiaCities[city as CityName];
          if (!coords) return null;

          const cityData = groupedCases[city];
          const hasOPAV = cityData.opav.length > 0;
          const hasBYS = cityData.bys.length > 0;
          const count = getCityCount(city);
          const projects = getCityProjects(city);

          // Filtrar según empresa seleccionada
          if (selectedCompany === "OPAV" && !hasOPAV) return null;
          if (selectedCompany === "B&S" && !hasBYS) return null;
          if (count === 0) return null;

          const color = getCityColor(city);
          const isSelected = selectedCity === city;

          return (
            <Marker
              key={city}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(color, count, isSelected)}
              eventHandlers={{
                click: () => {
                  onCitySelect(isSelected ? null : city);
                },
              }}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-3 text-slate-900">
                    {city}
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {projects.slice(0, 3).map((project) => (
                      <Link
                        key={project.id}
                        href={`/${locale}/casos-exito/${project.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-2 items-start p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          {project.imagenPrincipal && (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                              <Image
                                src={
                                  getStrapiMedia(
                                    project.imagenPrincipal,
                                    "thumbnail",
                                  ) || "/placeholder.jpg"
                                }
                                alt={project.nombre}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-slate-900 group-hover:text-[#E91E63] transition-colors line-clamp-2">
                              {project.nombre}
                            </div>
                            <div
                              className={`text-xs mt-1 font-medium ${
                                project.empresa === "OPAV"
                                  ? "text-[#E91E63]"
                                  : "text-[#00BCD4]"
                              }`}
                            >
                              {project.empresa}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {projects.length > 3 && (
                      <div className="text-xs text-slate-600 text-center pt-2 border-t">
                        +{projects.length - 3} proyectos más
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Leyenda */}
      <motion.div
        role="region"
        aria-label="Leyenda del mapa de cobertura"
        className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-slate-900/90 backdrop-blur-sm p-2 md:p-4 rounded-lg border border-slate-700 z-[20]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm">
          {(selectedCompany === "all" || selectedCompany === "OPAV") && (
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#E91E63] shadow-lg shadow-[#E91E63]/50" />
              <span className="text-white font-medium">OPAV</span>
            </div>
          )}
          {(selectedCompany === "all" || selectedCompany === "B&S") && (
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#00BCD4] shadow-lg shadow-[#00BCD4]/50" />
              <span className="text-white font-medium">B&S</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Botón para resetear vista */}
      {selectedCity && (
        <motion.button
          onClick={() => onCitySelect(null)}
          className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg border border-slate-700 text-white text-xs md:text-base font-medium hover:bg-slate-800 transition-colors z-[20]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          ← <span className="hidden sm:inline">Ver todo </span>Colombia
        </motion.button>
      )}
    </div>
  );
}
