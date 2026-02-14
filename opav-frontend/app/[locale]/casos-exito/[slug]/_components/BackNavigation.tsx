"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface BackNavigationProps {
  locale: string;
  translations: {
    backToAll: string;
  };
}

export default function BackNavigation({
  locale,
  translations,
}: BackNavigationProps) {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={`/${locale}/casos-exito`}
            className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 group"
          >
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 group-hover:bg-gray-200 group-hover:-translate-x-1">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
            <span className="text-lg font-['Inter']">
              {translations.backToAll}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
