"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface VacancyDescriptionProps {
  title: string;
  content: string;
  brandColor: string;
}

export default function VacancyDescription({
  title,
  content,
  brandColor,
}: VacancyDescriptionProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl shadow-lg p-8 lg:p-10 transition-all duration-1000 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${brandColor}20` }}
        >
          <svg
            className="w-6 h-6"
            style={{ color: brandColor }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
