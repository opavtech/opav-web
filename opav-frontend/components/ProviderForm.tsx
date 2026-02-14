"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { executeRecaptcha } from "@/lib/recaptcha";

interface ProviderFormProps {
  locale: string;
}

interface FormData {
  companyName: string;
  nit: string;
  legalRepresentative: string;
  email: string;
  phone: string;
  address: string;
  providerType: string;
  operationalContactName: string;
  dataConsent: boolean;
  // Honeypot field (invisible to users, bots fill it)
  website: string;
}

export default function ProviderForm({ locale }: ProviderFormProps) {
  const t = useTranslations("providers.form");

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    nit: "",
    legalRepresentative: "",
    email: "",
    phone: "",
    address: "",
    providerType: "",
    operationalContactName: "",
    dataConsent: false,
    website: "", // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Honeypot check - if filled, it's a bot
    if (formData.website) {
      console.warn("Bot detected via honeypot");
      return false;
    }

    // Company name validation
    if (
      !formData.companyName.trim() ||
      formData.companyName.trim().length < 2
    ) {
      newErrors.companyName = t("required");
    }

    // NIT validation
    if (!formData.nit.trim() || formData.nit.trim().length < 5) {
      newErrors.nit = t("required");
    }

    // Legal representative validation
    if (
      !formData.legalRepresentative.trim() ||
      formData.legalRepresentative.trim().length < 3
    ) {
      newErrors.legalRepresentative = t("required");
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("invalidEmail");
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t("required");
    } else if (!/^\+?[\d\s\-()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = t("invalidPhone");
    }

    // Address validation
    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = t("required");
    }

    // Provider type validation
    if (!formData.providerType) {
      newErrors.providerType = t("required");
    }

    // Operational contact name validation
    if (
      !formData.operationalContactName.trim() ||
      formData.operationalContactName.trim().length < 3
    ) {
      newErrors.operationalContactName = t("required");
    }

    // Data consent validation
    if (!formData.dataConsent) {
      newErrors.dataConsent = t("consentRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Execute reCAPTCHA (if configured)
      const recaptchaToken = await executeRecaptcha("provider_application");

      // Send to internal API (not directly to Strapi for security)
      const response = await fetch("/api/provider-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName.trim(),
          nit: formData.nit.trim(),
          legalRepresentative: formData.legalRepresentative.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          providerType: formData.providerType,
          operationalContactName: formData.operationalContactName.trim(),
          dataConsent: formData.dataConsent,
          locale,
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Provider application error:", errorData);
        throw new Error("Provider application submission failed");
      }

      setSubmitStatus("success");

      // Reset form
      setFormData({
        companyName: "",
        nit: "",
        legalRepresentative: "",
        email: "",
        phone: "",
        address: "",
        providerType: "",
        operationalContactName: "",
        dataConsent: false,
        website: "",
      });
    } catch (error) {
      console.error("Error al enviar aplicación:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-['Inter']">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-lg">{t("subtitle")}</p>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-bold text-green-900">{t("successTitle")}</h3>
                <p className="text-green-700 text-sm mt-1">
                  {t("successMessage")}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-bold text-red-900">{t("errorTitle")}</h3>
                <p className="text-red-700 text-sm mt-1">{t("errorMessage")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - invisible to users, filled by bots */}
        <div
          className="absolute opacity-0 pointer-events-none"
          aria-hidden="true"
          tabIndex={-1}
        >
          <label htmlFor="website">Website (leave blank)</label>
          <input
            type="text"
            id="website"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>

        {/* Nombre de la empresa */}
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {t("companyName")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            maxLength={150}
            placeholder={t("companyNamePlaceholder")}
            className={`w-full px-4 py-3 rounded-lg border ${errors.companyName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        {/* NIT y Representante Legal en grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="nit"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {t("nit")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nit"
              name="nit"
              value={formData.nit}
              onChange={handleInputChange}
              required
              maxLength={50}
              placeholder={t("nitPlaceholder")}
              className={`w-full px-4 py-3 rounded-lg border ${errors.nit ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
            />
            {errors.nit && (
              <p className="mt-1 text-sm text-red-500">{errors.nit}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="legalRepresentative"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {t("legalRepresentative")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="legalRepresentative"
              name="legalRepresentative"
              value={formData.legalRepresentative}
              onChange={handleInputChange}
              required
              maxLength={100}
              placeholder={t("legalRepresentativePlaceholder")}
              className={`w-full px-4 py-3 rounded-lg border ${errors.legalRepresentative ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
            />
            {errors.legalRepresentative && (
              <p className="mt-1 text-sm text-red-500">
                {errors.legalRepresentative}
              </p>
            )}
          </div>
        </div>

        {/* Email y Teléfono en grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {t("email")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              maxLength={100}
              placeholder={t("emailPlaceholder")}
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {t("phone")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              maxLength={20}
              placeholder={t("phonePlaceholder")}
              className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {t("address")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            maxLength={250}
            placeholder={t("addressPlaceholder")}
            className={`w-full px-4 py-3 rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        {/* Tipo de proveedor */}
        <div>
          <label
            htmlFor="providerType"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {t("providerType")} <span className="text-red-500">*</span>
          </label>
          <select
            id="providerType"
            name="providerType"
            value={formData.providerType}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 rounded-lg border ${errors.providerType ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition bg-white`}
          >
            <option value="">{t("selectProviderType")}</option>
            <option value="service">{t("providerTypeService")}</option>
            <option value="product">{t("providerTypeProduct")}</option>
            <option value="both">{t("providerTypeBoth")}</option>
          </select>
          {errors.providerType && (
            <p className="mt-1 text-sm text-red-500">{errors.providerType}</p>
          )}
        </div>

        {/* Nombre del contacto operativo */}
        <div>
          <label
            htmlFor="operationalContactName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {t("operationalContactName")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="operationalContactName"
            name="operationalContactName"
            value={formData.operationalContactName}
            onChange={handleInputChange}
            required
            maxLength={100}
            placeholder={t("operationalContactNamePlaceholder")}
            className={`w-full px-4 py-3 rounded-lg border ${errors.operationalContactName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
          />
          {errors.operationalContactName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.operationalContactName}
            </p>
          )}
        </div>

        {/* Consentimiento de datos */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="dataConsent"
              name="dataConsent"
              checked={formData.dataConsent}
              onChange={handleInputChange}
              className="mt-1 w-5 h-5 text-[#d50058] border-gray-300 rounded focus:ring-2 focus:ring-[#d50058]"
            />
            <span className="text-sm text-gray-700">
              {t("dataConsentText")}{" "}
              <a
                href={locale === "es" ? "/es/politica-de-privacidad" : "/en/privacy-policy"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d50058] font-semibold hover:underline"
              >
                {t("privacyPolicyLink")}
              </a>
              . <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.dataConsent && (
            <p className="mt-1 text-sm text-red-500 ml-8">{errors.dataConsent}</p>
          )}
        </div>

        {/* reCAPTCHA Notice */}
        <p className="text-xs text-gray-500 text-center">
          {locale === "es" ? (
            <>
              Este sitio está protegido por reCAPTCHA y se aplican la{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d50058] hover:underline"
              >
                Política de Privacidad
              </a>{" "}
              y los{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d50058] hover:underline"
              >
                Términos de Servicio
              </a>{" "}
              de Google.
            </>
          ) : (
            <>
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d50058] hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d50058] hover:underline"
              >
                Terms of Service
              </a>{" "}
              apply.
            </>
          )}
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#d50058] to-[#f5347b] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{t("sending")}</span>
            </>
          ) : (
            <>
              <span>{t("submit")}</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
