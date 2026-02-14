"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface InsightBoxProps {
  title?: string;
  insights: string[];
  locale: string;
}

/**
 * Premium Insight Box
 * Features:
 * - Stagger animation for list items
 * - Gradient background with subtle patterns
 * - Custom bullet points
 * - Editorial typography
 * - Responsive design
 */
export default function InsightBox({
  title,
  insights,
  locale,
}: InsightBoxProps) {
  const defaultTitle =
    locale === "es" ? "Puntos Clave del Artículo" : "Key Insights";

  if (!insights || insights.length === 0) return null;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="my-16 lg:my-20"
      aria-labelledby="insights-heading"
    >
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-100 rounded-3xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow duration-500 overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-[url('/patterns/noise.png')] mix-blend-multiply pointer-events-none"
          aria-hidden="true"
        />

        {/* Decorative gradient blob */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
          aria-hidden="true"
        />

        {/* Icon */}
        <motion.div
          variants={fadeInUp}
          className="absolute -top-6 left-8 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl"
        >
          <Sparkles size={28} className="text-white" aria-hidden="true" />
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-8 mt-4">
          <h3
            id="insights-heading"
            className="font-bold text-2xl lg:text-3xl text-gray-900 flex items-center gap-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {title || defaultTitle}
          </h3>
          <div
            className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-3"
            aria-hidden="true"
          />
        </motion.div>

        {/* Insights List */}
        <ul className="space-y-6 relative z-10" role="list">
          {insights.map((insight, index) => (
            <motion.li
              key={index}
              variants={fadeInUp}
              custom={index}
              className="flex items-start gap-4 group"
            >
              {/* Custom bullet */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mt-1 shadow-md group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>

              {/* Content */}
              <p
                className="text-lg lg:text-xl text-gray-800 leading-relaxed flex-1"
                style={{
                  fontFamily: "var(--font-eb-garamond)",
                  lineHeight: "1.7",
                }}
              >
                {insight}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
