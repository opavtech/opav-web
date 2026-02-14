import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JobApplicationForm from "@/components/forms/JobApplicationForm";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });

  return {
    title: t("spontaneous.metaTitle"),
    description: t("spontaneous.metaDescription"),
  };
}

export default async function SpontaneousApplicationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("jobs");

  const formTranslations = {
    title: t("spontaneous.formTitle"),
    subtitle: t("spontaneous.formSubtitle"),
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
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d50058]/10 to-[#f5347b]/10 rounded-full mb-6">
                <svg
                  className="w-5 h-5 text-[#d50058]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-semibold bg-gradient-to-r from-[#d50058] to-[#f5347b] bg-clip-text text-transparent">
                  {t("spontaneous.badge")}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {t("spontaneous.title")}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t("spontaneous.description")}
              </p>
            </div>

            {/* Form */}
            <JobApplicationForm
              locale={locale}
              translations={formTranslations}
            />
          </div>
        </div>
      </main>
    </>
  );
}
