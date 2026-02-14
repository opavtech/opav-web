import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ProviderForm from "@/components/ProviderForm";
import AnimatedSection from "@/components/AnimatedSection";
import ScrollToFormButton from "@/components/ScrollToFormButton";

interface ProveedoresPageProps {
  params: Promise<{ locale: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opav.com.co";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: ProveedoresPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providers" });

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
      canonical: `${baseUrl}/${locale}/proveedores`,
      languages: {
        es: `${baseUrl}/es/proveedores`,
        en: `${baseUrl}/en/proveedores`,
      },
    },
  };
}

export default async function ProveedoresPage({
  params,
}: ProveedoresPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providers" });

  // JSON-LD: WebPage
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/${locale}/proveedores#webpage`,
    name: t("seo.title"),
    description: t("seo.description"),
    url: `${baseUrl}/${locale}/proveedores`,
    inLanguage: locale === "es" ? "es-ES" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "OPAV",
    },
    breadcrumb: {
      "@id": `${baseUrl}/${locale}/proveedores#breadcrumb`,
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/${locale}/proveedores#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.providers"),
        item: `${baseUrl}/${locale}/proveedores`,
      },
    ],
  };

  // JSON-LD: Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OPAV",
    url: baseUrl,
    logo: `${baseUrl}/images/opav-logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Supplier Relations",
      availableLanguage: ["Spanish", "English"],
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <div className="min-h-screen">
        {/* Hero Section - Style like Certificaciones */}
        <section
          className="relative h-[calc(100vh-80px)] flex items-center justify-center px-6 overflow-visible"
          role="banner"
          aria-label={
            locale === "es"
              ? "Sección principal de proveedores"
              : "Providers hero section"
          }
        >
          {/* Background Diagonal - Same as Certificaciones */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `#f7f7f8`,
            }}
          >
            {/* Diagonal con clip-path — magenta suave al 10% */}
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(251,106,157,0.10)",
                clipPath: "polygon(0 65%, 100% 45%, 100% 100%, 0% 100%)",
              }}
            ></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge Superior */}
              <AnimatedSection animation="fade-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/10 text-xs uppercase tracking-[0.18em] font-medium text-gray-700 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5347b] animate-pulse" />
                  <span>{t("hero.badge")}</span>
                </div>
              </AnimatedSection>

              {/* Main Title */}
              <AnimatedSection animation="fade-up" delay={0.1}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight font-['Inter'] will-change-transform">
                  {t("hero.title")}
                </h1>
              </AnimatedSection>

              {/* Description */}
              <AnimatedSection animation="fade-up" delay={0.2}>
                <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Benefits Section - Style like Company Section */}
        <section className="py-20 bg-[#F7F9FC]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <AnimatedSection animation="fade-up">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 font-['Inter']">
                  {t("benefits.title")}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Inter']">
                  Únete a nuestra red de aliados estratégicos y accede a
                  oportunidades exclusivas
                </p>
              </AnimatedSection>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Oportunidades de Crecimiento */}
              <AnimatedSection animation="fade-right" delay={0.1}>
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-8 h-full">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background:
                        "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center font-['Inter']">
                    {t("benefits.opportunity.title")}
                  </h3>
                  <p className="text-gray-600 text-center font-['Inter']">
                    {t("benefits.opportunity.description")}
                  </p>
                </div>
              </AnimatedSection>

              {/* Card 2: Relaciones de Confianza */}
              <AnimatedSection animation="fade-up" delay={0.2}>
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-8 h-full">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background:
                        "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-white"
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
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center font-['Inter']">
                    {t("benefits.trust.title")}
                  </h3>
                  <p className="text-gray-600 text-center font-['Inter']">
                    {t("benefits.trust.description")}
                  </p>
                </div>
              </AnimatedSection>

              {/* Card 3: Desarrollo Conjunto */}
              <AnimatedSection animation="fade-left" delay={0.3}>
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-8 h-full">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background:
                        "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center font-['Inter']">
                    {t("benefits.growth.title")}
                  </h3>
                  <p className="text-gray-600 text-center font-['Inter']">
                    {t("benefits.growth.description")}
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="provider-form" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <AnimatedSection animation="fade-up">
                <ProviderForm locale={locale} />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20 bg-[#F7F9FC]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <AnimatedSection animation="fade-up">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 font-['Inter']">
                  {t("requirements.title")}
                </h2>
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12">
                  <ul className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <li key={item} className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1"
                          style={{ backgroundColor: "#fce7f3" }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="#d50058"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-lg font-['Inter']">
                          {t(`requirements.item${item}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA Section - Style like Certificaciones */}
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
              <ScrollToFormButton className="inline-flex items-center gap-2 bg-white text-[#d50058] px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg font-['Inter'] group">
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
              </ScrollToFormButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
