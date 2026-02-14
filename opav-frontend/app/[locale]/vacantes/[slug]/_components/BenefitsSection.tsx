"use client";

import { useInView } from "react-intersection-observer";

interface BenefitsSectionProps {
  title: string;
  content: string;
  brandColor: string;
}

export default function BenefitsSection({
  title,
  content,
  brandColor,
}: BenefitsSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 lg:p-10 border-2 transition-all duration-1000 delay-200 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ borderColor: `${brandColor}30` }}
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
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <div
        className="prose prose-lg max-w-none 
          prose-headings:text-gray-900 
          prose-p:text-gray-700 
          prose-strong:text-gray-900
          prose-strong:font-bold
          prose-ul:text-gray-700
          prose-ul:space-y-4
          prose-li:pl-2
          [&_ul>li]:before:content-['★']
          [&_ul>li]:before:mr-3
          [&_ul>li]:before:text-xl
          [&_ul>li]:before:inline-block
          [&_ul>li]:flex
          [&_ul>li]:items-start
          [&_ul>li]:bg-white
          [&_ul>li]:p-4
          [&_ul>li]:rounded-xl
          [&_ul>li]:shadow-sm
          [&_ul>li]:transition-all
          [&_ul>li]:duration-300
          hover:[&_ul>li]:shadow-md
          hover:[&_ul>li]:-translate-y-1"
        style={
          {
            "--tw-prose-bullets": brandColor,
          } as React.CSSProperties
        }
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
