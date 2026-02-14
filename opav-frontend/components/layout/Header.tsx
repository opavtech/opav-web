"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import Logo from "../ui/Logo";
import LocalizedLink from "../LocalizedLink";

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Detectar scroll para efecto liquid glass
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para verificar si un link está activo
  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <>
      {/* Skip to main content - SEO y Accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#d50058] focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>

      {/* Overlay oscuro cuando el menú está abierto */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
        aria-hidden="true"
      />

      {/* Sidebar Menu */}
      <aside
        id="sidebar-menu"
        role="navigation"
        aria-label="Menú principal"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-80 bg-gradient-to-b from-[#323e48] to-[#1a1f26] text-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del menú con logo - FONDO BLANCO */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Logo locale={locale} variant="sidebar" />
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-[#323e48]"
                aria-label="Cerrar menú"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Links del menú */}
          <nav
            className="flex-1 overflow-y-auto py-6 px-4"
            aria-label="Navegación del sitio"
          >
            <div className="space-y-2">
              <LocalizedLink
                href="company"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive("/compan") ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive("/compan")
                    ? "bg-[#d50058] text-white shadow-lg shadow-[#d50058]/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="font-medium">{t("company")}</span>
              </LocalizedLink>

              <LocalizedLink
                href="services"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive("/servic") ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive("/servic")
                    ? "bg-[#d50058] text-white shadow-lg shadow-[#d50058]/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="font-medium">{t("productsServices")}</span>
              </LocalizedLink>

              <LocalizedLink
                href="cobertura"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={
                  isActive("/cobertura") || isActive("/coverage")
                    ? "page"
                    : undefined
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive("/cobertura") || isActive("/coverage")
                    ? "bg-[#d50058] text-white shadow-lg shadow-[#d50058]/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
                <span className="font-medium">{t("locations")}</span>
              </LocalizedLink>

              <LocalizedLink
                href="casos-exito"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={
                  isActive("/casos-exito") || isActive("/success-cases")
                    ? "page"
                    : undefined
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive("/casos-exito") || isActive("/success-cases")
                    ? "bg-[#d50058] text-white shadow-lg shadow-[#d50058]/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{t("projects")}</span>
              </LocalizedLink>

              <LocalizedLink
                href="proveedores"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={
                  isActive("/proveedores") || isActive("/providers")
                    ? "page"
                    : undefined
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive("/proveedores") || isActive("/providers")
                    ? "bg-[#d50058] text-white shadow-lg shadow-[#d50058]/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-medium">{t("suppliers")}</span>
              </LocalizedLink>
            </div>
          </nav>

          {/* Footer del menú */}
          <div className="p-6 border-t border-white/10 space-y-4">
            <LocalizedLink
              href="vacantes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#d50058] hover:bg-[#b30048] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg
                className="w-5 h-5"
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
              {t("jobs")}
            </LocalizedLink>

            {/* Redes Sociales */}
            <div
              className="flex items-center justify-center gap-4 py-2"
              role="complementary"
              aria-label="Redes sociales"
            >
              <a
                href="https://www.linkedin.com/company/opav"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="p-2 text-gray-400 hover:text-[#0077b5] hover:bg-white/5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0077b5] focus:ring-offset-2 focus:ring-offset-[#1a1f26]"
                aria-label="Visitar LinkedIn de OPAV"
                title="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://wa.me/573016113151"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="p-2 text-gray-400 hover:text-[#25D366] hover:bg-white/5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#1a1f26]"
                aria-label="Contactar por WhatsApp"
                title="WhatsApp"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>

            {/* Protección de Datos */}
            <Link
              href={`/${locale}/privacy`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center text-gray-400 text-xs hover:text-white transition-all py-2"
            >
              {t("privacy")}
            </Link>

            <div className="text-center text-gray-400 text-xs pt-2">
              © 2025 OPAV SAS & B&S Facilities
            </div>
          </div>
        </div>
      </aside>

      {/* Header principal */}
      <header
        role="banner"
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-xl bg-white/80 shadow-lg"
            : "bg-white shadow-md"
        }`}
      >
        <nav
          className="container mx-auto px-4 py-4"
          aria-label="Navegación principal"
        >
          <div className="flex items-center justify-between">
            {/* Menú Hamburguesa - Izquierda */}
            <button
              onClick={toggleMobileMenu}
              className="flex flex-col gap-1.5 p-2 hover:bg-gray-100/50 rounded-lg transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d50058]/30 focus-visible:ring-offset-0"
              aria-label={
                isMobileMenuOpen
                  ? "Cerrar menú de navegación"
                  : "Abrir menú de navegación"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="sidebar-menu"
            >
              <span
                className={`block w-6 h-0.5 bg-[#323e48] transition-all duration-300 group-hover:bg-[#d50058] ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#323e48] transition-all duration-300 group-hover:bg-[#d50058] ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#323e48] transition-all duration-300 group-hover:bg-[#d50058] ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>

            {/* Logo Centrado */}
            <Link
              href={`/${locale}`}
              className="absolute left-1/2 -translate-x-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d50058]/30 focus-visible:ring-offset-0 rounded"
              aria-label="OPAV - Ir a página de inicio"
            >
              <Image
                src="/images/logos/opav-logo.png"
                alt="OPAV - Soluciones integrales en administración de propiedades y facilities management"
                width={120}
                height={40}
                className={`h-auto transition-all duration-300 ${
                  isScrolled ? "w-24" : "w-32"
                }`}
                priority
              />
            </Link>

            {/* CTA y Language Switcher - Derecha */}
            <div className="flex items-center gap-3">
              <LocalizedLink
                href="vacantes"
                className="px-4 py-2 bg-[#d50058] text-white text-sm font-semibold rounded-lg hover:bg-[#b30048] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
                aria-label="Ver vacantes disponibles"
              >
                {t("jobs")}
              </LocalizedLink>
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
