import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getCertificaciones } from "@/lib/strapi";
import { getLocalizedPath } from "@/lib/routes";
import CertificacionesHero from "./_components/CertificacionesHero";
import CertificacionesGrid from "./_components/CertificacionesGrid";
import type { Metadata } from "next";
import type { Certificacion } from "@/types/certificacion";

interface CertificacionesPageProps {
  params: Promise<{ locale: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CertificacionesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  return {
    title:
      locale === "es"
        ? "Certificaciones - OPAV y B&S Facilities | Calidad y Excelencia Certificada"
        : "Certifications - OPAV & B&S Facilities | Certified Quality and Excellence",
    description:
      locale === "es"
        ? "Conoce nuestras certificaciones y acreditaciones en gestión de propiedades y facilities management. Estándares internacionales de calidad, seguridad y medio ambiente que respaldan nuestros servicios en Colombia."
        : "Learn about our certifications and accreditations in property management and facilities management. International standards for quality, safety and environment that support our services in Colombia.",
    keywords:
      locale === "es"
        ? "certificaciones OPAV, ISO facilities management, certificaciones calidad Colombia, acreditaciones property management, estándares internacionales, gestión certificada"
        : "OPAV certifications, ISO facilities management, quality certifications Colombia, property management accreditations, international standards, certified management",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/certificaciones`,
      languages: {
        es: `${baseUrl}/es/certificaciones`,
        en: `${baseUrl}/en/certificaciones`,
      },
    },
    openGraph: {
      title:
        locale === "es"
          ? "Certificaciones - OPAV y B&S Facilities"
          : "Certifications - OPAV & B&S Facilities",
      description:
        locale === "es"
          ? "Certificaciones y acreditaciones que respaldan nuestros servicios de calidad en Colombia"
          : "Certifications and accreditations that support our quality services in Colombia",
      url: `${baseUrl}/${locale}/certificaciones`,
      siteName: "OPAV",
      type: "website",
      locale: locale === "es" ? "es_CO" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_CO",
      images: [
        {
          url: `${baseUrl}/images/og/certificaciones-og.jpg`,
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Certificaciones de calidad OPAV"
              : "OPAV Quality Certifications",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@OPAV_SAS",
      title:
        locale === "es"
          ? "Certificaciones - OPAV y B&S Facilities"
          : "Certifications - OPAV & B&S Facilities",
      description:
        locale === "es"
          ? "Estándares internacionales de calidad que respaldan nuestros servicios"
          : "International quality standards that support our services",
    },
  };
}

export default async function CertificacionesPage({
  params,
}: CertificacionesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("certificaciones");

  // Fetch certifications from Strapi
  let certificaciones: Certificacion[] = [];

  try {
    const response = await getCertificaciones(locale);
    // Filter only destacado=true certifications
    certificaciones = (response.data || []).filter(
      (cert: Certificacion) => cert.destacado,
    );
  } catch (error) {
    console.error("Error fetching certificaciones:", error);
  }

  // Calculate stats (based on filtered certificaciones)
  const vigentes = certificaciones.filter(
    (c: Certificacion) => c.vigente,
  ).length;

  // JSON-LD Structured Data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  const structuredData = [
    // CollectionPage schema
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${baseUrl}/${locale}/certificaciones`,
      name: t("hero.title"),
      description: t("hero.description"),
      url: `${baseUrl}/${locale}/certificaciones`,
      inLanguage: locale === "es" ? "es-CO" : "en-US",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "OPAV",
      },
      provider: {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "OPAV SAS",
        url: baseUrl,
        logo: `${baseUrl}/images/logos/opav-logo.png`,
        sameAs: [
          "https://www.linkedin.com/company/opav-sas",
          "https://twitter.com/OPAV_SAS",
        ],
      },
      numberOfItems: certificaciones.length,
      about: {
        "@type": "Service",
        serviceType: ["Property Management", "Facilities Management"],
        areaServed: {
          "@type": "Country",
          name: "Colombia",
        },
      },
    },
    // ItemList schema for certifications
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t("hero.title"),
      description: t("hero.description"),
      numberOfItems: certificaciones.length,
      itemListElement: certificaciones.map(
        (cert: Certificacion, index: number) => ({
          "@type": "Certification",
          position: index + 1,
          name: cert.nombre,
          description: cert.descripcion,
          provider: {
            "@type": "Organization",
            name: cert.entidadEmisora || "OPAV SAS",
          },
          validFrom: cert.fechaEmision,
          validUntil: cert.fechaVencimiento,
        }),
      ),
    },
    // BreadcrumbList schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "es" ? "Inicio" : "Home",
          item: `${baseUrl}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "es" ? "Certificaciones" : "Certifications",
          item: `${baseUrl}/${locale}/certificaciones`,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section with Floating Badges */}
      <CertificacionesHero
        totalCertificaciones={certificaciones.length}
        vigentes={vigentes}
        destacadas={certificaciones.length}
        locale={locale}
        title={t("hero.title")}
        description={t("hero.description")}
        badge={
          locale === "es"
            ? "Calidad y Excelencia Certificada"
            : "Certified Quality and Excellence"
        }
      />

      {/* Content Section */}
      <section
        className="relative py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white"
        aria-labelledby="certificaciones-section-title"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2
              id="certificaciones-section-title"
              className="text-3xl md:text-4xl font-light text-gray-900 mb-4 font-['Inter'] tracking-tight"
            >
              {t("section.title")}
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              {t("section.subtitle")}
            </p>
          </div>

          <CertificacionesGrid
            certificaciones={certificaciones}
            locale={locale}
            translations={{
              all: t("filters.all"),
              vigentes: t("filters.vigentes"),
              results: t("filters.results"),
              noResults: t("filters.noResults"),
              filterBy: t("filters.filterBy"),
              viewDetails: t("filters.viewDetails"),
              issuedBy: t("filters.issuedBy"),
              issuedOn: t("filters.issuedOn"),
              validUntil: t("filters.validUntil"),
              expired: t("filters.expired"),
              active: t("filters.active"),
              whatItBrings: t("filters.whatItBrings"),
              showMore: t("filters.showMore"),
              showLess: t("filters.showLess"),
            }}
          />
        </div>
      </section>

      {/* Trust Section */}
      <section
        className="py-16 md:py-24 bg-white"
        aria-labelledby="trust-section-title"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2
                id="trust-section-title"
                className="text-3xl md:text-4xl font-light text-gray-900 mb-4 font-['Inter'] tracking-tight"
              >
                {t("trust.title")}
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                {t("trust.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <article className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-emerald-100">
                <div
                  className="text-4xl shrink-0"
                  role="img"
                  aria-label="Trophy"
                >
                  🏆
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-['Inter']">
                    {t("trust.reason1.title")}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {t("trust.reason1.description")}
                  </p>
                </div>
              </article>

              <article className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
                <div className="text-4xl shrink-0" role="img" aria-label="Lock">
                  🔒
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-['Inter']">
                    {t("trust.reason2.title")}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {t("trust.reason2.description")}
                  </p>
                </div>
              </article>

              <article className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-purple-100">
                <div
                  className="text-4xl shrink-0"
                  role="img"
                  aria-label="Growth chart"
                >
                  📈
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-['Inter']">
                    {t("trust.reason3.title")}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {t("trust.reason3.description")}
                  </p>
                </div>
              </article>

              <article className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-100">
                <div
                  className="text-4xl shrink-0"
                  role="img"
                  aria-label="Globe"
                >
                  🌍
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-['Inter']">
                    {t("trust.reason4.title")}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {t("trust.reason4.description")}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Premium Design */}
      <section
        className="relative py-24 md:py-32 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #d50058 0%, #a0003d 50%, #d50058 100%)",
        }}
        aria-labelledby="cta-section-title"
      >
        {/* Animated background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 2px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        {/* Glow effects */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Línea decorativa superior */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <div className="h-px w-12 bg-white/30" />
            </div>

            <h2
              id="cta-section-title"
              className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 font-['Inter'] tracking-tight leading-tight"
            >
              {t("cta.title")}
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/90 font-light leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Link
              href={getLocalizedPath("contact", locale === "en" ? "en" : "es")}
              className="inline-flex items-center gap-2 bg-white text-[#d50058] px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg font-['Inter'] group"
              aria-label="Contactar para más información"
            >
              <span>{t("cta.button")}</span>
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
          </div>
        </div>
      </section>
    </main>
  );
}
