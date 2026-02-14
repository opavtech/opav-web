"use client";

import { useTranslations } from "next-intl";

export default function CompanyMissionVision() {
  const t = useTranslations("company");

  return (
    <section
      aria-labelledby="mission-vision-title"
      className="py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* ------------------ MISIÓN ------------------ */}
          <article className="relative rounded-xl p-8 bg-white border border-gray-200 shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d50058] to-[#f5347b] rounded-t-xl" />

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("mission.title")}
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              {t("mission.content")}
            </p>
          </article>

          {/* ------------------ VISIÓN ------------------ */}
          <article className="relative rounded-xl p-8 bg-white border border-gray-200 shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d50058] to-[#f5347b] rounded-t-xl" />

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("vision.title")}
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              {t("vision.content")}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
