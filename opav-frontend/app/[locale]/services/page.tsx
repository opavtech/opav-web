/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { getServicios } from "@/lib/strapi";
import DownloadButton from "./DownloadButton";
import ServicesHero from "./_components/ServicesHero";
import Service3DCard from "./_components/Service3DCard";
import BSInteractiveCard from "./_components/BSInteractiveCard";
import AnimatedCounters from "./_components/AnimatedCounters";
import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  return {
    title:
      locale === "es"
        ? "Servicios de Administración de Propiedades | OPAV y B&S Facilities"
        : "Property Management Services | OPAV & B&S Facilities",
    description:
      locale === "es"
        ? "Servicios especializados en administración de propiedades, facilities management y gerencia de edificios en Colombia. Soluciones integrales OPAV y B&S para empresas."
        : "Specialized services in property management, facilities management and building administration in Colombia. Comprehensive OPAV and B&S solutions for companies.",
    keywords:
      locale === "es"
        ? "administración propiedades Colombia, facilities management, gerencia edificios, servicios corporativos, mantenimiento edificios, gestión inmobiliaria, OPAV, B&S Facilities"
        : "property management Colombia, facilities management, building administration, corporate services, building maintenance, real estate management, OPAV, B&S Facilities",
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
      canonical: `${baseUrl}/${locale}/services`,
      languages: {
        es: `${baseUrl}/es/services`,
        en: `${baseUrl}/en/services`,
      },
    },
    openGraph: {
      title:
        locale === "es"
          ? "Servicios - OPAV y B&S Facilities"
          : "Services - OPAV & B&S Facilities",
      description:
        locale === "es"
          ? "Soluciones profesionales en administración de propiedades y facilities management para empresas en Colombia"
          : "Professional solutions in property management and facilities management for companies in Colombia",
      url: `${baseUrl}/${locale}/services`,
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
          ? "Servicios - OPAV y B&S Facilities"
          : "Services - OPAV & B&S Facilities",
      description:
        locale === "es"
          ? "Soluciones profesionales en administración de propiedades y facilities management"
          : "Professional property management and facilities management solutions",
    },
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("services");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  // Obtener servicios desde Strapi
  let serviciosOPAV: any[] = [];
  let serviciosBS: any[] = [];
  let hasError = false;

  try {
    const response = await getServicios(locale);
    const servicios = response.data || [];

    // Separar por categoría y sanitizar HTML
    serviciosOPAV = servicios
      .filter(
        (s: any) =>
          s.categoria === "gerencia_edificios" ||
          s.categoria === "administracion_corporativa",
      )
      .map((s: any) => ({
        ...s,
        descripcion: s.descripcion ? sanitizeHtml(s.descripcion) : "",
        beneficios: s.beneficios ? sanitizeHtml(s.beneficios) : "",
      }));

    serviciosBS = servicios
      .filter((s: any) => s.categoria === "facilities")
      .map((s: any) => ({
        ...s,
        descripcion: s.descripcion ? sanitizeHtml(s.descripcion) : "",
        beneficios: s.beneficios ? sanitizeHtml(s.beneficios) : "",
      }));
  } catch (error) {
    console.error("Error fetching servicios:", error);
    hasError = true;
  }

  // Schema.org structured data for Services
  const structuredData = [
    // Organization offering services
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "OPAV SAS",
      url: baseUrl,
      logo: `${baseUrl}/images/logos/opav-logo.png`,
      description:
        locale === "es"
          ? "Empresa líder en administración de propiedades y facilities management en Colombia"
          : "Leading company in property management and facilities management in Colombia",
      areaServed: {
        "@type": "Country",
        name: "Colombia",
      },
      serviceType: ["Property Management", "Facilities Management"],
    },
    // Service catalog
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Property Management",
      provider: {
        "@type": "Organization",
        name: "OPAV SAS",
      },
      areaServed: {
        "@type": "Country",
        name: "Colombia",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name:
          locale === "es"
            ? "Servicios de Administración"
            : "Administration Services",
        itemListElement: serviciosOPAV.map((servicio, index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: servicio.nombre,
            description: servicio.descripcion?.replace(/<[^>]*>/g, "") || "",
          },
        })),
      },
    },
    // Breadcrumbs
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
          name: locale === "es" ? "Servicios" : "Services",
          item: `${baseUrl}/${locale}/services`,
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

      {/* Hero Section with Particles */}
      <ServicesHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      {/* OPAV Services - 3D Flip Cards */}
      <section
        className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50"
        aria-labelledby="opav-services-heading"
        id="opav-services"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/images/logos/opav-logo.png"
                  alt="OPAV - Administración de Propiedades"
                  width={240}
                  height={96}
                  className="h-20 md:h-24 w-auto object-contain"
                  priority={false}
                />
              </div>
              <h2 id="opav-services-heading" className="sr-only">
                {locale === "es" ? "Servicios OPAV" : "OPAV Services"}
              </h2>
              <p className="text-xl text-gray-600 font-['Inter'] font-light max-w-3xl mx-auto leading-relaxed">
                {t("opav.subtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 mb-12 md:mb-16">
              {hasError ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {locale === "es"
                      ? "Error al cargar los servicios"
                      : "Error loading services"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-magenta-600 hover:text-magenta-700 font-medium"
                  >
                    {locale === "es" ? "Intentar nuevamente" : "Try again"}
                  </button>
                </div>
              ) : serviciosOPAV.length > 0 ? (
                serviciosOPAV.map((servicio: any, index: number) => (
                  <Service3DCard
                    key={servicio.id}
                    servicio={servicio}
                    index={index}
                    color="magenta"
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  {t("opav.noServices")}
                </div>
              )}
            </div>

            {/* OPAV Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/casos-exito?filter=OPAV`}
                className="px-8 py-4 md:px-10 md:py-5 rounded-full font-bold font-['Inter'] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-magenta-300"
                style={{
                  background:
                    "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(213, 0, 88, 0.3)",
                  minHeight: "48px",
                  minWidth: "48px",
                }}
                aria-label={
                  locale === "es"
                    ? "Ver casos de éxito de OPAV"
                    : "View OPAV success cases"
                }
              >
                {t("opav.buttons.cases")}
              </Link>
              <Link
                href={`/${locale}/rfp/opav`}
                className="px-8 py-4 md:px-10 md:py-5 rounded-full font-bold font-['Inter'] bg-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-magenta-300"
                style={{
                  border: "2px solid #d50058",
                  color: "#d50058",
                  boxShadow: "0 5px 20px rgba(213, 0, 88, 0.15)",
                  minHeight: "48px",
                  minWidth: "48px",
                }}
              >
                {t("opav.buttons.rfp")}
              </Link>
              <DownloadButton
                type="OPAV"
                className="px-8 py-4 md:px-10 md:py-5 rounded-full font-bold font-['Inter'] bg-white transition-all duration-300 transform hover:scale-105 border-2 border-[#d50058] text-[#d50058] shadow-[0_5px_20px_rgba(213,0,88,0.15)] focus:outline-none focus:ring-4 focus:ring-magenta-300"
                style={{ minHeight: "48px", minWidth: "48px" }}
              >
                {t("opav.buttons.brochure")}
              </DownloadButton>
            </div>
          </div>
        </div>
      </section>

      {/* B&S Services - Interactive Stack Cards */}
      <section
        className="py-16 md:py-24 bg-linear-to-b from-gray-50 to-white"
        aria-labelledby="bs-services-heading"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/images/logos/bs-facilities-logo-hor.png"
                  alt="B&S Facilities - Facilities Management"
                  width={320}
                  height={80}
                  className="h-16 md:h-20 w-auto object-contain"
                  priority={false}
                />
              </div>
              <h2 id="bs-services-heading" className="sr-only">
                {locale === "es"
                  ? "Servicios B&S Facilities"
                  : "B&S Facilities Services"}
              </h2>
              <p className="text-xl text-gray-600 font-['Inter'] font-light max-w-3xl mx-auto leading-relaxed">
                {t("bs.subtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 mb-12 md:mb-16">
              {hasError ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {locale === "es"
                      ? "Error al cargar los servicios"
                      : "Error loading services"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    {locale === "es" ? "Intentar nuevamente" : "Try again"}
                  </button>
                </div>
              ) : serviciosBS.length > 0 ? (
                serviciosBS.map((servicio: any, index: number) => (
                  <BSInteractiveCard
                    key={servicio.id}
                    servicio={servicio}
                    index={index}
                    totalCards={serviciosBS.length}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  {t("bs.noServices")}
                </div>
              )}
            </div>

            {/* B&S Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/casos-exito?filter=B%26S`}
                className="px-8 py-4 md:px-10 md:py-5 rounded-full font-bold font-['Inter'] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                style={{
                  background:
                    "linear-gradient(135deg, #00acc8 0%, #0088aa 100%)",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(0, 172, 200, 0.3)",
                  minHeight: "48px",
                  minWidth: "48px",
                }}
                aria-label={
                  locale === "es"
                    ? "Ver casos de éxito de B&S Facilities"
                    : "View B&S Facilities success cases"
                }
              >
                {t("bs.buttons.cases")}
              </Link>
              <Link
                href={`/${locale}/rfp/bs`}
                className="px-8 py-4 md:px-10 md:py-5 rounded-full font-bold font-['Inter'] bg-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                style={{
                  border: "2px solid #00acc8",
                  color: "#00acc8",
                  boxShadow: "0 5px 20px rgba(0, 172, 200, 0.15)",
                  minHeight: "48px",
                  minWidth: "48px",
                }}
              >
                {t("bs.buttons.rfp")}
              </Link>
              <DownloadButton
                type="B&S"
                className="px-8 py-4 md:px-10 md:py-5 rounded-full font-bold font-['Inter'] bg-white transition-all duration-300 transform hover:scale-105 border-2 border-[#00acc8] text-[#00acc8] shadow-[0_5px_20px_rgba(0,172,200,0.15)] focus:outline-none focus:ring-4 focus:ring-cyan-300"
                style={{ minHeight: "48px", minWidth: "48px" }}
              >
                {t("bs.buttons.brochure")}
              </DownloadButton>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Animated Counters */}
      <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light text-center text-gray-900 mb-6 font-['Inter'] tracking-tight">
              {t("why.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 text-center mb-12 md:mb-16 font-['Inter'] font-light max-w-3xl mx-auto leading-relaxed">
              {t("why.subtitle")}
            </p>

            {/* Animated Counters */}
            <div className="mb-12 md:mb-20">
              <AnimatedCounters
                counters={[
                  {
                    value: 8,
                    suffix: "+",
                    label: t("why.counters.experience"),
                    icon: "🏆",
                  },
                  {
                    value: 36,
                    suffix: "+",
                    label: t("why.counters.projects"),
                    icon: "📊",
                  },
                  {
                    value: 92,
                    suffix: "%",
                    label: t("why.counters.satisfaction"),
                    icon: "⭐",
                  },
                ]}
              />
            </div>

            {/* Reasons Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-6 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-5xl shrink-0">✓</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Inter']">
                    {t("why.reason1.title")}
                  </h3>
                  <p className="text-gray-600 font-['Inter'] leading-relaxed">
                    {t("why.reason1.description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-5xl shrink-0">✓</div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 font-['Inter']">
                      {t("why.reason2.title")}
                    </h3>
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-sm">
                      {t("why.isoBadge")}
                    </span>
                  </div>
                  <p className="text-gray-600 font-['Inter'] leading-relaxed">
                    {t("why.reason2.description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-5xl shrink-0">✓</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Inter']">
                    {t("why.reason3.title")}
                  </h3>
                  <p className="text-gray-600 font-['Inter'] leading-relaxed">
                    {t("why.reason3.description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-5xl shrink-0">✓</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Inter']">
                    {t("why.reason4.title")}
                  </h3>
                  <p className="text-gray-600 font-['Inter'] leading-relaxed">
                    {t("why.reason4.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-20 md:py-24 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #d50058 0%, #a0003d 50%, #d50058 100%)",
        }}
        aria-labelledby="services-cta-section-title"
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
              id="services-cta-section-title"
              className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 font-['Inter'] tracking-tight leading-tight"
            >
              {t("cta.title")}
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/90 font-light leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-white text-[#d50058] px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg font-['Inter'] group"
              aria-label={
                locale === "es"
                  ? "Contactar para optimizar gestión de propiedades"
                  : "Contact to optimize property management"
              }
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
