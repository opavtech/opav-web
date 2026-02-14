"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FooterProps {
  locale: string;
}

// Componente de Modal de Privacidad
function PrivacyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"categories" | "services">(
    "categories"
  );
  const [cookies, setCookies] = useState({
    essential: true,
    analytics: true,
    externalMedia: true,
  });

  // Cargar preferencias guardadas cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      const savedConsent = localStorage.getItem("cookieConsent");
      if (savedConsent) {
        try {
          const parsedConsent = JSON.parse(savedConsent);
          setCookies(parsedConsent);
        } catch (error) {
          console.error("Error al cargar las preferencias de cookies:", error);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCookie = (key: "analytics" | "externalMedia") => {
    setCookies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const acceptAll = () => {
    setCookies({ essential: true, analytics: true, externalMedia: true });
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({ essential: true, analytics: true, externalMedia: true })
    );
    onClose();
  };

  const denyAll = () => {
    setCookies({ essential: true, analytics: false, externalMedia: false });
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        essential: true,
        analytics: false,
        externalMedia: false,
      })
    );
    onClose();
  };

  const savePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(cookies));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header corporativo */}
        <div className="bg-[#323e48] text-white px-8 py-6 flex items-start justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Configuración de Privacidad
            </h1>
            <p className="text-gray-300 text-sm">
              Gestiona tus preferencias de cookies
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-md p-2 transition-colors ml-4"
            aria-label="Cerrar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content scrolleable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-8 text-gray-700 text-sm leading-relaxed">
            <p>
              Utilizamos cookies en nuestro sitio web. Algunas son esenciales,
              mientras que otras nos ayudan a mejorar este sitio web y su
              experiencia.
            </p>
            <p className="mt-2 text-gray-600">
              Las cookies esenciales no se pueden desactivar ya que son
              necesarias para el funcionamiento del sitio.
            </p>
          </div>

          {/* Tabs minimalistas */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-5 py-3 font-medium text-sm transition-all relative ${
                activeTab === "categories"
                  ? "text-[#d50058]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Categorías
              {activeTab === "categories" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d50058]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`px-5 py-3 font-medium text-sm transition-all relative ${
                activeTab === "services"
                  ? "text-[#d50058]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Servicios
              {activeTab === "services" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d50058]"></div>
              )}
            </button>
          </div>

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="space-y-3">
              {/* Essential Cookies */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#5b6770]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Cookies Esenciales
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Necesarias para el funcionamiento básico del sitio web.
                      Garantizan que el sitio funcione correctamente y de forma
                      segura.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-11 h-6 bg-[#5b6770] rounded-full flex items-center px-0.5 cursor-not-allowed opacity-50">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm translate-x-5"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      Siempre activo
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Análisis y Rendimiento
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Herramientas de seguimiento analítico que nos ayudan a
                      mejorar la experiencia del usuario y optimizar el
                      rendimiento del sitio.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleCookie("analytics")}
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 ${
                        cookies.analytics ? "bg-[#d50058]" : "bg-gray-300"
                      }`}
                      aria-label="Toggle Analytics"
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                          cookies.analytics ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* External Media Cookies */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Contenido Externo
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Videos, mapas y contenido de redes sociales. Si no da su
                      consentimiento, este contenido será bloqueado
                      automáticamente.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleCookie("externalMedia")}
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 ${
                        cookies.externalMedia ? "bg-[#d50058]" : "bg-gray-300"
                      }`}
                      aria-label="Toggle External Media"
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                          cookies.externalMedia
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="text-center py-16 text-gray-500">
              <svg
                className="w-20 h-20 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">No hay servicios externos configurados</p>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-6 mt-8 pt-6 border-t border-gray-200 text-sm">
            <a
              href="/documents/politica-tratamiento-datos.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5b6770] hover:text-[#d50058] font-medium transition-colors"
            >
              Política de Privacidad
            </a>
            <Link
              href="/legal"
              className="text-[#5b6770] hover:text-[#d50058] font-medium transition-colors"
            >
              Aviso Legal
            </Link>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={denyAll}
              className="flex-1 border-2 border-gray-300 hover:border-[#5b6770] text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-md transition-colors"
            >
              Rechazar Todo
            </button>
            <button
              onClick={savePreferences}
              className="flex-1 bg-[#5b6770] hover:bg-[#4a5560] text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Guardar Preferencias
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 bg-[#d50058] hover:bg-[#b8004a] text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Aceptar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal del Footer
export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("nav");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-b from-[#323e48] to-black text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* OPAV Info & Social */}
            <div className="space-y-6">
              <div>
                <h3 className="text-5xl font-bold text-white mb-6 tracking-tight">
                  OPAV SAS
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  Soluciones integrales en administración de propiedades y
                  facilities management.
                </p>
              </div>

              {/* Social Media Icons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-4">
                  Contáctanos
                </h4>
                <div className="flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#5b6770] hover:bg-[#0077b5] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/573016113151"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#5b6770] hover:bg-[#25D366] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="WhatsApp"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-100">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/services`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("services")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/certificados`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("certified")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-100">
                {t("services")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${locale}/properties`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("properties")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/jobs`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("jobs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/contact`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-100">
                {t("contact")}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-400">
                  <svg
                    className="w-5 h-5 mr-3 mt-0.5 text-[#d50058] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Bogotá, Colombia</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg
                    className="w-5 h-5 mr-3 mt-0.5 text-[#d50058] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>Tel: +57 (1) XXX XXXX</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg
                    className="w-5 h-5 mr-3 mt-0.5 text-[#d50058] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@opav.com.co</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#5b6770]/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#5b6770]">
              <p>
                &copy; {new Date().getFullYear()} OPAV SAS & B&S Facilities.
                Todos los derechos reservados.
              </p>
              <div className="flex gap-6">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="hover:text-white transition-colors underline underline-offset-4 decoration-[#d50058]"
                >
                  Configuración de Cookies
                </button>
                <a
                  href="/documents/politica-tratamiento-datos.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Privacidad
                </a>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Términos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
