import { Metadata } from "next";
import { getCasosExitoConUbicacion } from "@/lib/strapi";
import CoberturaSection from "@/components/CoberturaSection";

interface CoberturaPageProps {
  params: Promise<{ locale: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opav.com.co";

type CoberturaCaseData = {
  ubicacion?: string;
  nombre?: string;
  Slug?: string;
  descripcion?: string;
  empresa?: string;
};

function readStringField(
  value: unknown,
  key: keyof CoberturaCaseData,
): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const obj = value as Record<string, unknown>;

  const direct = obj[key as string];
  if (typeof direct === "string") return direct;

  const attributes = obj["attributes"];
  if (attributes && typeof attributes === "object") {
    const fromAttributes = (attributes as Record<string, unknown>)[
      key as string
    ];
    if (typeof fromAttributes === "string") return fromAttributes;
  }

  return undefined;
}

function normalizeCoberturaCase(value: unknown): CoberturaCaseData {
  return {
    ubicacion: readStringField(value, "ubicacion"),
    nombre: readStringField(value, "nombre"),
    Slug: readStringField(value, "Slug"),
    descripcion: readStringField(value, "descripcion"),
    empresa: readStringField(value, "empresa"),
  };
}

export async function generateMetadata({
  params,
}: CoberturaPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === "es";

  // Obtener casos para incluir ciudades en keywords
  const response = await getCasosExitoConUbicacion("es");
  const rawCases: unknown[] = response.data || [];
  const cases = rawCases.map(normalizeCoberturaCase);
  const cities = Array.from(
    new Set(cases.map((c) => c.ubicacion).filter(Boolean)),
  ) as string[];
  const citiesKeywords = cities.slice(0, 5).join(", ");

  const title = isSpanish
    ? "Cobertura Nacional | Proyectos en Colombia | OPAV & B&S"
    : "National Coverage | Projects in Colombia | OPAV & B&S";

  const description = isSpanish
    ? `Presencia estratégica en ${cities.length}+ ciudades de Colombia incluyendo ${citiesKeywords}. ${cases.length} proyectos de construcción e ingeniería de excelencia. Descubre nuestra cobertura nacional.`
    : `Strategic presence in ${cities.length}+ Colombian cities including ${citiesKeywords}. ${cases.length} excellence construction and engineering projects. Discover our national coverage.`;

  return {
    title,
    description,
    keywords: isSpanish
      ? `cobertura Colombia, proyectos Colombia, OPAV Colombia, B&S Colombia, construcción Colombia, ${citiesKeywords}, proyectos de construcción, ingeniería Colombia, mapa proyectos`
      : `Colombia coverage, Colombia projects, OPAV Colombia, B&S Colombia, construction Colombia, ${citiesKeywords}, construction projects, engineering Colombia, projects map`,
    alternates: {
      canonical: `${siteUrl}/${locale}/cobertura`,
      languages: {
        es: `${siteUrl}/es/cobertura`,
        en: `${siteUrl}/en/cobertura`,
      },
    },
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
    openGraph: {
      title: isSpanish
        ? "Cobertura Nacional - OPAV & B&S"
        : "National Coverage - OPAV & B&S",
      description: isSpanish
        ? `Presencia estratégica en ${cities.length}+ ciudades de Colombia con ${cases.length} proyectos de excelencia.`
        : `Strategic presence in ${cities.length}+ Colombian cities with ${cases.length} excellence projects.`,
      type: "website",
      locale: isSpanish ? "es_CO" : "en_US",
      alternateLocale: isSpanish ? "en_US" : "es_CO",
      siteName: "OPAV & B&S",
      url: `${siteUrl}/${locale}/cobertura`,
      images: [
        {
          // Generada dinámicamente por Next.js: app/[locale]/cobertura/opengraph-image.tsx
          url: `${siteUrl}/${locale}/cobertura/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isSpanish
            ? "Mapa de cobertura nacional OPAV & B&S en Colombia"
            : "OPAV & B&S national coverage map in Colombia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isSpanish
        ? "Cobertura Nacional - OPAV & B&S"
        : "National Coverage - OPAV & B&S",
      description: isSpanish
        ? `Presencia estratégica en ${cities.length}+ ciudades de Colombia.`
        : `Strategic presence in ${cities.length}+ Colombian cities.`,
      // Generada dinámicamente por Next.js: app/[locale]/cobertura/twitter-image.tsx
      images: [`${siteUrl}/${locale}/cobertura/twitter-image`],
    },
  };
}

// Generar JSON-LD para datos estructurados
function generateStructuredData(
  cases: CoberturaCaseData[],
  locale: string,
  cities: string[],
) {
  const isSpanish = locale === "es";

  const itemListCases = cases
    .map((c) => ({
      nombre: c.nombre,
      Slug: c.Slug,
      descripcion: c.descripcion,
      ubicacion: c.ubicacion,
      empresa: c.empresa,
    }))
    .filter((c) => Boolean(c.Slug && c.nombre));

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Organization con cobertura geográfica
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "OPAV & B&S",
        url: siteUrl,
        logo: `${siteUrl}/images/logos/opav-logo.png`,
        areaServed: {
          "@type": "Country",
          name: "Colombia",
          containsPlace: cities.map((city) => ({
            "@type": "City",
            name: city,
          })),
        },
        numberOfEmployees: {
          "@type": "QuantitativeValue",
          minValue: 50,
        },
      },
      // Página web
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/${locale}/cobertura#webpage`,
        url: `${siteUrl}/${locale}/cobertura`,
        name: isSpanish
          ? "Cobertura Nacional | OPAV & B&S"
          : "National Coverage | OPAV & B&S",
        description: isSpanish
          ? `Presencia en ${cities.length}+ ciudades de Colombia con ${cases.length} proyectos de excelencia.`
          : `Presence in ${cities.length}+ Colombian cities with ${cases.length} excellence projects.`,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: isSpanish ? "es-CO" : "en-US",
        breadcrumb: {
          "@id": `${siteUrl}/${locale}/cobertura#breadcrumb`,
        },
      },
      // Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/${locale}/cobertura#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isSpanish ? "Inicio" : "Home",
            item: `${siteUrl}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isSpanish ? "Cobertura Nacional" : "National Coverage",
            item: `${siteUrl}/${locale}/cobertura`,
          },
        ],
      },
      // ItemList de proyectos (para rich snippets)
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/${locale}/cobertura#projectlist`,
        name: isSpanish ? "Proyectos de Construcción" : "Construction Projects",
        description: isSpanish
          ? "Lista de proyectos de construcción e ingeniería en Colombia"
          : "List of construction and engineering projects in Colombia",
        numberOfItems: itemListCases.length,
        itemListElement: itemListCases.slice(0, 10).map((caso, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: caso.nombre,
            url: `${siteUrl}/${locale}/casos-exito/${caso.Slug}`,
            description: caso.descripcion,
            locationCreated: {
              "@type": "Place",
              name: caso.ubicacion,
              address: {
                "@type": "PostalAddress",
                addressLocality: caso.ubicacion,
                addressCountry: "CO",
              },
            },
            creator: {
              "@type": "Organization",
              name: caso.empresa,
            },
          },
        })),
      },
    ],
  };
}

export default async function CoberturaPage({ params }: CoberturaPageProps) {
  const { locale } = await params;

  // Siempre obtener casos de éxito en español para garantizar todos los proyectos
  // ya que algunos pueden no tener traducción al inglés
  const response = await getCasosExitoConUbicacion("es");
  const rawCases: unknown[] = response.data || [];
  const cases = rawCases.map(normalizeCoberturaCase);

  // Extraer ciudades únicas para structured data
  const cities = Array.from(
    new Set(cases.map((c) => c.ubicacion).filter(Boolean)),
  ) as string[];

  // Generar JSON-LD
  const structuredData = generateStructuredData(cases, locale, cities);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CoberturaSection cases={cases} locale={locale} />
    </>
  );
}
