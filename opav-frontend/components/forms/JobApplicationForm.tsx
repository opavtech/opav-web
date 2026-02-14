"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { executeRecaptcha } from "@/lib/recaptcha";

interface JobApplicationFormProps {
  vacanteId?: number;
  positionTitle?: string;
  locale: string;
  translations: {
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    resume: string;
    resumeHelp: string;
    coverLetter: string;
    coverLetterPlaceholder: string;
    coverLetterUpload: string;
    positionOfInterest: string;
    positionPlaceholder: string;
    salaryExpectation: string;
    salaryPlaceholder: string;
    salaryOptional: string;
    privacyConsent: string;
    privacyLink: string;
    privacyLinkText: string;
    submit: string;
    sending: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
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
  resume: File | null;
  coverLetter: string;
  coverLetterFile: File | null;
  positionOfInterest: string;
  salaryExpectation: string;
  privacyConsent: boolean;
  // Honeypot field (invisible to users, bots fill it)
  website: string;
}

export default function JobApplicationForm({
  vacanteId,
  positionTitle,
  locale,
  translations,
}: JobApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
    coverLetterFile: null,
    positionOfInterest: positionTitle || "",
    salaryExpectation: "",
    privacyConsent: false,
    website: "", // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [coverLetterMode, setCoverLetterMode] = useState<"text" | "file">(
    "text"
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterFileInputRef = useRef<HTMLInputElement>(null);

  // Validación básica
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Honeypot check - si está lleno, es un bot
    if (formData.website) {
      console.warn("Bot detected via honeypot");
      return false;
    }

    if (!formData.fullName.trim()) {
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

    if (!formData.resume) {
      newErrors.resume = translations.required;
    } else {
      if (formData.resume.size > 5 * 1024 * 1024) {
        newErrors.resume = translations.fileTooBig;
      }
      if (
        !formData.resume.type.includes("pdf") &&
        !formData.resume.type.includes("word")
      ) {
        newErrors.resume = translations.invalidFileType;
      }
    }

    if (coverLetterMode === "text" && !formData.coverLetter.trim()) {
      newErrors.coverLetter = translations.required;
    }

    if (coverLetterMode === "file" && !formData.coverLetterFile) {
      newErrors.coverLetter = translations.required;
    }

    if (!formData.positionOfInterest.trim()) {
      newErrors.positionOfInterest = translations.required;
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
    setUploadProgress(0);

    try {
      // 0. Execute reCAPTCHA (if configured)
      const recaptchaToken = await executeRecaptcha("job_application");
      setUploadProgress(10);

      // 1. Subir archivos
      const formDataToSend = new FormData();

      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      if (coverLetterMode === "file" && formData.coverLetterFile) {
        formDataToSend.append("coverLetter", formData.coverLetterFile);
      }

      setUploadProgress(30);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const { resumeUrl, coverLetterUrl } = await uploadResponse.json();
      setUploadProgress(60);

      // 2. Enviar aplicación
      const applicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        resumeUrl,
        coverLetter:
          coverLetterMode === "text" ? formData.coverLetter : coverLetterUrl,
        positionOfInterest: formData.positionOfInterest,
        salaryExpectation: formData.salaryExpectation || null,
        vacanteId: vacanteId || null,
        locale,
        recaptchaToken, // Include reCAPTCHA token
        website: formData.website, // Include honeypot field
      };

      setUploadProgress(80);

      const response = await fetch("/api/job-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error("Application submission failed");
      }

      setUploadProgress(100);
      setSubmitStatus("success");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: "",
        coverLetterFile: null,
        positionOfInterest: positionTitle || "",
        salaryExpectation: "",
        privacyConsent: false,
        website: "", // Honeypot
      });

      if (resumeInputRef.current) resumeInputRef.current.value = "";
      if (coverLetterFileInputRef.current)
        coverLetterFileInputRef.current.value = "";
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "resume" | "coverLetterFile"
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-['Inter']">
          {translations.title}
        </h2>
        <p className="text-gray-600 text-lg">{translations.subtitle}</p>
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
                  {translations.successTitle}
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
                  {translations.errorTitle}
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
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              setErrors({ ...errors, fullName: "" });
            }}
            placeholder={translations.fullNamePlaceholder}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email y Teléfono en grid */}
        <div className="grid md:grid-cols-2 gap-6">
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
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
              placeholder={translations.emailPlaceholder}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
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
              {translations.phone} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                setErrors({ ...errors, phone: "" });
              }}
              placeholder={translations.phonePlaceholder}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Hoja de Vida */}
        <div>
          <label
            htmlFor="resume"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.resume} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              id="resume"
              ref={resumeInputRef}
              onChange={(e) => handleFileChange(e, "resume")}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              className={`w-full px-4 py-3 rounded-lg border-2 border-dashed ${
                errors.resume ? "border-red-500" : "border-gray-300"
              } hover:border-[#d50058] transition text-left flex items-center justify-between group`}
            >
              <span
                className={
                  formData.resume
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }
              >
                {formData.resume
                  ? formData.resume.name
                  : translations.resumeHelp}
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
            {translations.resumeHelp}
          </p>
          {errors.resume && (
            <p className="mt-1 text-sm text-red-500">{errors.resume}</p>
          )}
        </div>

        {/* Carta de Presentación */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {translations.coverLetter} <span className="text-red-500">*</span>
          </label>

          {/* Toggle */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setCoverLetterMode("text")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                coverLetterMode === "text"
                  ? "bg-[#d50058] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Escribir
            </button>
            <button
              type="button"
              onClick={() => setCoverLetterMode("file")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                coverLetterMode === "file"
                  ? "bg-[#d50058] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {translations.coverLetterUpload}
            </button>
          </div>

          {coverLetterMode === "text" ? (
            <textarea
              value={formData.coverLetter}
              onChange={(e) => {
                setFormData({ ...formData, coverLetter: e.target.value });
                setErrors({ ...errors, coverLetter: "" });
              }}
              placeholder={translations.coverLetterPlaceholder}
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.coverLetter ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition resize-none`}
            />
          ) : (
            <div className="relative">
              <input
                type="file"
                ref={coverLetterFileInputRef}
                onChange={(e) => handleFileChange(e, "coverLetterFile")}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverLetterFileInputRef.current?.click()}
                className={`w-full px-4 py-3 rounded-lg border-2 border-dashed ${
                  errors.coverLetter ? "border-red-500" : "border-gray-300"
                } hover:border-[#d50058] transition text-left flex items-center justify-between group`}
              >
                <span
                  className={
                    formData.coverLetterFile
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }
                >
                  {formData.coverLetterFile
                    ? formData.coverLetterFile.name
                    : "Seleccionar archivo..."}
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
          )}
          {errors.coverLetter && (
            <p className="mt-1 text-sm text-red-500">{errors.coverLetter}</p>
          )}
        </div>

        {/* Cargo/Área de Interés */}
        <div>
          <label
            htmlFor="positionOfInterest"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.positionOfInterest}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="positionOfInterest"
            value={formData.positionOfInterest}
            onChange={(e) => {
              setFormData({ ...formData, positionOfInterest: e.target.value });
              setErrors({ ...errors, positionOfInterest: "" });
            }}
            placeholder={translations.positionPlaceholder}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.positionOfInterest ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition`}
            readOnly={!!positionTitle}
          />
          {errors.positionOfInterest && (
            <p className="mt-1 text-sm text-red-500">
              {errors.positionOfInterest}
            </p>
          )}
        </div>

        {/* Expectativa Salarial */}
        <div>
          <label
            htmlFor="salaryExpectation"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {translations.salaryExpectation}{" "}
            <span className="text-gray-500 font-normal">
              ({translations.salaryOptional})
            </span>
          </label>
          <input
            type="text"
            id="salaryExpectation"
            value={formData.salaryExpectation}
            onChange={(e) =>
              setFormData({ ...formData, salaryExpectation: e.target.value })
            }
            placeholder={translations.salaryPlaceholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d50058] focus:border-transparent transition"
          />
        </div>

        {/* Consentimiento */}
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
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />
        </div>

        {/* Progress Bar */}
        {isSubmitting && uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d50058] to-[#f5347b]"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

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
