import ContactForm from "@/components/forms/ContactForm";
import { getTranslations } from "next-intl/server";
import ContactHero from "./_components/ContactHero";
import ContactMapWrapper from "./_components/ContactMapWrapper";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations("contact");

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <ContactHero locale={locale} />

      {/* Contact Form & Info */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Contact Information - 2 columns */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {t("info.title")}
                  </h2>

                  {/* Info Cards */}
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 text-sm">
                            {t("info.address.title")}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Edificio Federación Nacional de Cafeteros
                          </p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Calle 73 # 8-13, Piso 11
                          </p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Bogotá, Colombia
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <a
                      href={`tel:${t("info.phone.number").replace(/\s/g, "")}`}
                      className="p-5 rounded-xl bg-white border border-gray-200 block"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 text-sm">
                            {t("info.phone.title")}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {t("info.phone.number")}
                          </p>
                        </div>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${t("info.email.address")}`}
                      className="p-5 rounded-xl bg-white border border-gray-200 block"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 text-sm">
                            {t("info.email.title")}
                          </h3>
                          <p className="text-gray-600 text-sm group-hover:text-primary-600 transition-colors break-all">
                            {t("info.email.address")}
                          </p>
                        </div>
                      </div>
                    </a>

                    {/* Hours */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 text-sm">
                            {t("info.hours.title")}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {t("info.hours.weekdays")}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {t("info.hours.weekend")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                {/* <div className="mt-8">
                  <ContactMapWrapper locale={locale} />
                </div> */}
              </div>

              {/* Contact Form - 3 columns */}
              <div className="lg:col-span-3">
                <ContactForm
                  locale={locale}
                  translations={{
                    fullName: t("form.fullName"),
                    fullNamePlaceholder: t("form.fullNamePlaceholder"),
                    email: t("form.email"),
                    emailPlaceholder: t("form.emailPlaceholder"),
                    phone: t("form.phone"),
                    phonePlaceholder: t("form.phonePlaceholder"),
                    company: t("form.company"),
                    companyPlaceholder: t("form.companyPlaceholder"),
                    message: t("form.message"),
                    messagePlaceholder: t("form.messagePlaceholder"),
                    attachment: t("form.attachment"),
                    attachmentHelp: t("form.attachmentHelp"),
                    privacyConsent: t("form.privacyConsent"),
                    privacyLink: t("form.privacyLink"),
                    privacyLinkText: t("form.privacyLinkText"),
                    submit: t("form.submit"),
                    sending: t("form.sending"),
                    successMessage: t("form.successMessage"),
                    errorMessage: t("form.errorMessage"),
                    required: t("form.required"),
                    invalidEmail: t("form.invalidEmail"),
                    invalidPhone: t("form.invalidPhone"),
                    fileTooBig: t("form.fileTooBig"),
                    invalidFileType: t("form.invalidFileType"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
