"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import CompanyHistoryPath from "./CompanyHistoryPath";
import CompanyHistoryItem from "./CompanyHistoryItem";
import { useCompanyTimeline } from "@/hooks/useCompanyTimeline";

import "@/styles/timeline.css";
import "@/styles/crystal.css";
import "@/styles/history-animations.css";

interface HistoryItem {
  year: number;
  title: string;
  description: string;
}

// Years are constants (not translated)
const MILESTONE_YEARS = [2018, 2020, 2026, 2026];

export default function CompanyHistory() {
  const t = useTranslations("company.history");

  // === Extract translated array of items ===
  // Build array by accessing each item by index (we know we have 4 items)
  const items: HistoryItem[] = MILESTONE_YEARS.map((year, index) => ({
    year,
    title: t(`items.${index}.title`),
    description: t(`items.${index}.description`),
  }));

  // === Refs for GSAP ===
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // === Hook GSAP master timeline ===
  useCompanyTimeline({
    container: containerRef,
    path: pathRef,
    items: itemRefs,
  });

  return (
    <section
      aria-labelledby="history-title"
      className="company-history-section relative py-12 sm:py-16 lg:py-24 xl:py-32"
      style={{
        background:
          "linear-gradient(180deg, #fafafa 0%, #ffffff 50%, #fdf8fa 100%)",
      }}
    >
      {/* Title */}
      <div className="history-header text-center mb-10 sm:mb-14 lg:mb-20 px-4">
        <h2
          id="history-title"
          className="history-title text-3xl sm:text-4xl lg:text-5xl font-['Inter'] font-light tracking-tight text-gray-900"
        >
          {t("title")}
        </h2>
      </div>

      {/* Mobile: Timeline vertical simple (< lg) */}
      <div className="lg:hidden max-w-2xl mx-auto px-4 sm:px-6">
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#d50058] to-[#ff1a8c]" aria-hidden="true" />

          <div className="space-y-8 sm:space-y-10">
            {items.map((item, index) => (
              <div key={index} className="relative flex gap-6 pl-12">
                {/* Bullet */}
                <div
                  className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: "linear-gradient(135deg, #d50058, #ff1a8c)" }}
                  aria-hidden="true"
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>


                {/* Card */}
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                  <span className="text-xs sm:text-sm font-semibold text-[#d50058] uppercase tracking-wide">
                    {item.year}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Timeline ondulado con GSAP (>= lg) */}
      <div className="hidden lg:block">
        <div className="history-content-wrapper relative flex justify-center">
          <div
            ref={containerRef}
            className="history-items-container relative flex flex-col gap-20 xl:gap-32"
          >
            <CompanyHistoryPath pathRef={pathRef} />

            {items.map((item, index) => (
              <CompanyHistoryItem
                key={index}
                index={index}
                year={item.year}
                title={item.title}
                description={item.description}
                setRef={(el) => (itemRefs.current[index] = el)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
