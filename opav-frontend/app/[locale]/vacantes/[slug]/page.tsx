import { getTranslations } from "next-intl/server";
import { getVacante } from "@/lib/strapi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobPostingSchema from "@/components/JobPostingSchema";
import JobApplicationForm from "@/components/forms/JobApplicationForm";
import VacancyHero from "./_components/VacancyHero";
import VacancyDescription from "./_components/VacancyDescription";
import RequirementsList from "./_components/RequirementsList";
import SidebarInfo from "./_components/SidebarInfo";
import ReadingProgress from "./_components/ReadingProgress";

interface VacanteDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opavsas.com";

export async function generateMetadata({
  params,
}: VacanteDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const response = await getVacante(slug, locale);
    const vacante = response.data?.[0];

    if (!vacante) {
      return {
        title: "Vacante no encontrada | OPAV",
      };
    }

    // Crear descripción más completa (hasta 300 chars)
    const description = vacante.descripcion
      ? `${vacante.descripcion.substring(0, 280)}...`
      : `Únete a nuestro equipo en ${vacante.ciudad}. ${vacante.titulo} - ${vacante.area}. Aplica ahora.`;

    // Keywords más específicos
    const keywords = [
      "vacante",
      "empleo",
      vacante.titulo,
      vacante.ciudad,
      vacante.area,
      vacante.tipoContrato,
      vacante.empresa,
      "trabajo Colombia",
      locale === "es" ? "ofertas laborales" : "job opportunities",
    ]
      .filter(Boolean)
      .join(", ");

    return {
      title: `${vacante.titulo} en ${vacante.ciudad} | ${
        vacante.empresa || "OPAV"
      }`,
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
        canonical: locale === "es" ? `${baseUrl}/es/vacantes/${slug}` : `${baseUrl}/en/jobs/${slug}`,
        languages: {
          es: `${baseUrl}/es/vacantes/${slug}`,
          en: `${baseUrl}/en/jobs/${slug}`,
          "x-default": `${baseUrl}/es/vacantes/${slug}`,
        },
      },
      twitter: {
        card: "summary",
        title: `${vacante.titulo} | ${vacante.empresa || "OPAV"}`,
        description: description.substring(0, 200),
      },
    };
  } catch (error) {
    return {
      title: "Vacante no encontrada | OPAV",
    };
  }
}

// Revalidación cada hora
export const revalidate = 3600;

export default async function VacanteDetailPage({
  params,
}: VacanteDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("jobs");

  let vacante = null;

  try {
    const response = await getVacante(slug, locale);
    vacante = response.data?.[0];
  } catch (error) {
    console.error("Error fetching vacante:", error);
  }

  if (!vacante) {
    notFound();
  }

  // Verificar si la vacante está vencida
  const estaVencida = vacante.fechaCierre
    ? new Date(vacante.fechaCierre) < new Date(new Date().toDateString())
    : false;

  // Determinar el color según la empresa
  const isOPAV = vacante.empresa?.toLowerCase().includes("opav");
  const brandColor = isOPAV ? "#d50058" : "#5b6770";
  const brandName = isOPAV ? "OPAV" : "B&S Facilities";

  // Breadcrumb Schema
  const breadcrumbSchema = {
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
        name: locale === "es" ? "Vacantes" : "Jobs",
        item: `${baseUrl}/${locale}/vacantes`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: vacante.titulo,
        item: `${baseUrl}/${locale}/vacantes/${slug}`,
      },
    ],
  };

  // Form translations
  const formTranslations = {
    title: t("application.title"),
    subtitle: t("application.subtitle"),
    fullName: t("application.fullName"),
    fullNamePlaceholder: t("application.fullNamePlaceholder"),
    email: t("application.email"),
    emailPlaceholder: t("application.emailPlaceholder"),
    phone: t("application.phone"),
    phonePlaceholder: t("application.phonePlaceholder"),
    resume: t("application.resume"),
    resumeHelp: t("application.resumeHelp"),
    coverLetter: t("application.coverLetter"),
    coverLetterPlaceholder: t("application.coverLetterPlaceholder"),
    coverLetterUpload: t("application.coverLetterUpload"),
    positionOfInterest: t("application.positionOfInterest"),
    positionPlaceholder: t("application.positionPlaceholder"),
    salaryExpectation: t("application.salaryExpectation"),
    salaryPlaceholder: t("application.salaryPlaceholder"),
    salaryOptional: t("application.salaryOptional"),
    privacyConsent: t("application.privacyConsent"),
    privacyLink: t("application.privacyLink"),
    privacyLinkText: t("application.privacyLinkText"),
    submit: t("application.submit"),
    sending: t("application.sending"),
    successTitle: t("application.successTitle"),
    successMessage: t("application.successMessage"),
    errorTitle: t("application.errorTitle"),
    errorMessage: t("application.errorMessage"),
    required: t("application.required"),
    invalidEmail: t("application.invalidEmail"),
    invalidPhone: t("application.invalidPhone"),
    fileTooBig: t("application.fileTooBig"),
    invalidFileType: t("application.invalidFileType"),
  };

  return (
    <>
      {/* Schema.org JobPosting structured data */}
      <JobPostingSchema job={vacante} locale={locale} />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Reading progress bar */}
      <ReadingProgress brandColor={brandColor} />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <VacancyHero
          titulo={vacante.titulo}
          empresa={vacante.empresa}
          ciudad={vacante.ciudad}
          area={vacante.area}
          salario={vacante.salario}
          tipoContrato={vacante.tipoContrato}
          nivelEducativo={vacante.nivelEducativo}
          brandColor={brandColor}
          brandName={brandName}
          locale={locale}
          backText={t("detail.backToJobs")}
          contractType={
            vacante.tipoContrato
              ? t(`contractTypes.${vacante.tipoContrato}`)
              : undefined
          }
          education={
            vacante.nivelEducativo
              ? t(`educationLevels.${vacante.nivelEducativo}`)
              : undefined
          }
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Content sections */}
            <div className="lg:col-span-2 space-y-8">
              {/* Descripción */}
              {vacante.descripcion && (
                <VacancyDescription
                  title={t("detail.jobDescription")}
                  content={vacante.descripcion}
                  brandColor={brandColor}
                />
              )}

              {/* Requisitos */}
              {vacante.requisitos && (
                <RequirementsList
                  title={t("detail.requirements")}
                  content={vacante.requisitos}
                  brandColor={brandColor}
                />
              )}

              {/* Formulario de aplicación */}
              <div id="apply" className="scroll-mt-20">
                {estaVencida ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                      {locale === "es" ? "Esta vacante ya no está disponible" : "This position is no longer available"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {locale === "es"
                        ? "El período de postulación ha cerrado. Revisa nuestras otras oportunidades."
                        : "The application period has closed. Check our other opportunities."}
                    </p>
                  </div>
                ) : (
                  <JobApplicationForm
                    vacanteId={vacante.id}
                    positionTitle={vacante.titulo}
                    locale={locale}
                    translations={formTranslations}
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <SidebarInfo
              tipoContrato={vacante.tipoContrato}
              experienciaRequerida={vacante.experienciaRequerida}
              nivelEducativo={vacante.nivelEducativo}
              ciudad={vacante.ciudad}
              area={vacante.area}
              archivoDescripcion={vacante.archivoDescripcion}
              brandColor={brandColor}
              translations={{
                jobInfo: t("detail.jobInfo"),
                contractType: t("card.contractType"),
                experience: t("card.experience"),
                education: t("card.education"),
                location: t("card.location"),
                area: t("card.area"),
                applyForPosition: t("detail.applyForPosition"),
                downloadDescription: t("detail.downloadDescription"),
              }}
              contractTypeTranslated={
                vacante.tipoContrato
                  ? t(`contractTypes.${vacante.tipoContrato}`)
                  : undefined
              }
              educationTranslated={
                vacante.nivelEducativo
                  ? t(`educationLevels.${vacante.nivelEducativo}`)
                  : undefined
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
