"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { executeRecaptcha } from "@/lib/recaptcha";

interface ContactFormProps {
  locale: string;
  translations: {
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    attachment: string;
    attachmentHelp: string;
    privacyConsent: string;
    privacyLink: string;
    privacyLinkText: string;
    submit: string;
    sending: string;
    successMessage: string;
    errorMessage: string;
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    fileTooBig: string;
    invalidFileType: string;
  };
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  attachment: File | null;
  privacyConsent: boolean;
  // Honeypot field (invisible to users, bots fill it)
  website: string;
}

export default function ContactForm({
  locale,
  translations,
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    attachment: null,
    privacyConsent: false,
    website: "", // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitProgress, setSubmitProgress] = useState(0);

  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Validación básica
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Honeypot check - si está lleno, es un bot
    if (formData.website) {
      console.warn("Bot detected via honeypot");
      return false;
    }

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = translations.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = translations.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = translations.invalidEmail;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = translations.required;
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = translations.invalidPhone;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = translations.required;
    }

    // Validar archivo adjunto (opcional)
    if (formData.attachment) {
      if (formData.attachment.size > 5 * 1024 * 1024) {
        newErrors.attachment = translations.fileTooBig;
      }
      if (
        !formData.attachment.type.includes("pdf") &&
        !formData.attachment.type.includes("word") &&
        !formData.attachment.type.includes("msword") &&
        !formData.attachment.type.includes("officedocument")
      ) {
        newErrors.attachment = translations.invalidFileType;
      }
    }

    if (!formData.privacyConsent) {
      newErrors.privacyConsent = translations.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(0);

    try {
      // Execute reCAPTCHA (if configured)
      const recaptchaToken = await executeRecaptcha("contact_form");
      setSubmitProgress(10);

      let attachmentUrl = null;

      // Subir archivo adjunto si existe
      if (formData.attachment) {
        const uploadFormData = new FormData();
        uploadFormData.append("resume", formData.attachment); // Reusar endpoint de upload

        setSubmitProgress(30);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }

        const { resumeUrl } = await uploadResponse.json();
        attachmentUrl = resumeUrl;
        setSubmitProgress(50);
      } else {
        setSubmitProgress(50);
      }

      // Enviar mensaje de contacto
      const contactData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || null,
        message: formData.message,
        attachmentUrl: attachmentUrl,
        locale,
        recaptchaToken,
      };

      setSubmitProgress(70);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Contact form error:", errorData);
        throw new Error("Contact form submission failed");
      }

      setSubmitProgress(100);
      setSubmitStatus("success");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        attachment: null,
        privacyConsent: false,
        website: "", // Honeypot
      });

      // Reset file input
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus("idle");
        setSubmitProgress(0);
      }, 5000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, attachment: file }));
    setErrors((prev) => ({ ...prev, attachment: "" }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-['Inter']">
          {translations.fullName.includes("Nombre")
            ? "Envíanos un mensaje"
            : "Send us a message"}
        </h2>
        <p className="text-gray-600 text-lg">
          {translations.fullName.includes("Nombre")
            ? "Completa el formulario y nos pondremos en contacto contigo pronto"
            : "Fill out the form and we'll get in touch with you soon"}
        </p>
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
                <h3 className="font-bold text-green-900">
                  {translations.fullName.includes("Nombre")
                    ? "¡Mensaje enviado!"
                    : "Message sent!"}
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  {translations.successMessage}
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
                <h3 className="font-bold text-red-900">
                  {translations.fullName.includes("Nombre")
                    ? "Error al enviar"
                    : "Error sending"}
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  {translations.errorMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre Completo */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.fullName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition"
            placeholder={translations.fullNamePlaceholder}
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.email} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition"
            placeholder={translations.emailPlaceholder}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.phone} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition"
            placeholder={translations.phonePlaceholder}
            required
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Empresa (opcional) */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.company}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, company: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition"
            placeholder={translations.companyPlaceholder}
          />
        </div>

        {/* Mensaje */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.message} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition resize-none"
            placeholder={translations.messagePlaceholder}
            required
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Archivo adjunto (opcional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {translations.attachment}{" "}
            <span className="text-gray-500 font-normal">(Opcional)</span>
          </label>
          <div className="relative">
            <input
              type="file"
              ref={attachmentInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => attachmentInputRef.current?.click()}
              className={`w-full px-4 py-3 rounded-lg border-2 border-dashed ${
                errors.attachment ? "border-red-500" : "border-gray-300"
              } hover:border-[#d50058] transition text-left flex items-center justify-between group`}
            >
              <span
                className={
                  formData.attachment
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }
              >
                {formData.attachment
                  ? formData.attachment.name
                  : translations.attachmentHelp}
              </span>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-[#d50058]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {translations.attachmentHelp}
          </p>
          {errors.attachment && (
            <p className="mt-1 text-sm text-red-500">{errors.attachment}</p>
          )}
        </div>

        {/* Honeypot - Campo invisible para bots */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Consentimiento de privacidad */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => {
                setFormData({ ...formData, privacyConsent: e.target.checked });
                setErrors({ ...errors, privacyConsent: "" });
              }}
              className="mt-1 w-5 h-5 text-[#d50058] border-gray-300 rounded focus:ring-2 focus:ring-[#d50058]"
            />
            <span className="text-sm text-gray-700">
              {translations.privacyConsent}{" "}
              <a
                href={translations.privacyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d50058] font-semibold hover:underline"
              >
                {translations.privacyLinkText}
              </a>
              . <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="mt-1 text-sm text-red-500 ml-8">
              {errors.privacyConsent}
            </p>
          )}
        </div>

        {/* Progress bar durante envío */}
        {isSubmitting && submitProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d50058] to-[#f5347b]"
              initial={{ width: 0 }}
              animate={{ width: `${submitProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

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
              <span>{translations.sending}</span>
            </>
          ) : (
            <>
              <span>{translations.submit}</span>
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
