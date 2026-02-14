import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getCasosExito } from "@/lib/strapi";
import CasosExitoGrid from "./_components/CasosExitoGrid";
import CasosExitoHero from "./_components/CasosExitoHero";
import type { Metadata } from "next";

interface SuccessCasesPageProps {
  params: Promise<{ locale: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: SuccessCasesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  return {
    title:
      locale === "es"
        ? "Casos de Éxito - OPAV y B&S Facilities | Proyectos Exitosos en Colombia"
        : "Success Cases - OPAV & B&S Facilities | Successful Projects in Colombia",
    description:
      locale === "es"
        ? "Descubre nuestros casos de éxito en administración de propiedades y facilities management. Proyectos documentados con empresas líderes en Colombia. Resultados comprobados en ahorro de costos y eficiencia operativa."
        : "Discover our success cases in property management and facilities management. Documented projects with leading companies in Colombia. Proven results in cost savings and operational efficiency.",
    keywords:
      locale === "es"
        ? "casos de éxito OPAV, proyectos facilities management, administración propiedades Colombia, clientes satisfechos, testimonios corporativos, ahorro costos operativos"
        : "OPAV success cases, facilities management projects, property management Colombia, satisfied clients, corporate testimonials, operational cost savings",
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
      canonical: `${baseUrl}/${locale}/casos-exito`,
      languages: {
        es: `${baseUrl}/es/casos-exito`,
        en: `${baseUrl}/en/casos-exito`,
      },
    },
    openGraph: {
      title:
        locale === "es"
          ? "Casos de Éxito - OPAV y B&S Facilities"
          : "Success Cases - OPAV & B&S Facilities",
      description:
        locale === "es"
          ? "Proyectos exitosos en administración de propiedades y facilities management con empresas líderes en Colombia"
          : "Successful projects in property management and facilities management with leading companies in Colombia",
      url: `${baseUrl}/${locale}/casos-exito`,
      siteName: "OPAV",
      type: "website",
      locale: locale === "es" ? "es_CO" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_CO",
    },
    twitter: {
      card: "summary_large_image",
      site: "@OPAV_SAS",
      title:
        locale === "es"
          ? "Casos de Éxito - OPAV y B&S Facilities"
          : "Success Cases - OPAV & B&S Facilities",
      description:
        locale === "es"
          ? "Proyectos documentados con resultados comprobados en Colombia"
          : "Documented projects with proven results in Colombia",
    },
  };
}

export default async function SuccessCasesPage({
  params,
}: SuccessCasesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("successCases");

  // Obtener casos de éxito desde Strapi
  let casosExito = [];

  try {
    const response = await getCasosExito(locale);
    casosExito = response.data || [];
  } catch (error) {
    console.error("Error fetching casos de éxito:", error);
  }

  // Separar casos por empresa para contadores
  const casosOPAV = casosExito.filter((caso: any) => caso.empresa === "OPAV");
  const casosBS = casosExito.filter((caso: any) => caso.empresa === "B&S");

  // JSON-LD Structured Data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  const structuredData = [
    // CollectionPage schema
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${baseUrl}/${locale}/casos-exito`,
      name: t("hero.title"),
      description: t("hero.subtitle"),
      url: `${baseUrl}/${locale}/casos-exito`,
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
      numberOfItems: casosExito.length,
      about: {
        "@type": "Service",
        serviceType: ["Property Management", "Facilities Management"],
        areaServed: {
          "@type": "Country",
          name: "Colombia",
        },
      },
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
          name: locale === "es" ? "Casos de Éxito" : "Success Cases",
          item: `${baseUrl}/${locale}/casos-exito`,
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

      {/* Hero Section with Network Visualization */}
      <CasosExitoHero
        totalCasos={casosExito.length}
        casosOPAV={casosOPAV.length}
        casosBS={casosBS.length}
      />

      {/* Content Section */}
      <div className="relative py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-500"></div>
              </div>
            }
          >
            <CasosExitoGrid
              casosExito={casosExito}
              casosOPAV={casosOPAV}
              casosBS={casosBS}
              locale={locale}
              translations={{
                all: t("filters.all"),
                opav: t("filters.opav"),
                bs: t("filters.bs"),
                results: t("filters.results"),
                loadMore: t("filters.loadMore"),
              }}
            />
          </Suspense>
        </div>
      </div>

      {/* CTA Section with Premium Design */}
      <section
        className="relative py-24 md:py-32 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #d50058 0%, #a0003d 50%, #d50058 100%)",
        }}
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

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 font-['Inter'] tracking-tight leading-tight">
              {t("cta.title")}
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/90 font-light leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-white text-[#d50058] px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg font-['Inter'] group"
              aria-label="Contactar para iniciar un proyecto"
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
