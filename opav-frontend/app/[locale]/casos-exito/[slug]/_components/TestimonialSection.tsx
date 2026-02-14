"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TestimonialSectionProps {
  testimonioCliente: string;
  cargoTestimonio?: string;
  cliente: string;
  empresa: "OPAV" | "B&S";
}

export default function TestimonialSection({
  testimonioCliente,
  cargoTestimonio,
  cliente,
  empresa,
}: TestimonialSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isOPAV = empresa === "OPAV";
  const brandColor = isOPAV ? "#d50058" : "#0e7490";
  const brandGradient = isOPAV
    ? "linear-gradient(135deg, #d50058 0%, #a0003d 100%)"
    : "linear-gradient(135deg, #0e7490 0%, #0a5a6e 100%)";

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="relative rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden"
            style={{ background: brandGradient }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg
                viewBox="0 0 200 200"
                fill="currentColor"
                className="w-full h-full text-white"
              >
                <path
                  d="M40,40 L160,40 L160,160 L40,160 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M60,60 L140,60 L140,140 L60,140 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M80,80 L120,80 L120,120 L80,120 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Quote Mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
              }
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute top-4 left-6 md:top-8 md:left-12 text-white/10 pointer-events-none"
            >
              <svg
                className="w-16 h-16 md:w-24 md:h-24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </motion.div>

            {/* Content */}
            <div className="relative z-10">
              {/* Quote Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <div
                  className="text-xl md:text-2xl lg:text-3xl text-white font-light leading-relaxed italic font-['Inter']"
                  dangerouslySetInnerHTML={{ __html: testimonioCliente }}
                />
              </motion.div>

              {/* Attribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-4"
              >
                {/* Avatar placeholder */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {cliente.charAt(0)}
                </div>

                <div>
                  <p className="text-white font-semibold text-lg">{cliente}</p>
                  {cargoTestimonio && (
                    <p className="text-white/70 text-sm font-light">
                      {cargoTestimonio}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Bottom decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 origin-left"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
