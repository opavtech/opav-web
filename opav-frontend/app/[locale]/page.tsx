import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AnimatedSection from "@/components/AnimatedSection";
import ShimmerButton from "@/components/ShimmerButton";
import {
  getCertificaciones,
  getCasosExitoDestacados,
  getBlogPostsDestacados,
  getStrapiMedia,
} from "@/lib/strapi";
import { getLocalizedPath } from "@/lib/routes";
import type { Metadata } from "next";

// Dynamic imports for below-the-fold components
const CorporateTestimonials = dynamic(
  () => import("@/components/CorporateTestimonials"),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />
    ),
    ssr: true,
  },
);

const SuccessCasesFilter = dynamic(
  () => import("@/components/SuccessCasesFilter"),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />
    ),
    ssr: true,
  },
);

const InsightsCarousel = dynamic(
  () => import("@/components/InsightsCarousel"),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-2xl" />
    ),
    ssr: true,
  },
);

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://opav.com.co";
  const currentUrl = `${baseUrl}/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "OPAV SAS" }],
    creator: "OPAV SAS",
    publisher: "OPAV SAS",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        "es-CO": `${baseUrl}/es`,
        "en-US": `${baseUrl}/en`,
        "x-default": `${baseUrl}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_CO" : "en_US",
      url: currentUrl,
      siteName: "OPAV SAS",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: `${baseUrl}/images/hero/hero-background.png`,
          width: 1200,
          height: 630,
          alt: "OPAV SAS - Administración de Propiedades y Facilities Management",
          type: "image/png",
        },
        {
          url: `${baseUrl}/images/og/opav-og-square.png`,
          width: 1200,
          height: 1200,
          alt: "OPAV SAS Logo",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [`${baseUrl}/images/hero/hero-background.png`],
      creator: "@opav_sas",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // TODO: Agregar código de verificación real de Google Search Console
    // verification: {
    //   google: "tu-codigo-de-verificacion",
    // },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations("home");

  // Obtener certificaciones desde Strapi
  let certificaciones = [];
  try {
    const response = await getCertificaciones(locale);
    certificaciones = response.data || [];
  } catch (error) {
    console.error("Error fetching certificaciones:", error);
  }

  // Obtener la primera certificación (ISO 9001)
  const certificacion = certificaciones.length > 0 ? certificaciones[0] : null;
  const logoUrl = certificacion?.logo
    ? getStrapiMedia(certificacion.logo.url)
    : null;

  // Obtener casos de éxito destacados desde Strapi
  let casosDestacados = [];
  try {
    const response = await getCasosExitoDestacados(locale);
    casosDestacados = response.data || [];
  } catch (error) {
    console.error("Error fetching casos destacados:", error);
  }

  // Helper: Extraer texto plano de richtext de Strapi v5
  const extractRichText = (richtext: any): string => {
    if (!richtext) return "";
    if (typeof richtext === "string") return richtext;
    if (Array.isArray(richtext)) {
      return richtext
        .map((block: any) => {
          if (block.type === "paragraph" && block.children) {
            return block.children
              .map((child: any) => child.text || "")
              .join("");
          }
          return "";
        })
        .join(" ")
        .trim();
    }
    return "";
  };

  // Obtener posts destacados del blog desde Strapi
  let blogPosts = [];
  try {
    const response = await getBlogPostsDestacados(locale);
    blogPosts = response.data || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <main className="min-h-screen">
      {/* Skip to main content link - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-gray-900 focus:px-6 focus:py-3 focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#d50058] focus:ring-offset-2"
      >
        {locale === "es"
          ? "Saltar al contenido principal"
          : "Skip to main content"}
      </a>

      <div id="main-content">
        {/* 1. Hero Section */}
        <section
          key={`hero-section-${locale}`}
          className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-24 md:py-32 overflow-hidden"
          aria-labelledby="hero-title"
          role="banner"
        >
          {/* Background Image */}
          <Image
            src="/images/hero/hero-background.png"
            alt="OPAV SAS - Soluciones integrales en administración de propiedades y facilities management en Colombia"
            fill
            className="object-cover"
            priority
            loading="eager"
            fetchPriority="high"
            quality={90}
            sizes="100vw"
          />

          {/* Background overlay - improved for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Metrics */}
              <div className="space-y-8 -mt-8">
                <div className="space-y-4">
                  {/*Título blanco */}
                  <h1
                    id="hero-title"
                    className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg text-white hero-title-copperplate"
                  >
                    {t("hero.title")}
                  </h1>

                  <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
                    {t("hero.subtitle")}
                  </p>
                </div>

                {/* Key Metrics */}
                <div
                  className="grid grid-cols-3 gap-6 pt-8"
                  role="region"
                  aria-label="Métricas principales de OPAV"
                >
                  <div className="text-center">
                    <AnimatedCounter
                      end={8}
                      suffix=""
                      className="text-4xl font-bold text-white mb-2 drop-shadow-md"
                      ariaLabel="8 años de experiencia"
                    />
                    <div className="text-sm text-white/80">
                      {t("hero.metric1")}
                    </div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      end={36}
                      suffix=""
                      className="text-4xl font-bold text-white mb-2 drop-shadow-md"
                      ariaLabel="36 proyectos exitosos"
                    />
                    <div className="text-sm text-white/80">
                      {t("hero.metric2")}
                    </div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      end={210.45}
                      suffix="K"
                      className="text-4xl font-bold text-white mb-2 drop-shadow-md"
                      ariaLabel="210.450 metros cuadrados administrados"
                    />
                    <div className="text-sm text-white/80">
                      {t("hero.metric3")}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href={`/${locale}/rfp`}
                    className="inline-block bg-[#d50058]/90 backdrop-blur-md text-white px-8 py-4 rounded-lg font-semibold border border-[#d50058]/30 hover:bg-[#d50058] hover:border-[#d50058]/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    aria-label="Solicitar propuesta de servicios OPAV"
                  >
                    {t("hero.cta")}
                  </Link>
                </div>
              </div>

              {/* Right: ISO Certification */}
              <div
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500"
                role="complementary"
                aria-labelledby="iso-certification-title"
              >
                <div className="flex items-start gap-4">
                  <div className="text-6xl" aria-hidden="true"></div>
                  <div>
                    <h3
                      id="iso-certification-title"
                      className="text-2xl font-bold mb-2"
                    >
                      {t("hero.isoTitle")}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {t("hero.isoDescription")}
                    </p>
                    <Link
                      href={getLocalizedPath(
                        "certifications",
                        locale as "es" | "en",
                      )}
                      className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      aria-label="Ver detalles de certificaciones ISO de OPAV"
                    >
                      {t("hero.isoLink")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Company Section - OPAV & B&S */}
        <section className="py-20 bg-[#F7F9FC]" aria-labelledby="company-title">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2
                id="company-title"
                className="text-4xl font-bold text-gray-900 mb-4 font-['Inter']"
              >
                {t("company.title")}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Inter']">
                {t("company.intro")}
              </p>
            </div>

            {/* OPAV */}
            <div className="max-w-6xl mx-auto mb-12">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="mb-6">
                      <Image
                        src="/images/logos/opav-logo.png"
                        alt="OPAV SAS"
                        width={180}
                        height={60}
                        loading="lazy"
                        className="h-auto w-auto max-h-12 object-contain"
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06))",
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1 font-['Inter']">
                      {t("company.opav.subtitle1")}
                    </h3>
                    <h4 className="text-lg text-gray-600 mb-8 font-medium font-['Inter']">
                      {t("company.opav.subtitle2")}
                    </h4>

                    <div className="flex flex-wrap gap-3 mb-8">
                      <span
                        className="relative px-4 py-2 rounded-full text-sm font-medium font-['Inter'] text-primary-700 backdrop-blur-md border-2 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(213, 0, 88, 0.1) 0%, rgba(213, 0, 88, 0.15) 50%, rgba(213, 0, 88, 0.08) 100%)",
                          borderColor: "rgba(213, 0, 88, 0.4)",
                          boxShadow:
                            "0 8px 16px rgba(213, 0, 88, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(213, 0, 88, 0.1)",
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-60"></span>
                        <span className="absolute inset-0 bg-gradient-to-tl from-primary-200/20 via-transparent to-transparent"></span>
                        <span className="relative z-10">
                          {t("company.opav.badge1")}
                        </span>
                      </span>
                      <span
                        className="relative px-4 py-2 rounded-full text-sm font-medium font-['Inter'] text-primary-700 backdrop-blur-md border-2 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(213, 0, 88, 0.1) 0%, rgba(213, 0, 88, 0.15) 50%, rgba(213, 0, 88, 0.08) 100%)",
                          borderColor: "rgba(213, 0, 88, 0.4)",
                          boxShadow:
                            "0 8px 16px rgba(213, 0, 88, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(213, 0, 88, 0.1)",
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-60"></span>
                        <span className="absolute inset-0 bg-gradient-to-tl from-primary-200/20 via-transparent to-transparent"></span>
                        <span className="relative z-10">
                          {t("company.opav.badge3")}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={getLocalizedPath(
                          "contact",
                          locale as "es" | "en",
                        )}
                        className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all duration-300 font-['Inter'] text-center"
                        style={{
                          backgroundColor: "#d50058",
                          color: "#ffffff",
                        }}
                      >
                        Solicitar asesoría
                      </Link>
                      <Link
                        href={getLocalizedPath(
                          "company",
                          locale as "es" | "en",
                        )}
                        className="inline-flex items-center justify-center border-2 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-300 font-['Inter'] text-center group"
                        style={{
                          borderColor: "#d50058",
                          color: "#d50058",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        Conocer más
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/company/opav-showcase.jpg"
                      alt="OPAV - Administración de Propiedades"
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 600px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* B&S Facilities */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="mb-6">
                      <Image
                        src="/images/logos/bs-facilities-logo-hor.png"
                        alt="B&S Facilities"
                        width={180}
                        loading="lazy"
                        height={60}
                        className="h-auto w-auto max-h-12 object-contain"
                        style={{
                          filter:
                            "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06)) saturate(0.7)",
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1 font-['Inter']">
                      {t("company.bs.subtitle1")}
                    </h3>
                    <h4 className="text-lg text-gray-600 mb-8 font-medium font-['Inter']">
                      {t("company.bs.subtitle2")}
                    </h4>

                    <div className="flex flex-wrap gap-3 mb-8">
                      <span
                        className="relative px-4 py-2 rounded-full text-sm font-medium font-['Inter'] backdrop-blur-md border-2 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0, 172, 200, 0.1) 0%, rgba(0, 172, 200, 0.15) 50%, rgba(0, 172, 200, 0.08) 100%)",
                          borderColor: "rgba(0, 172, 200, 0.4)",
                          color: "#006b7d",
                          boxShadow:
                            "0 8px 16px rgba(0, 172, 200, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(0, 172, 200, 0.1)",
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-60"></span>
                        <span className="absolute inset-0 bg-gradient-to-tl from-cyan-200/20 via-transparent to-transparent"></span>
                        <span className="relative z-10">
                          {t("company.bs.badge1")}
                        </span>
                      </span>
                      <span
                        className="relative px-4 py-2 rounded-full text-sm font-medium font-['Inter'] backdrop-blur-md border-2 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0, 172, 200, 0.1) 0%, rgba(0, 172, 200, 0.15) 50%, rgba(0, 172, 200, 0.08) 100%)",
                          borderColor: "rgba(0, 172, 200, 0.4)",
                          color: "#006b7d",
                          boxShadow:
                            "0 8px 16px rgba(0, 172, 200, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(0, 172, 200, 0.1)",
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-60"></span>
                        <span className="absolute inset-0 bg-gradient-to-tl from-cyan-200/20 via-transparent to-transparent"></span>
                        <span className="relative z-10">
                          {t("company.bs.badge2")}
                        </span>
                      </span>
                      <span
                        className="relative px-4 py-2 rounded-full text-sm font-medium font-['Inter'] backdrop-blur-md border-2 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0, 172, 200, 0.1) 0%, rgba(0, 172, 200, 0.15) 50%, rgba(0, 172, 200, 0.08) 100%)",
                          borderColor: "rgba(0, 172, 200, 0.4)",
                          color: "#006b7d",
                          boxShadow:
                            "0 8px 16px rgba(0, 172, 200, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(0, 172, 200, 0.1)",
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-60"></span>
                        <span className="absolute inset-0 bg-gradient-to-tl from-cyan-200/20 via-transparent to-transparent"></span>
                        <span className="relative z-10">
                          {t("company.bs.badge3")}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={getLocalizedPath(
                          "contact",
                          locale as "es" | "en",
                        )}
                        className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:scale-105 hover:shadow-lg transition-all duration-300 font-['Inter'] text-center"
                      >
                        Solicitar cotización
                      </Link>
                      <Link
                        href={getLocalizedPath(
                          "company",
                          locale as "es" | "en",
                        )}
                        className="inline-flex items-center justify-center border-2 border-gray-800 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-['Inter'] text-center group"
                      >
                        Conocer más
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-8">
                    <Image
                      src="/images/logos/bs-facilities-logo-hor.png"
                      alt="B&S Facilities - Facilities Management"
                      width={400}
                      height={200}
                      loading="lazy"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Certified Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Diagonal Split Background */}
          <div className="absolute inset-0 bg-white"></div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, transparent 0%, transparent 50%, #F7F9FC 50%, #F7F9FC 100%)",
            }}
          ></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  {/* Badge ISO con estilos inline */}
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
                    }}
                  >
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="#ffffff"
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

                  {/* Título */}
                  <h2 className="text-5xl font-extrabold text-gray-900 mb-6 font-['Inter'] leading-tight">
                    {t("certification.title")}
                  </h2>

                  {/* Descripción */}
                  <p className="text-lg text-gray-600 mb-10 leading-relaxed font-['Inter']">
                    {t("certification.description")}
                  </p>

                  {/* Beneficios con checkmarks */}
                  <div className="space-y-4 mb-10">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: "#d1fae5" }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="#059669"
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
                      <span className="text-gray-700 font-medium font-['Inter']">
                        {t("certification.benefit1")}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: "#d1fae5" }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="#059669"
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
                      <span className="text-gray-700 font-medium font-['Inter']">
                        {t("certification.benefit2")}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: "#d1fae5" }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="#059669"
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
                      <span className="text-gray-700 font-medium font-['Inter']">
                        {t("certification.benefit3")}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={getLocalizedPath(
                      "certifications",
                      locale as "es" | "en",
                    )}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 font-['Inter'] group"
                    style={{
                      border: "2px solid #d50058",
                      color: "#d50058",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {t("certification.viewDetails")}
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Certificado - Imagen desde Strapi */}
                <div className="relative group">
                  <div
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
                    }}
                  ></div>
                  <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
                    {logoUrl ? (
                      <div className="h-[350px] rounded-xl flex items-center justify-center p-4">
                        <div className="relative w-full h-full">
                          <Image
                            src={logoUrl}
                            alt={
                              certificacion?.nombre || "Certificación ISO 9001"
                            }
                            fill
                            loading="lazy"
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="h-[350px] rounded-xl flex flex-col items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                        }}
                      >
                        <div className="text-center">
                          <div
                            className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
                            }}
                          >
                            <svg
                              className="w-14 h-14"
                              fill="none"
                              stroke="#d50058"
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
                          <h3 className="text-3xl font-bold text-gray-800 mb-3 font-['Inter']">
                            ISO 9001:2015
                          </h3>
                          <p className="text-lg text-gray-600 font-semibold font-['Inter']">
                            Certificación de Calidad
                          </p>
                          <p className="text-sm text-gray-500 mt-6 font-['Inter']">
                            Sistema de Gestión de Calidad
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Corporate Testimonials Section - European Premium Style */}
        <section className="relative py-32 overflow-hidden">
          {/* Soft Linear Corporate Strata Background */}
          <div className="absolute inset-0 z-0">
            {/* Base layer - Pure white */}
            <div className="absolute inset-0 bg-white"></div>

            {/* Subtle diagonal gradient overlay - Very soft corporate tones */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(165deg, #F9FAFB 0%, #F9FAFB 45%, #F3F5F7 55%, #F3F5F7 100%)",
              }}
            ></div>

            {/* Subtle abstract pattern - ultra minimal */}
            <div className="absolute inset-0 opacity-[0.015]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, #9CA3AF 30px, #9CA3AF 31px)`,
                }}
              />
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section Header - Corporate & Serious */}
            <AnimatedSection>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Inter'] tracking-tight">
                  {t("testimonials.title")}
                </h2>
                <p className="text-lg text-gray-600 font-['Inter'] font-light">
                  {t("testimonials.subtitle")}
                </p>
              </div>
            </AnimatedSection>

            {/* Corporate Testimonials Carousel */}
            <AnimatedSection delay={0.2}>
              <CorporateTestimonials
                testimonials={[
                  {
                    name: t("testimonials.employees.0.name"),
                    position: t("testimonials.employees.0.position"),
                    quote: t("testimonials.employees.0.quote"),
                  },
                  {
                    name: t("testimonials.employees.1.name"),
                    position: t("testimonials.employees.1.position"),
                    quote: t("testimonials.employees.1.quote"),
                  },
                  {
                    name: t("testimonials.employees.2.name"),
                    position: t("testimonials.employees.2.position"),
                    quote: t("testimonials.employees.2.quote"),
                  },
                ]}
              />
            </AnimatedSection>

            {/* Institutional Phrase - Divider */}
            <AnimatedSection delay={0.4}>
              <div className="text-center mt-20 mb-16">
                <p className="text-2xl md:text-3xl font-light text-gray-800 font-['Inter'] italic">
                  &quot;{t("testimonials.institutionalPhrase")}&quot;
                </p>
              </div>
            </AnimatedSection>

            {/* Premium CTA Button with Shimmer Effect */}
            <AnimatedSection delay={0.5}>
              <div className="text-center">
                <ShimmerButton
                  href={getLocalizedPath("jobs", locale as "es" | "en")}
                >
                  <span className="relative z-10">{t("testimonials.cta")}</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </ShimmerButton>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* 5. Success Section - European Corporate Style with Premium Background */}
        <section className="relative py-28 overflow-hidden">
          {/* 4-Layer Premium Background System */}
          {/* Layer 1: Base white */}
          <div className="absolute inset-0 bg-white"></div>

          {/* Layer 2: Subtle gradient white → light gray */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(165deg, #ffffff 0%, #f9fafb 100%)",
            }}
          ></div>

          {/* Layer 3: Ultra-subtle geometric pattern (European style) */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "url(/patterns/geometric-noise.png)",
              backgroundSize: "64px 64px",
              backgroundRepeat: "repeat",
            }}
          ></div>

          {/* Layer 4: Magenta glow at bottom (corporate accent) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(213, 0, 88, 0.04) 80%, rgba(213, 0, 88, 0.07) 100%)",
            }}
          ></div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Header - Centered European Minimal */}
            <AnimatedSection>
              <div className="text-center mb-20 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 font-['Inter'] tracking-tight">
                  {t("success.title")}
                </h2>
                <p className="text-lg text-gray-600 font-['Inter'] font-light">
                  {t("success.subtitle")}
                </p>
              </div>
            </AnimatedSection>

            {/* Cases Grid */}
            <div className="max-w-7xl mx-auto">
              {casosDestacados.length > 0 ? (
                <>
                  <SuccessCasesFilter
                    cases={casosDestacados.map((caso: any) => {
                      return {
                        id: caso.id,
                        nombre: caso.nombre || caso.titulo || "Sin título",
                        empresa: caso.empresa,
                        ubicacion:
                          caso.ubicacion || caso.ciudad || "Sin ubicación",
                        descripcion: extractRichText(caso.descripcion),
                        Slug: caso.Slug,
                        imagenPrincipal: caso.imagenPrincipal
                          ? {
                              url:
                                getStrapiMedia(caso.imagenPrincipal.url) || "",
                              alternativeText:
                                caso.imagenPrincipal.alternativeText,
                            }
                          : undefined,
                      };
                    })}
                    locale={locale}
                    translations={{
                      opavTitle: t("success.filterOpav"),
                      opavDescription: t("success.opavDescription"),
                      bsTitle: t("success.filterBs"),
                      bsDescription: t("success.bsDescription"),
                      all: t("success.filterAll"),
                    }}
                  />

                  {/* CTA Button - European Style */}
                  <div className="mt-16">
                    <AnimatedSection delay={0.4}>
                      <div className="text-center">
                        <Link
                          href={getLocalizedPath(
                            "successCases",
                            locale as "es" | "en",
                          )}
                          className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105 font-['Inter']"
                          style={{
                            background:
                              "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
                            color: "#ffffff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        >
                          <span>{t("success.viewAll")}</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </Link>
                      </div>
                    </AnimatedSection>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-['Inter']">
                    No hay casos de éxito disponibles en este momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. Insights Section - Premium Blog Carousel */}
        {blogPosts && blogPosts.length > 0 && (
          <section className="relative py-28 overflow-hidden">
            {/* 4-Layer Premium Background System */}
            {/* Layer 1: Base color */}
            <div
              className="absolute inset-0 -z-10"
              style={{ background: "#F7F9FC" }}
            ></div>

            {/* Layer 2: Subtle gradient */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "linear-gradient(165deg, #F7F9FC 0%, #F0F2F6 100%)",
              }}
            ></div>

            {/* Layer 3: Ultra-subtle geometric pattern */}
            <div
              className="absolute inset-0 opacity-[0.008] -z-10"
              style={{
                backgroundImage: "url('/patterns/geometric-noise.png')",
                backgroundSize: "140px 140px",
                backgroundRepeat: "repeat",
              }}
            ></div>

            {/* Layer 4: Gradient fade en bordes laterales */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(to right, rgba(247, 249, 252, 0.6) 0%, transparent 15%, transparent 85%, rgba(247, 249, 252, 0.6) 100%)",
              }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
              {/* Header */}
              <AnimatedSection>
                <div className="text-center mb-2">
                  {/* Micro-badge Editorial */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="w-6 h-px bg-gray-300"></span>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-['Inter'] font-medium">
                      {t("insights.badge")}
                    </span>
                    <span className="w-6 h-px bg-gray-300"></span>
                  </div>

                  <h2
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Inter']"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {t("insights.title")}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-['Inter'] font-light">
                    {t("insights.subtitle")}
                  </p>
                  <p className="text-sm text-gray-500 mt-3 font-['Inter'] font-light italic">
                    {t("insights.updateFrequency")}
                  </p>
                </div>
              </AnimatedSection>

              {/* Carrusel de posts */}
              <InsightsCarousel posts={blogPosts} locale={locale} />
            </div>
          </section>
        )}

        {/* Structured Data - JSON-LD for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `https://opav.com.co/#organization`,
                  name: "OPAV SAS",
                  url: "https://opav.com.co",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://opav.com.co/images/logos/opav-logo.png",
                    width: 120,
                    height: 40,
                  },
                  description:
                    locale === "es"
                      ? "Líder en administración de propiedades corporativas y facilities management en Colombia"
                      : "Leading property management and facilities management company in Colombia",
                  sameAs: [
                    "https://www.linkedin.com/company/opav",
                    "https://www.facebook.com/opav",
                    "https://www.instagram.com/opav",
                    "https://twitter.com/opav_sas",
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "CO",
                    addressLocality: "Bogotá",
                    addressRegion: "Cundinamarca",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    email: "info@opav.com.co",
                    availableLanguage: ["Spanish", "English"],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `https://opav.com.co/#website`,
                  url: "https://opav.com.co",
                  name: "OPAV SAS",
                  publisher: {
                    "@id": "https://opav.com.co/#organization",
                  },
                  inLanguage: locale === "es" ? "es-CO" : "en-US",
                },
                {
                  "@type": "WebPage",
                  "@id": `https://opav.com.co/${locale}#webpage`,
                  url: `https://opav.com.co/${locale}`,
                  name:
                    locale === "es"
                      ? "OPAV SAS - Administración de Propiedades y Facilities Management en Colombia"
                      : "OPAV SAS - Property Management & Facilities Management in Colombia",
                  isPartOf: {
                    "@id": "https://opav.com.co/#website",
                  },
                  about: {
                    "@id": "https://opav.com.co/#organization",
                  },
                  description:
                    locale === "es"
                      ? "Líder en administración de propiedades corporativas y facilities management en Colombia. Más de 15 años de experiencia, certificación ISO 9001."
                      : "Leading property management and facilities management company in Colombia. 15+ years of experience, ISO 9001 certified.",
                  inLanguage: locale === "es" ? "es-CO" : "en-US",
                },
                {
                  "@type": "Service",
                  serviceType:
                    locale === "es"
                      ? "Administración de Propiedades"
                      : "Property Management",
                  provider: {
                    "@id": "https://opav.com.co/#organization",
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
                        : "Management Services",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name:
                            locale === "es"
                              ? "Administración Integral"
                              : "Comprehensive Administration",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name:
                            locale === "es"
                              ? "Facilities Management"
                              : "Facilities Management",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name:
                            locale === "es"
                              ? "Mantenimiento Preventivo"
                              : "Preventive Maintenance",
                        },
                      },
                    ],
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: locale === "es" ? "Inicio" : "Home",
                  item: `https://opav.com.co/${locale}`,
                },
              ],
            }),
          }}
        />

        {/* JSON-LD FAQPage Schema - Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity:
                locale === "es"
                  ? [
                      {
                        "@type": "Question",
                        name: "¿Qué servicios ofrece OPAV en administración de propiedades?",
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: "OPAV ofrece administración integral de propiedades corporativas, gestión de arrendamientos, asesoría inmobiliaria, facilities management, mantenimiento preventivo y correctivo, y gestión de proveedores. Contamos con certificación ISO 9001:2015.",
                        },
                      },
                      {
                        "@type": "Question",
                        name: "¿En qué ciudades de Colombia opera OPAV?",
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: "OPAV opera principalmente en Bogotá y las principales ciudades de Colombia. Administramos más de 100,000 m² de propiedades corporativas en todo el país.",
                        },
                      },
                      {
                        "@type": "Question",
                        name: "¿Qué diferencia a OPAV de otras empresas de administración?",
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: "OPAV cuenta con más de 15 años de experiencia, certificación ISO 9001:2015, y un enfoque integral que combina administración de propiedades (OPAV) con facilities management (B&S Facilities) para ofrecer soluciones completas.",
                        },
                      },
                    ]
                  : [
                      {
                        "@type": "Question",
                        name: "What property management services does OPAV offer?",
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: "OPAV offers comprehensive corporate property management, lease management, real estate consulting, facilities management, preventive and corrective maintenance, and vendor management. We are ISO 9001:2015 certified.",
                        },
                      },
                      {
                        "@type": "Question",
                        name: "In which cities in Colombia does OPAV operate?",
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: "OPAV operates primarily in Bogotá and major cities throughout Colombia. We manage over 100,000 m² of corporate properties nationwide.",
                        },
                      },
                      {
                        "@type": "Question",
                        name: "What sets OPAV apart from other property management companies?",
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: "OPAV has over 15 years of experience, ISO 9001:2015 certification, and a comprehensive approach combining property management (OPAV) with facilities management (B&S Facilities) to deliver complete solutions.",
                        },
                      },
                    ],
            }),
          }}
        />

        {/* JSON-LD LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://opav.com.co/#business",
              name: "OPAV SAS",
              alternateName: "OPAV - Administración de Propiedades",
              image: [
                "https://opav.com.co/images/logos/opav-logo.png",
                "https://opav.com.co/images/hero/hero-background.png",
              ],
              description:
                locale === "es"
                  ? "Empresa líder en administración de propiedades corporativas y facilities management en Colombia. Más de 15 años de experiencia y certificación ISO 9001:2015."
                  : "Leading company in corporate property management and facilities management in Colombia. Over 15 years of experience and ISO 9001:2015 certification.",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Carrera 7",
                addressLocality: "Bogotá",
                addressRegion: "Cundinamarca",
                postalCode: "110111",
                addressCountry: "CO",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 4.6097,
                longitude: -74.0817,
              },
              email: "info@opav.com.co",
              url: "https://opav.com.co",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "08:00",
                  closes: "18:00",
                },
              ],
              areaServed: {
                "@type": "Country",
                name: "Colombia",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name:
                  locale === "es"
                    ? "Servicios de Administración"
                    : "Management Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name:
                        locale === "es"
                          ? "Administración de Propiedades"
                          : "Property Management",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Facilities Management",
                    },
                  },
                ],
              },
              sameAs: [
                "https://www.linkedin.com/company/opav-sas",
                "https://www.instagram.com/opav_sas",
                "https://www.facebook.com/opav.sas",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "50",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />
      </div>
    </main>
  );
}
