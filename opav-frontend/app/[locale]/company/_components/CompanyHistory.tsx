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
      className="company-history-section relative py-32 md:py-48"
      style={{
        background:
          "linear-gradient(180deg, #fafafa 0%, #ffffff 50%, #fdf8fa 100%)",
      }}
    >
      {/* Title */}
      <div className="history-header text-center mb-20">
        <h2
          id="history-title"
          className="history-title text-4xl md:text-5xl font-['Inter'] font-light tracking-tight text-gray-900"
        >
          {t("title")}
        </h2>
      </div>

      <div className="history-content-wrapper relative flex justify-center">
        {/* Container que incluye path + items para cálculos correctos */}
        <div
          ref={containerRef}
          className="history-items-container relative flex flex-col gap-20 md:gap-32"
        >
          {/* Timeline Path - Dentro del mismo container que los items */}
          <CompanyHistoryPath pathRef={pathRef} />

          {/* Milestones */}
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
    </section>
  );
}
