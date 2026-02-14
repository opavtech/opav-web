"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ContactMapProps {
  locale: string;
}

export default function ContactMap({ locale }: ContactMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Coordenadas del Edificio de la Federación Nacional de Cafeteros
  // Calle 73 # 8-13, Bogotá
  const cafeterosCoords = {
    lat: 4.6533,
    lng: -74.0582,
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Crear ícono personalizado para el marcador con logo de OPAV
  const createCustomIcon = () => {
    return L.divIcon({
      html: `
        <div style="position: relative; width: 50px; height: 50px;">
          <!-- Glow effect -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 70px;
            height: 70px;
            background: radial-gradient(circle, #d5005850 0%, #d5005820 40%, transparent 70%);
            animation: pulse 2.5s ease-in-out infinite;
          "></div>
          
          <!-- Círculo contenedor del logo -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: white;
            border: 3px solid #d50058;
            border-radius: 50%;
            box-shadow: 0 4px 16px rgba(213, 0, 88, 0.3), 0 0 30px rgba(213, 0, 88, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          ">
            <!-- Logo de OPAV -->
            <img 
              src="/images/logos/opav-logo.png" 
              alt="OPAV" 
              style="
                width: 36px;
                height: 36px;
                object-fit: contain;
              "
            />
          </div>
        </div>
        
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.15); }
          }
        </style>
      `,
      className: "",
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
  };

  if (!isMounted) {
    return (
      <div className="w-full h-[350px] md:h-[400px] bg-gray-50 rounded-xl flex items-center justify-center">
        <div className="text-gray-600 text-sm">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[cafeterosCoords.lat, cafeterosCoords.lng]}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        style={{ background: "#f9fafb" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <Marker
          position={[cafeterosCoords.lat, cafeterosCoords.lng]}
          icon={createCustomIcon()}
        >
          <Popup className="custom-popup" maxWidth={280}>
            <div className="p-3">
              <h3 className="font-bold text-base mb-2 text-slate-900">
                OPAV SAS
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="font-medium">
                      Edificio Federación Nacional de Cafeteros
                    </p>
                    <p>Calle 73 # 8-13, Piso 11</p>
                    <p>Bogotá, Colombia</p>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Botón para abrir en Google Maps */}
      <a
        href="https://www.google.com/maps/place/Calle+73+%23+8-13,+Bogot%C3%A1/@4.6533,-74.0582,17z"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-sm font-medium text-gray-700 hover:text-primary-600 transition-all z-[20] flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>Ver en Google Maps</span>
      </a>
    </div>
  );
}
