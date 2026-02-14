"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  items: string[];
}

const accordionVariant = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ManagementAccordion() {
  const t = useTranslations("company.management");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const pillars: AccordionItem[] = [
    {
      id: "p1",
      title: t("p1.title"),
      description: t("p1.description"),
      items: t.raw("p1.items") as string[],
    },
    {
      id: "p2",
      title: t("p2.title"),
      description: t("p2.description"),
      items: t.raw("p2.items") as string[],
    },
    {
      id: "p3",
      title: t("p3.title"),
      description: t("p3.description"),
      items: t.raw("p3.items") as string[],
    },
    {
      id: "p4",
      title: t("p4.title"),
      description: t("p4.description"),
      items: t.raw("p4.items") as string[],
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="management-title"
      className="relative py-20 overflow-hidden bg-white"
    >
      {/* Fondo minimalista con grid sutil */}
      <div className="absolute inset-0 -z-10">
        {/* Grid arquitectónico */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Iluminación direccional sutil desde arriba */}
        <div
          className="absolute inset-x-0 top-0 h-96 opacity-30"
          style={{
            background:
              "linear-gradient(180deg, rgba(248, 249, 250, 0.8) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center justify-center mb-4">
            <span className="w-8 h-px bg-[#d50058]"></span>
            <Image
              src="/images/logos/opav-logo.png"
              alt="OPAV"
              width={80}
              height={24}
              className="mx-3 h-6 w-auto object-contain"
            />
            <span className="w-8 h-px bg-[#d50058]"></span>
          </div>

          <h2
            id="management-title"
            className="text-4xl md:text-5xl font-['Inter'] font-light text-gray-900 mb-4 tracking-tight"
          >
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-['Inter'] font-light">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {pillars.map((pillar, index) => {
            const isOpen = openIndex === index;
            const panelId = `panel-${pillar.id}`;
            const buttonId = `button-${pillar.id}`;

            return (
              <motion.div
                key={pillar.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.4 },
                  },
                }}
                className="group relative bg-white rounded-xl overflow-hidden transition-all duration-200 ease-out"
                style={{
                  border: `1px solid rgba(213, 0, 88, ${
                    isOpen ? "0.15" : "0.08"
                  })`,
                  borderLeftWidth: isOpen ? "6px" : "4px",
                  boxShadow: isOpen
                    ? "0 8px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(213, 0, 88, 0.05)"
                    : "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                {/* Button */}
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d50058] focus-visible:ring-offset-2 rounded-xl transition-all duration-200 hover:bg-gray-50/50"
                >
                  <div className="flex items-start gap-5 flex-1">
                    {/* Number Badge */}
                    <div
                      className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
                        boxShadow: isOpen
                          ? "0 4px 12px rgba(213, 0, 88, 0.25), 0 0 20px rgba(213, 0, 88, 0.1)"
                          : "0 2px 6px rgba(213, 0, 88, 0.15)",
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-semibold text-[#1a1a1a] font-['Inter'] flex-1"
                      style={{
                        lineHeight: "1.4",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Icon */}
                  <svg
                    className={`w-6 h-6 text-[#d50058] transition-transform duration-300 flex-shrink-0 ml-4 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <>
                      {/* Separador sutil */}
                      <div
                        className="h-px mx-8"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(213, 0, 88, 0.1) 20%, rgba(213, 0, 88, 0.1) 80%, transparent)",
                        }}
                      />

                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={accordionVariant}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 pt-6 pl-24">
                          {/* Description */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="text-[#4a4a4a] font-['Inter'] mb-6 font-normal"
                            style={{
                              lineHeight: "1.7",
                              fontSize: "15px",
                            }}
                          >
                            {pillar.description}
                          </motion.p>

                          {/* Items list */}
                          <ul className="space-y-3">
                            {pillar.items.map((item, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.15 + idx * 0.03,
                                  duration: 0.25,
                                  ease: "easeOut",
                                }}
                                className="flex items-start gap-3 text-[#5a5a5a] font-['Inter']"
                                style={{
                                  lineHeight: "1.6",
                                  fontSize: "14px",
                                }}
                              >
                                {/* Bullet point */}
                                <span
                                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                                  style={{ backgroundColor: "#d50058" }}
                                />
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mt-12"
        >
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium font-['Inter']"
            style={{
              background:
                "linear-gradient(135deg, rgba(213, 0, 88, 0.08) 0%, rgba(213, 0, 88, 0.12) 100%)",
              border: "1.5px solid rgba(213, 0, 88, 0.2)",
              color: "#d50058",
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Certificado ISO 9001:2015</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
