"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface JourneySectionProps {
  descripcion?: string;
  empresa: "OPAV" | "B&S";
  translations: {
    objective: string;
    challenge: string;
    solution: string;
    results: string;
    projectDescription: string;
  };
}

export default function JourneySection({
  descripcion,
  empresa,
  translations,
}: JourneySectionProps) {
  const isOPAV = empresa === "OPAV";
  const brandColor = isOPAV ? "#d50058" : "#0e7490";

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Simple Description */}
          <FallbackDescription
            title={translations.projectDescription}
            content={descripcion || ""}
            brandColor={brandColor}
          />
        </div>
      </div>
    </section>
  );
}

// Journey Card Component
function JourneyCard({
  title,
  content,
  icon,
  brandColor,
  brandColorLight,
  index,
  isLast,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
  brandColor: string;
  brandColorLight: string;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative md:pl-20"
    >
      {/* Icon Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.15 + 0.2,
          type: "spring",
        }}
        className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center z-10 hidden md:flex"
        style={{
          backgroundColor: brandColorLight,
          color: brandColor,
        }}
      >
        {icon}
      </motion.div>

      {/* Content Card */}
      <div
        className="relative rounded-2xl p-6 md:p-8 overflow-hidden group transition-all duration-300 hover:shadow-lg"
        style={{ backgroundColor: brandColorLight }}
      >
        {/* Animated border on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 0 2px ${brandColor}30`,
          }}
        />

        {/* Mobile Icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4 md:hidden"
          style={{
            backgroundColor: "white",
            color: brandColor,
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className="text-xl md:text-2xl font-semibold mb-4 font-['Inter']"
          style={{ color: brandColor }}
        >
          {title}
        </h3>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </motion.div>
  );
}

// Fallback Description Component
function FallbackDescription({
  title,
  content,
  brandColor,
}: {
  title: string;
  content: string;
  brandColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 rounded-2xl p-8 md:p-12"
    >
      <h2
        className="text-2xl md:text-3xl font-semibold mb-6 font-['Inter']"
        style={{ color: brandColor }}
      >
        {title}
      </h2>
      <div
        className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </motion.div>
  );
}
