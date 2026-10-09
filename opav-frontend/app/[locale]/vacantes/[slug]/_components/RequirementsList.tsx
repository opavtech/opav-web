"use client";

import { useInView } from "react-intersection-observer";
import VacancyMarkdown from "./VacancyMarkdown";

interface RequirementsListProps {
  title: string;
  content: string;
  brandColor: string;
}

export default function RequirementsList({
  title,
  content,
  brandColor,
}: RequirementsListProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl shadow-lg p-8 lg:p-10 transition-all duration-1000 delay-100 ${
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
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <VacancyMarkdown content={content} brandColor={brandColor} />
    </div>
  );
}
