"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeInUp } from "@/lib/animations";

interface LeadParagraphProps {
  content: string;
}

/**
 * Editorial Lead Paragraph (Drop Cap)
 * Features:
 * - Large first letter (drop cap)
 * - Editorial typography
 * - Smooth reveal animation
 * - Optimized readability
 */
export default function LeadParagraph({ content }: LeadParagraphProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Extract first letter for drop cap
  const firstLetter = content.charAt(0);
  const restOfContent = content.slice(1);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="mb-12"
    >
      <p
        className="text-xl lg:text-2xl leading-relaxed text-gray-700"
        style={{
          fontFamily: "var(--font-eb-garamond)",
          lineHeight: "1.8",
          letterSpacing: "-0.01em",
        }}
      >
        {/* Drop Cap - First Letter */}
        <span
          className="float-left text-7xl lg:text-8xl font-bold leading-none mr-3 mt-1 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600"
          style={{
            fontFamily: "var(--font-playfair)",
            lineHeight: "0.8",
          }}
          aria-hidden="true"
        >
          {firstLetter}
        </span>
        {restOfContent}
      </p>
    </motion.div>
  );
}
