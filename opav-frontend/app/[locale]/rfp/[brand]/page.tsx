import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import RFPForm from "@/components/forms/RFPForm";

type Brand = "opav" | "bs";

interface RFPPageProps {
  params: Promise<{ locale: string; brand: string }>;
}

const BRAND_META = {
  opav: {
    titleEs: "Solicitar Propuesta – OPAV SAS | Administración de Propiedades",
    titleEn: "Request a Proposal – OPAV SAS | Property Management",
    descEs:
      "Solicita una propuesta personalizada de servicios de administración de propiedades y gerencia de edificios con OPAV SAS en Colombia.",
    descEn:
      "Request a personalized proposal for property management and building administration services with OPAV SAS in Colombia.",
    logo: "/images/logos/opav-logo.png",
    logoAlt: "OPAV SAS",
    logoWidth: 180,
    logoHeight: 60,
    color: "#d50058",
    bgGradient: "from-[#d50058] to-[#a0003d]",
    badgeBg: "bg-[#d50058]/10",
    badgeText: "text-[#d50058]",
    badgeBorder: "border-[#d50058]/20",
    taglineEs: "Administración de Propiedades",
    taglineEn: "Property Management",
    featuresEs: [
      "Gerencia de edificios corporativos",
      "Administración de conjuntos y centros comerciales",
      "Asesoría y gestión inmobiliaria",
    ],
    featuresEn: [
      "Corporate building management",
      "Residential complex and mall administration",
      "Real estate consulting and management",
    ],
  },
  bs: {
    titleEs:
      "Solicitar Propuesta – B&S Facilities | Facilities Management",
    titleEn: "Request a Proposal – B&S Facilities | Facilities Management",
    descEs:
      "Solicita una propuesta personalizada de servicios de facilities management, mantenimiento y servicios generales con B&S Facilities en Colombia.",
    descEn:
      "Request a personalized proposal for facilities management, maintenance and general services with B&S Facilities in Colombia.",
    logo: "/images/logos/bs-facilities-logo-hor.png",
    logoAlt: "B&S Facilities",
    logoWidth: 240,
    logoHeight: 60,
    color: "#00acc8",
    bgGradient: "from-[#00acc8] to-[#0088aa]",
    badgeBg: "bg-[#00acc8]/10",
    badgeText: "text-[#00acc8]",
    badgeBorder: "border-[#00acc8]/20",
    taglineEs: "Facilities Management",
    taglineEn: "Facilities Management",
    featuresEs: [
      "Mantenimiento preventivo y correctivo",
      "Servicios generales y aseo",
      "Gestión integral de proveedores",
    ],
    featuresEn: [
      "Preventive and corrective maintenance",
      "General services and cleaning",
      "Comprehensive supplier management",
    ],
  },
};

export async function generateMetadata({
  params,
}: RFPPageProps): Promise<Metadata> {
  const { locale, brand } = await params;

  if (!["opav", "bs"].includes(brand)) return {};

  const meta = BRAND_META[brand as Brand];
  const isEs = locale === "es";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";

  return {
    title: isEs ? meta.titleEs : meta.titleEn,
    description: isEs ? meta.descEs : meta.descEn,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${baseUrl}/${locale}/rfp/${brand}`,
    },
  };
}

export default async function RFPPage({ params }: RFPPageProps) {
  const { locale, brand } = await params;

  if (!["opav", "bs"].includes(brand)) notFound();

  const typedBrand = brand as Brand;
  const meta = BRAND_META[typedBrand];
  const isEs = locale === "es";

  const features = isEs ? meta.featuresEs : meta.featuresEn;
  const tagline = isEs ? meta.taglineEs : meta.taglineEn;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero compacto */}
      <div className={`bg-gradient-to-r ${meta.bgGradient} text-white`}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Image
              src={meta.logo}
              alt={meta.logoAlt}
              width={meta.logoWidth}
              height={meta.logoHeight}
              className="h-14 md:h-16 w-auto object-contain mx-auto mb-6 brightness-0 invert"
              priority
            />
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {isEs ? "Solicitar Propuesta" : "Request a Proposal"}
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto">
              {isEs
                ? `Cuéntanos sobre tu proyecto y te enviaremos una propuesta personalizada de ${tagline}`
                : `Tell us about your project and we'll send you a personalized ${tagline} proposal`}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Panel lateral */}
            <div className="lg:col-span-2 space-y-6">
              {/* Por qué elegirnos */}
              <div
                className={`rounded-xl border ${meta.badgeBorder} p-6`}
                style={{ backgroundColor: `${meta.color}08` }}
              >
                <h2 className="font-bold text-gray-900 mb-4 text-base">
                  {isEs ? "¿Qué incluye la propuesta?" : "What does the proposal include?"}
                </h2>
                <ul className="space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: meta.color }}
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tiempo de respuesta */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {isEs ? "Tiempo de respuesta" : "Response time"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {isEs
                    ? "Nuestro equipo comercial te contactará en las próximas 24-48 horas hábiles."
                    : "Our commercial team will contact you within the next 24-48 business hours."}
                </p>
              </div>

              {/* Contacto directo */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">
                  {isEs ? "¿Prefieres contactarnos directamente?" : "Prefer to contact us directly?"}
                </h3>
                <a
                  href="https://wa.me/573207036539"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#25D366] transition-colors group"
                >
                  <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="group-hover:underline">+57 320 703 6539</span>
                </a>
                <a
                  href="mailto:info@opav.com.co"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 transition-colors group mt-2"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="group-hover:underline">info@opav.com.co</span>
                </a>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-3">
              <RFPForm locale={locale} brand={typedBrand} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
