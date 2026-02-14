"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

interface ProjectDetailsProps {
  empresa: "OPAV" | "B&S";
  nombre: string;
  ubicacion: string;
  locale: string;
  translations: {
    projectDetails: string;
    company: string;
    client: string;
    industry: string;
    location: string;
    date: string;
    duration: string;
    tags: string;
    interestedTitle: string;
    interestedText: string;
    contactButton: string;
  };
}

export default function ProjectDetails({
  empresa,
  nombre,
  ubicacion,
  locale,
  translations,
}: ProjectDetailsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isOPAV = empresa === "OPAV";
  const brandColor = isOPAV ? "#d50058" : "#0e7490";
  const brandGradient = isOPAV
    ? "linear-gradient(135deg, #d50058 0%, #a0003d 100%)"
    : "linear-gradient(135deg, #0e7490 0%, #0a5a6e 100%)";

  const details = [
    { label: translations.company, value: empresa, show: true },
    { label: translations.client, value: nombre, show: true },
    { label: translations.location, value: ubicacion, show: true },
  ];

  const visibleDetails = details.filter((d) => d.show);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Details Card */}
            <div className="bg-gray-50 rounded-2xl p-8 order-2 md:order-1">
              <h3
                className="text-2xl font-semibold mb-8 font-['Inter']"
                style={{ color: brandColor }}
              >
                {translations.projectDetails}
              </h3>

              <dl className="space-y-6">
                {visibleDetails.map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group"
                  >
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                      {detail.label}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 font-['Inter']">
                      {detail.value}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl p-8 overflow-hidden order-1 md:order-2 flex flex-col justify-center"
              style={{ background: brandGradient }}
            >
              {/* Decorative pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 font-['Inter']">
                    {translations.interestedTitle}
                  </h3>
                  <p className="text-white/90 text-lg font-light mb-8 leading-relaxed">
                    {translations.interestedText}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 group font-['Inter']"
                    style={{ color: brandColor }}
                  >
                    <span>{translations.contactButton}</span>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </motion.div>
              </div>

              {/* Animated corner accent */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
