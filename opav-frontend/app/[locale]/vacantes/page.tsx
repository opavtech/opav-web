import { getTranslations } from "next-intl/server";
import { getVacantes } from "@/lib/strapi";
import type { Metadata } from "next";
import VacantesGrid from "@/components/VacantesGrid";
import VacantesHero from "@/components/VacantesHero";

interface VacantesPageProps {
  params: Promise<{ locale: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opav.com.co";

// Revalidación cada hora (ISR)
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: VacantesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });

  const title = t("seo.title");
  const description = t("seo.description");
  const keywords = t("seo.keywords");

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/vacantes`,
      languages: {
        es: `${baseUrl}/es/vacantes`,
        en: `${baseUrl}/en/vacantes`,
      },
    },
  };
}

export default async function VacantesPage({ params }: VacantesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });

  let vacantes = [];

  try {
    const response = await getVacantes(locale);
    vacantes = response.data || [];
  } catch (error) {
    console.error("Error fetching vacantes:", error);
  }

  const activas = vacantes.filter((v: any) => v.activa).length;

  // JSON-LD: CollectionPage
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/${locale}/vacantes#collection`,
    name: t("seo.title"),
    description: t("seo.description"),
    url: `${baseUrl}/${locale}/vacantes`,
    inLanguage: locale === "es" ? "es-ES" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "OPAV",
    },
    breadcrumb: {
      "@id": `${baseUrl}/${locale}/vacantes#breadcrumb`,
    },
  };

  // JSON-LD: ItemList
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/${locale}/vacantes#itemlist`,
    numberOfItems: vacantes.length,
    itemListElement: vacantes
      .slice(0, 10)
      .map((vacante: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/${locale}/vacantes/${vacante.slug}`,
        name: vacante.titulo,
      })),
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/${locale}/vacantes#breadcrumb`,
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
        name: locale === "es" ? "Vacantes" : "Jobs",
        item: `${baseUrl}/${locale}/vacantes`,
      },
    ],
  };

  const translations = {
    filters: {
      all: t("filters.all"),
      opav: t("filters.opav"),
      bs: t("filters.bs"),
      byCity: t("filters.byCity"),
      byArea: t("filters.byArea"),
      search: t("filters.search"),
      searchPlaceholder: t("filters.searchPlaceholder"),
      searchLabel: t("filters.searchLabel"),
      clear: t("filters.clear"),
      showing: t("filters.showing"),
      results: t("filters.results"),
      active: t("filters.active"),
    },
    card: {
      company: t("card.company"),
      salary: t("card.salary"),
      location: t("card.location"),
      contractType: t("card.contractType"),
      area: t("card.area"),
      experience: t("card.experience"),
      closingDate: t("card.closingDate"),
      applyNow: t("card.applyNow"),
      viewDetails: t("card.viewDetails"),
    },
    contractTypes: {
      indefinido: t("contractTypes.indefinido"),
      temporal: t("contractTypes.temporal"),
      porObra: t("contractTypes.porObra"),
    },
    noJobs: {
      title: t("noJobs.title"),
      description: t("noJobs.description"),
      contactUs: t("noJobs.contactUs"),
      contactText: t("noJobs.contactText"),
    },
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        {/* Hero */}
        <VacantesHero
          totalVacantes={vacantes.length}
          activas={activas}
          locale={locale}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          badge={t("hero.badge")}
        />

        {/* Intro Section */}
        <section
          className="py-12 bg-gray-50"
          aria-labelledby="vacantes-intro-title"
        >
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2
              id="vacantes-intro-title"
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {t("intro.title")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("intro.description")}
            </p>
          </div>
        </section>

        {/* Grid */}
        <VacantesGrid
          vacantes={vacantes}
          locale={locale}
          translations={translations}
        />

        {/* CTA Section */}
        <section
          className="relative py-20 md:py-24 text-white overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #d50058 0%, #a0003d 50%, #d50058 100%)",
          }}
          aria-labelledby="cta-section-title"
        >
          {/* Pattern overlay */}
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
                {t("cta.description")}
              </p>
              <a
                href={`/${locale}/vacantes/espontanea`}
                className="inline-flex items-center gap-2 bg-white text-[#d50058] px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg font-['Inter'] group"
                aria-label={t("cta.buttonAria")}
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
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
