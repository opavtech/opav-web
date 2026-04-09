"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { executeRecaptcha } from "@/lib/recaptcha";

type Brand = "opav" | "bs";

interface RFPFormProps {
  locale: string;
  brand: Brand;
}

interface FormData {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  projectDescription: string;
  hasCurrentOperator: "" | "yes" | "no";
  attachment: File | null;
  privacyConsent: boolean;
  // Honeypot
  website: string;
}


const BRAND_CONFIG = {
  opav: {
    primary: "#d50058",
    primaryDark: "#a0003d",
    primaryLight: "rgba(213,0,88,0.1)",
    ring: "focus:ring-[#d50058]",
    border: "border-[#d50058]",
    bg: "bg-[#d50058]",
    bgHover: "hover:bg-[#a0003d]",
    gradient: "from-[#d50058] to-[#a0003d]",
    badge: "bg-[#d50058]/10 text-[#d50058]",
  },
  bs: {
    primary: "#00acc8",
    primaryDark: "#0088aa",
    primaryLight: "rgba(0,172,200,0.1)",
    ring: "focus:ring-[#00acc8]",
    border: "border-[#00acc8]",
    bg: "bg-[#00acc8]",
    bgHover: "hover:bg-[#0088aa]",
    gradient: "from-[#00acc8] to-[#0088aa]",
    badge: "bg-[#00acc8]/10 text-[#00acc8]",
  },
};

export default function RFPForm({ locale, brand }: RFPFormProps) {
  const isEs = locale === "es";
  const cfg = BRAND_CONFIG[brand];

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    city: "",
    projectDescription: "",
    hasCurrentOperator: "",
    attachment: null,
    privacyConsent: false,
    website: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitProgress, setSubmitProgress] = useState(0);

  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const t = {
    title: isEs ? "Solicitar Propuesta" : "Request a Proposal",
    subtitle: isEs
      ? "Completa el formulario y nuestro equipo te contactará con una propuesta personalizada"
      : "Fill out the form and our team will contact you with a personalized proposal",
    fullName: isEs ? "Nombre completo" : "Full name",
    fullNamePlaceholder: isEs ? "Juan Pérez" : "John Smith",
    company: isEs ? "Empresa" : "Company",
    companyPlaceholder: isEs ? "Nombre de su empresa" : "Your company name",
    phone: isEs ? "Teléfono" : "Phone",
    phonePlaceholder: isEs ? "+57 300 000 0000" : "+57 300 000 0000",
    email: isEs ? "Correo electrónico" : "Email address",
    emailPlaceholder: isEs ? "juan@empresa.com" : "john@company.com",
    city: isEs ? "Ciudad" : "City",
    cityPlaceholder: isEs ? "Bogotá" : "Bogotá",
    projectDescription: isEs ? "Descripción del proyecto" : "Project description",
    projectDescriptionPlaceholder: isEs
      ? "Cuéntenos sobre su proyecto: tipo de inmueble, área aproximada, servicios que requiere..."
      : "Tell us about your project: property type, approximate area, services required...",
    hasCurrentOperator: isEs ? "¿Cuenta con operador actual?" : "Do you have a current operator?",
    yes: isEs ? "Sí" : "Yes",
    no: isEs ? "No" : "No",
    attachment: isEs ? "Documento adjunto" : "Attachment",
    attachmentHelp: isEs
      ? "Adjunta RFP, planos o especificaciones técnicas (PDF o Word, máx. 5MB)"
      : "Attach RFP, blueprints or technical specs (PDF or Word, max. 5MB)",
    privacyConsent: isEs
      ? "Acepto el tratamiento de mis datos personales según la"
      : "I accept the processing of my personal data according to the",
    privacyLinkText: isEs ? "Política de Privacidad" : "Privacy Policy",
    submit: isEs ? "Enviar Solicitud" : "Submit Request",
    sending: isEs ? "Enviando..." : "Sending...",
    required: isEs ? "Este campo es obligatorio" : "This field is required",
    invalidEmail: isEs ? "Correo electrónico inválido" : "Invalid email address",
    invalidPhone: isEs ? "Número de teléfono inválido" : "Invalid phone number",
    fileTooBig: isEs ? "El archivo es demasiado grande (máx. 5MB)" : "File is too large (max. 5MB)",
    invalidFileType: isEs ? "Solo se permiten archivos PDF o Word" : "Only PDF or Word files are allowed",
    successTitle: isEs ? "¡Solicitud enviada!" : "Request sent!",
    successMessage: isEs
      ? "Hemos recibido tu solicitud. Nuestro equipo comercial te contactará en las próximas 24-48 horas hábiles."
      : "We have received your request. Our commercial team will contact you within the next 24-48 business hours.",
    errorTitle: isEs ? "Error al enviar" : "Error sending",
    errorMessage: isEs
      ? "Hubo un error al enviar la solicitud. Por favor intente nuevamente."
      : "There was an error submitting the request. Please try again.",
    optional: isEs ? "Opcional" : "Optional",
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.website) return false;

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = t.required;
    }
    if (!formData.company.trim() || formData.company.trim().length < 2) {
      newErrors.company = t.required;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.required;
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = t.invalidPhone;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!formData.city.trim()) {
      newErrors.city = t.required;
    }
    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = t.required;
    }
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = t.required;
    }

    if (formData.attachment) {
      if (formData.attachment.size > 5 * 1024 * 1024) {
        newErrors.attachment = t.fileTooBig;
      }
      if (
        !formData.attachment.type.includes("pdf") &&
        !formData.attachment.type.includes("word") &&
        !formData.attachment.type.includes("msword") &&
        !formData.attachment.type.includes("officedocument")
      ) {
        newErrors.attachment = t.invalidFileType;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitProgress(0);

    try {
      const recaptchaToken = await executeRecaptcha("rfp_form");
      setSubmitProgress(10);

      let attachmentUrl = null;

      if (formData.attachment) {
        const uploadFormData = new FormData();
        uploadFormData.append("resume", formData.attachment);
        setSubmitProgress(30);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) throw new Error("File upload failed");
        const { resumeUrl } = await uploadResponse.json();
        attachmentUrl = resumeUrl;
        setSubmitProgress(50);
      } else {
        setSubmitProgress(50);
      }

      const rfpData = {
        fullName: formData.fullName,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        projectDescription: formData.projectDescription,
        hasCurrentOperator: formData.hasCurrentOperator || null,
        attachmentUrl,
        brand,
        locale,
        recaptchaToken,
      };

      setSubmitProgress(70);

      const response = await fetch("/api/rfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rfpData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.fields) {
          setErrors((prev) => ({ ...prev, ...errorData.fields }));
        }
        throw new Error(errorData.error || "RFP submission failed");
      }

      setSubmitProgress(100);
      setSubmitStatus("success");

      setFormData({
        fullName: "",
        company: "",
        phone: "",
        email: "",
        city: "",
        projectDescription: "",
        hasCurrentOperator: "",
        attachment: null,
        privacyConsent: false,
        website: "",
      });

      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    } catch (error) {
      console.error("Error submitting RFP form:", error);
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

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } focus:ring-2 ${cfg.ring} focus:border-transparent transition`;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {t.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">{t.subtitle}</p>
      </div>

      {/* Success / Error Messages */}
      <AnimatePresence>
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-green-900">{t.successTitle}</h3>
                <p className="text-green-700 text-sm mt-1">{t.successMessage}</p>
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
              <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-red-900">{t.errorTitle}</h3>
                <p className="text-red-700 text-sm mt-1">{t.errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Fila 1: Nombre + Empresa */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="rfp-fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t.fullName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="rfp-fullName"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              className={inputClass("fullName")}
              placeholder=""
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="rfp-company" className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t.company} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="rfp-company"
              value={formData.company}
              onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
              className={inputClass("company")}
              placeholder=""
            />
            {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
          </div>
        </div>

        {/* Fila 2: Teléfono + Email */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="rfp-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t.phone} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="rfp-phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className={inputClass("phone")}
              placeholder=""
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="rfp-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t.email} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="rfp-email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className={inputClass("email")}
              placeholder=""
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        {/* Fila 3: Ciudad */}
        <div>
          <div>
            <label htmlFor="rfp-city" className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t.city} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="rfp-city"
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              className={inputClass("city")}
              placeholder=""
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
        </div>

        {/* Operador actual */}
        <div>
          <p className="block text-sm font-semibold text-gray-700 mb-2">
            {t.hasCurrentOperator}{" "}
            <span className="text-gray-400 font-normal">({t.optional})</span>
          </p>
          <div className="flex gap-4">
            {(["yes", "no"] as const).map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.hasCurrentOperator === val
                    ? `${cfg.border} ${cfg.badge}`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="hasCurrentOperator"
                  value={val}
                  checked={formData.hasCurrentOperator === val}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hasCurrentOperator: e.target.value as "yes" | "no" }))
                  }
                  className="sr-only"
                />
                <span className="text-sm font-medium">{val === "yes" ? t.yes : t.no}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Descripción del proyecto */}
        <div>
          <label htmlFor="rfp-description" className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t.projectDescription} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="rfp-description"
            value={formData.projectDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, projectDescription: e.target.value }))}
            rows={5}
            className={`${inputClass("projectDescription")} resize-none`}
            placeholder=""
          />
          {errors.projectDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.projectDescription}</p>
          )}
        </div>

        {/* Adjunto */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t.attachment}{" "}
            <span className="text-gray-400 font-normal">({t.optional})</span>
          </label>
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
            } hover:${cfg.border} transition text-left flex items-center justify-between group`}
          >
            <span className={formData.attachment ? "text-gray-900 font-medium text-sm" : "text-gray-400 text-sm"}>
              {formData.attachment ? formData.attachment.name : t.attachmentHelp}
            </span>
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </button>
          {errors.attachment && <p className="mt-1 text-sm text-red-500">{errors.attachment}</p>}
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Consentimiento */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => {
                setFormData({ ...formData, privacyConsent: e.target.checked });
                setErrors({ ...errors, privacyConsent: "" });
              }}
              className={`mt-1 w-5 h-5 rounded border-gray-300 focus:ring-2 ${cfg.ring}`}
              style={{ accentColor: cfg.primary }}
            />
            <span className="text-sm text-gray-700">
              {t.privacyConsent}{" "}
              <a
                href="/documents/politica-tratamiento-datos.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: cfg.primary }}
              >
                {t.privacyLinkText}
              </a>
              . <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="mt-1 text-sm text-red-500 ml-8">{errors.privacyConsent}</p>
          )}
        </div>

        {/* Progress bar */}
        {isSubmitting && submitProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${cfg.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${submitProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r ${cfg.gradient} hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{t.sending}</span>
            </>
          ) : (
            <>
              <span>{t.submit}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
