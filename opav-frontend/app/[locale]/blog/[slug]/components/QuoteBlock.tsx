"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { quoteReveal } from "@/lib/animations";

interface QuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
}

/**
 * Premium Quote Block
 * Features:
 * - Elegant reveal animation
 * - Gradient border effect
 * - Editorial typography
 * - Responsive design
 * - Accessibility compliant
 */
export default function QuoteBlock({ quote, author, role }: QuoteBlockProps) {
  return (
    <motion.figure
      variants={quoteReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative my-16 lg:my-20"
    >
      {/* Decorative gradient border */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
        aria-hidden="true"
      />

      <div className="relative bg-white border-l-4 border-gradient-to-b from-blue-500 to-indigo-500 rounded-r-2xl shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] bg-[url('/patterns/noise.png')] mix-blend-multiply pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative p-8 lg:p-12">
          {/* Quote icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
            aria-hidden="true"
          >
            <Quote size={24} className="text-white" />
          </motion.div>

          {/* Quote content */}
          <blockquote>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl lg:text-3xl xl:text-4xl text-gray-900 font-light leading-relaxed mb-6"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                lineHeight: "1.5",
                letterSpacing: "-0.02em",
              }}
            >
              &ldquo;{quote}&rdquo;
            </motion.p>

            {/* Author attribution */}
            {author && (
              <motion.footer
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-4 pt-4 border-t border-gray-100"
              >
                <div className="flex-1">
                  <cite className="not-italic font-semibold text-gray-900 text-lg block">
                    {author}
                  </cite>
                  {role && (
                    <span className="text-sm text-gray-600 mt-1 block">
                      {role}
                    </span>
                  )}
                </div>
              </motion.footer>
            )}
          </blockquote>
        </div>
      </div>
    </motion.figure>
  );
}
