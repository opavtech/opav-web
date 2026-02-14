"use client";

import { motion } from "framer-motion";

interface CityMarkerProps {
  city: string;
  x: number;
  y: number;
  hasOPAV: boolean;
  hasBYS: boolean;
  count: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (city: string | null) => void;
  onHover: (city: string | null) => void;
  selectedCompany: "all" | "OPAV" | "B&S";
}

export default function CityMarker({
  city,
  x,
  y,
  hasOPAV,
  hasBYS,
  count,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  selectedCompany,
}: CityMarkerProps) {
  // Determinar el color principal del marcador
  const getColor = () => {
    if (selectedCompany === "OPAV") return "#E91E63";
    if (selectedCompany === "B&S") return "#00BCD4";
    if (hasOPAV && !hasBYS) return "#E91E63";
    if (hasBYS && !hasOPAV) return "#00BCD4";
    return "#E91E63"; // Por defecto OPAV si ambas
  };

  const color = getColor();
  const scale = isSelected ? 1.5 : isHovered ? 1.3 : 1;

  return (
    <g
      onMouseEnter={() => onHover(city)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(isSelected ? null : city)}
      className="cursor-pointer"
    >
      {/* Glow effect animado */}
      <motion.circle
        cx={x}
        cy={y}
        r="20"
        fill={color}
        opacity="0.3"
        animate={{
          r: [20, 32, 20],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Segundo anillo de pulso */}
      <motion.circle
        cx={x}
        cy={y}
        r="14"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity="0.6"
        animate={{
          r: [14, 28, 14],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Marcador principal */}
      <motion.circle
        cx={x}
        cy={y}
        r="10"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          filter: `drop-shadow(0 0 ${isSelected || isHovered ? "6px" : "4px"} ${color})`,
        }}
      />

      {/* Marcador secundario si tiene ambas empresas */}
      {selectedCompany === "all" && hasOPAV && hasBYS && (
        <motion.circle
          cx={x + 6}
          cy={y + 6}
          r="5"
          fill={hasOPAV ? "#00BCD4" : "#E91E63"}
          stroke="white"
          strokeWidth="1.2"
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            filter: `drop-shadow(0 0 2.5px ${hasOPAV ? "#00BCD4" : "#E91E63"})`,
          }}
        />
      )}

      {/* Contador de proyectos */}
      {count > 1 && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered || isSelected ? 1 : 0.8,
            scale: isHovered || isSelected ? 1.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <circle
            cx={x + 12}
            cy={y - 12}
            r="6.5"
            fill="white"
            stroke={color}
            strokeWidth="1.2"
          />
          <text
            x={x + 12}
            y={y - 9.5}
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="bold"
            fill={color}
          >
            {count}
          </text>
        </motion.g>
      )}

      {/* Tooltip con nombre de ciudad */}
      {(isHovered || isSelected) && (
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          {/* Fondo del tooltip */}
          <rect
            x={x - city.length * 2.8}
            y={y - 32}
            width={city.length * 5.6}
            height="16"
            rx="2.5"
            fill="rgba(15, 23, 42, 0.95)"
            stroke={color}
            strokeWidth="0.8"
          />
          {/* Texto del tooltip */}
          <text
            x={x}
            y={y - 20}
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            fill="white"
          >
            {city}
          </text>
          {/* Subtexto con cantidad */}
          <text x={x} y={y - 12} textAnchor="middle" fontSize="5" fill={color}>
            {count} {count === 1 ? "proyecto" : "proyectos"}
          </text>
        </motion.g>
      )}
    </g>
  );
}
