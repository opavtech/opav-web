import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "company" });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://opav.com.co";
  const currentUrl = `${baseUrl}/${locale}/company`;

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),

    alternates: {
      canonical: currentUrl,
      languages: {
        es: `${baseUrl}/es/company`,
        en: `${baseUrl}/en/company`,
      },
    },

    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_CO" : "en_US",
      url: currentUrl,
      siteName: "OPAV & B&S Facilities",
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
    },

    twitter: {
      card: "summary",
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
    },

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
  };
}

// JSON-LD Schema para SEO estructurado
function generateJsonLd(locale: string, baseUrl: string) {
  const isSpanish = locale === "es";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "OPAV & B&S Facilities",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/logos/opav-logo.png`,
          width: 200,
          height: 60,
        },
        description: isSpanish
          ? "Empresa líder en administración de propiedades corporativas y facilities management en Colombia"
          : "Leading company in corporate property management and facilities management in Colombia",
        foundingDate: "2018",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogotá",
          addressCountry: "CO",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Spanish", "English"],
        },
        sameAs: [
          "https://www.linkedin.com/company/opav-sas",
          "https://www.instagram.com/opav_sas",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale}/company#webpage`,
        url: `${baseUrl}/${locale}/company`,
        name: isSpanish
          ? "Sobre OPAV & B&S - Gestión Corporativa de Propiedades"
          : "About OPAV & B&S - Corporate Property Management",
        description: isSpanish
          ? "Conozca OPAV y B&S Facilities. Más de 10 años de experiencia en administración de propiedades corporativas."
          : "Learn about OPAV and B&S Facilities. Over 10 years of experience in corporate property management.",
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: isSpanish ? "es-CO" : "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isSpanish ? "Inicio" : "Home",
            item: `${baseUrl}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isSpanish ? "Compañía" : "Company",
            item: `${baseUrl}/${locale}/company`,
          },
        ],
      },
    ],
  };
}

export default async function CompanyLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://opav.com.co";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(locale, baseUrl)),
        }}
      />
      {children}
    </>
  );
}
