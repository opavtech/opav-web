"use client";

import { useTranslations } from "next-intl";

export default function CompanyMissionVision() {
  const t = useTranslations("company");

  return (
    <section
      aria-labelledby="mission-vision-title"
      className="py-12 sm:py-16 lg:py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* ------------------ MISIÓN ------------------ */}
          <article className="relative rounded-xl p-6 sm:p-8 bg-white border border-gray-200 shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d50058] to-[#f5347b] rounded-t-xl" />

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t("mission.title")}
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {t("mission.content")}
            </p>
          </article>

          {/* ------------------ VISIÓN ------------------ */}
          <article className="relative rounded-xl p-6 sm:p-8 bg-white border border-gray-200 shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d50058] to-[#f5347b] rounded-t-xl" />

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t("vision.title")}
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {t("vision.content")}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
