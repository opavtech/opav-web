import { getTranslations } from "next-intl/server";
import { getCasoExito, getCasosExito, getStrapiMedia } from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Client Components - Critical (no lazy)
import CaseHero from "./_components/CaseHero";
import ReadingProgress from "./_components/ReadingProgress";

// Client Components - Lazy loaded
const JourneySection = dynamic(() => import("./_components/JourneySection"), {
  loading: () => <div className="min-h-[400px] bg-gray-50 animate-pulse" />,
});
const ProjectDetails = dynamic(() => import("./_components/ProjectDetails"), {
  loading: () => <div className="min-h-[400px] bg-gray-50 animate-pulse" />,
});
const ImageGallery = dynamic(() => import("./_components/ImageGalleryLazy"));
const RelatedCases = dynamic(() => import("./_components/RelatedCases"), {
  loading: () => <div className="min-h-[500px] bg-white animate-pulse" />,
});
const BackNavigation = dynamic(() => import("./_components/BackNavigation"), {
  loading: () => <div className="h-20 bg-gray-50" />,
});

interface CasoExitoPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generar metadata dinámica para SEO
export async function generateMetadata({
  params,
}: CasoExitoPageProps): Promise<Metadata> {
  const { locale, slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  try {
    const response = await getCasoExito(slug, locale);
    const caso = response.data?.[0];

    if (!caso) {
      return {
        title:
          locale === "es"
            ? "Caso de Éxito no encontrado"
            : "Success Case Not Found",
      };
    }

    const title = `${caso.nombre} - ${caso.empresa} | OPAV`;
    const description =
      caso.metaDescription ||
      caso.descripcion?.substring(0, 160) ||
      `${locale === "es" ? "Caso de éxito" : "Success case"}: ${
        caso.nombre
      } - ${caso.empresa} ${locale === "es" ? "en" : "in"} ${caso.ubicacion}`;

    const ogImage = caso.imagenPrincipal
      ? getStrapiMedia(caso.imagenPrincipal.url || caso.imagenPrincipal)
      : null;

    // Generar alternate URLs para hreflang
    const alternateLanguages: Record<string, string> = {};
    if (caso.localizations && Array.isArray(caso.localizations)) {
      caso.localizations.forEach((localization: any) => {
        if (localization.Slug) {
          alternateLanguages[
            localization.locale
          ] = `${baseUrl}/${localization.locale}/casos-exito/${localization.Slug}`;
        }
      });
    }
    // Agregar el locale actual
    alternateLanguages[locale] = `${baseUrl}/${locale}/casos-exito/${slug}`;

    return {
      title,
      description,
      keywords: caso.keywords,
      authors: [
        { name: caso.empresa === "OPAV" ? "OPAV SAS" : "B&S Facilities" },
      ],
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
        canonical: `${baseUrl}/${locale}/casos-exito/${slug}`,
        languages: alternateLanguages,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/${locale}/casos-exito/${slug}`,
        siteName: "OPAV",
        type: "article",
        publishedTime: caso.publishedAt,
        modifiedTime: caso.updatedAt,
        authors: [caso.empresa === "OPAV" ? "OPAV SAS" : "B&S Facilities"],
        locale: locale === "es" ? "es_CO" : "en_US",
        alternateLocale: locale === "es" ? "en_US" : "es_CO",
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `${caso.titulo} - ${caso.cliente}`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        site: "@OPAV_SAS",
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
        creator: "@OPAV_SAS",
      },
    };
  } catch (error) {
    return {
      title: locale === "es" ? "Caso de Éxito" : "Success Case",
    };
  }
}

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

// Generar páginas estáticas en build time
export async function generateStaticParams() {
  const locales = ["es", "en"];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    try {
      const response = await getCasosExito(locale);
      if (!response?.data) {
        console.warn(`[Build] CMS not available for casos-exito (${locale}), skipping static generation`);
        continue;
      }

      const casos = response.data || [];
      casos.forEach((caso: any) => {
        if (caso.Slug) {
          params.push({
            locale,
            slug: caso.Slug,
          });
        }
      });
    } catch (error) {
      console.warn(`[Build] Error fetching casos for locale ${locale}, skipping:`, error);
    }
  }

  return params;
}

export default async function CasoExitoPage({ params }: CasoExitoPageProps) {
  const { locale, slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  const t = await getTranslations("successCase");

  // Obtener caso de éxito por slug
  let caso: any = null;
  let relatedCases: any[] = [];

  try {
    const response = await getCasoExito(slug, locale);
    caso = response.data?.[0] || null;

    // Obtener casos relacionados (misma empresa, excluyendo el actual)
    if (caso) {
      const allCasesResponse = await getCasosExito(locale);
      const allCases = allCasesResponse.data || [];

      // Filtrar casos de la misma empresa, excluyendo el actual
      relatedCases = allCases
        .filter((c: any) => c.Slug !== slug)
        .filter((c: any) => c.empresa === caso.empresa)
        .slice(0, 3);

      // Si no hay suficientes de la misma empresa, completar con otros
      if (relatedCases.length < 3) {
        const otherCases = allCases
          .filter((c: any) => c.Slug !== slug && c.empresa !== caso.empresa)
          .slice(0, 3 - relatedCases.length);
        relatedCases = [...relatedCases, ...otherCases];
      }
    }
  } catch (error) {
    console.error("Error fetching caso de éxito:", error);
  }

  // Si no existe el caso, mostrar 404
  if (!caso) {
    notFound();
  }

  // Obtener URL de imagen principal
  const imagenPrincipalUrl = caso.imagenPrincipal
    ? getStrapiMedia(caso.imagenPrincipal.url || caso.imagenPrincipal)
    : null;

  const isOPAV = caso.empresa === "OPAV";
  const brandColor = isOPAV ? "#d50058" : "#0e7490";

  // JSON-LD Structured Data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  const structuredData = [
    // Article schema
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${baseUrl}/${locale}/casos-exito/${slug}`,
      headline: caso.nombre,
      description: caso.descripcion || caso.metaDescription,
      image: imagenPrincipalUrl
        ? [
            imagenPrincipalUrl,
          ]
        : [],
      datePublished: caso.publishedAt || caso.createdAt,
      dateModified: caso.updatedAt,
      author: {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: caso.empresa === "OPAV" ? "OPAV SAS" : "B&S Facilities",
        url: baseUrl,
      },
      publisher: {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "OPAV SAS",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/logos/opav-logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale}/casos-exito/${slug}`,
      },
      about: {
        "@type": "Organization",
        name: caso.empresa,
        address: {
          "@type": "PostalAddress",
          addressLocality: caso.ubicacion,
          addressCountry: "CO",
        },
      },
      keywords: caso.keywords,
      inLanguage: locale === "es" ? "es-CO" : "en-US",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
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
        {
          "@type": "ListItem",
          position: 3,
          name: caso.nombre,
          item: `${baseUrl}/${locale}/casos-exito/${slug}`,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Reading Progress Bar */}
      <ReadingProgress brandColor={brandColor} />

      {/* Hero Section with Parallax */}
      <CaseHero
        nombre={caso.nombre}
        ubicacion={caso.ubicacion}
        empresa={caso.empresa}
        imagenUrl={imagenPrincipalUrl}
        locale={locale}
        translations={{
          home: t("breadcrumb.home"),
          successCases: t("breadcrumb.successCases"),
          area: t("metrics.area"),
          savings: t("metrics.savings"),
          employees: t("metrics.employees"),
          duration: t("metrics.duration"),
        }}
      />

      {/* Journey Section: Descripción del proyecto */}
      <JourneySection
        descripcion={caso.descripcion}
        empresa={caso.empresa}
        translations={{
          objective: t("journey.objective"),
          challenge: t("journey.challenge"),
          solution: t("journey.solution"),
          results: t("journey.results"),
          projectDescription: t("journey.projectDescription"),
        }}
      />

      {/* Image Gallery from galeria dynamic zone */}
      {caso.galeria && caso.galeria.length > 0 && (
        <ImageGallery
          galeria={caso.galeria}
          empresa={caso.empresa}
          translations={{
            title: t("gallery.title"),
            viewLarger: t("gallery.viewLarger"),
            closeGallery: t("gallery.closeGallery"),
            imageOf: t("gallery.imageOf"),
          }}
        />
      )}

      {/* Project Details + CTA */}
      <ProjectDetails
        empresa={caso.empresa}
        nombre={caso.nombre}
        ubicacion={caso.ubicacion}
        locale={locale}
        translations={{
          projectDetails: t("details.title"),
          company: t("details.company"),
          client: t("details.client"),
          industry: t("details.industry"),
          location: t("details.location"),
          date: t("details.date"),
          duration: t("details.duration"),
          tags: t("details.tags"),
          interestedTitle: t("cta.title"),
          interestedText: t("cta.text"),
          contactButton: t("cta.button"),
        }}
      />

      {/* Related Cases */}
      {relatedCases.length > 0 && (
        <RelatedCases
          casos={relatedCases}
          locale={locale}
          translations={{
            title: t("related.title"),
            viewAll: t("related.viewAll"),
          }}
        />
      )}

      {/* Back Navigation */}
      <BackNavigation
        locale={locale}
        translations={{
          backToAll: t("navigation.backToAll"),
        }}
      />
    </main>
  );
}
