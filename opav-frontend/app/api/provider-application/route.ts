/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const providerAttempts = new Map<string, number[]>();

async function verifyRecaptcha(token: string, ip: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("reCAPTCHA not configured, skipping verification");
    return true;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${ip}`,
      },
    );
    const data = await response.json();
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxAttempts = 5;

  const attempts = providerAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) return false;

  recentAttempts.push(now);
  providerAttempts.set(ip, recentAttempts);
  return true;
}

function validateProviderApplication(data: any): {
  valid: boolean;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};

  if (!data.companyName || data.companyName.trim().length < 2) {
    fields.companyName = "Company name is required (min 2 characters)";
  }
  if (!data.nit || data.nit.trim().length < 5) {
    fields.nit = "NIT is required (min 5 characters)";
  }
  if (!data.legalRepresentative || data.legalRepresentative.trim().length < 3) {
    fields.legalRepresentative =
      "Legal representative name is required (min 3 characters)";
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    fields.email = "Valid email is required";
  }
  if (!data.phone || !/^\+?[\d\s\-()]{7,20}$/.test(data.phone)) {
    fields.phone = "Valid phone number is required";
  }
  if (!data.address || data.address.trim().length < 10) {
    fields.address = "Address is required (min 10 characters)";
  }
  if (
    !data.providerType ||
    !["service", "product", "both"].includes(data.providerType)
  ) {
    fields.providerType =
      "Valid provider type is required (service, product, or both)";
  }
  if (
    !data.operationalContactName ||
    data.operationalContactName.trim().length < 3
  ) {
    fields.operationalContactName =
      "Operational contact name is required (min 3 characters)";
  }
  if (data.dataConsent !== true) {
    fields.dataConsent = "Data consent is required";
  }

  return { valid: Object.keys(fields).length === 0, fields };
}

const PROVIDER_TYPE_LABELS: Record<string, string> = {
  service: "Servicios",
  product: "Productos",
  both: "Servicios y Productos",
};

async function sendProviderEmail(data: any): Promise<void> {
  const toEmail = process.env.PROVIDERS_TO_EMAIL;
  if (!resend || !toEmail) {
    console.warn(
      "[Email] Resend not configured or PROVIDERS_TO_EMAIL missing — skipping email",
    );
    return;
  }

  const isEn = data.locale === "en";
  const subject = isEn
    ? `New provider application: ${data.companyName}`
    : `Nueva solicitud de proveedor: ${data.companyName}`;

  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL no está configurado");
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: toEmail,
    replyTo: data.email,
    subject,
    html: `
      <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">
        ${isEn ? `Provider application from ${data.companyName} – ${PROVIDER_TYPE_LABELS[data.providerType] || data.providerType}` : `Solicitud de proveedor de ${data.companyName} – ${PROVIDER_TYPE_LABELS[data.providerType] || data.providerType}`}
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
      </div>
      <h2 style="color:#d50058">${isEn ? "New Provider Application" : "Nueva Solicitud de Proveedor"}</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5;width:200px">${isEn ? "Company" : "Empresa"}</td><td style="padding:8px 12px">${data.companyName}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">NIT</td><td style="padding:8px 12px">${data.nit}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Legal Representative" : "Representante Legal"}</td><td style="padding:8px 12px">${data.legalRepresentative}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Email</td><td style="padding:8px 12px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Phone" : "Teléfono"}</td><td style="padding:8px 12px">${data.phone}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Address" : "Dirección"}</td><td style="padding:8px 12px">${data.address}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Provider Type" : "Tipo de proveedor"}</td><td style="padding:8px 12px">${PROVIDER_TYPE_LABELS[data.providerType] || data.providerType}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Operational Contact" : "Contacto Operativo"}</td><td style="padding:8px 12px">${data.operationalContactName}</td></tr>
      </table>
      <hr style="margin-top:24px"/>
      <p style="color:#888;font-size:12px">opavsas.com – ${isEn ? "Provider application form" : "Formulario de solicitud de proveedor"}</p>
    `,
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please try again later." },
        { status: 429 },
      );
    }

    const data = await request.json();

    if (!data.recaptchaToken) {
      return NextResponse.json(
        { error: "reCAPTCHA token requerido" },
        { status: 400 },
      );
    }

    const isValidCaptcha = await verifyRecaptcha(data.recaptchaToken, ip);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: "reCAPTCHA inválido" },
        { status: 400 },
      );
    }

    // Honeypot check — silently succeed to fool bots
    if (data.website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const validation = validateProviderApplication(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", fields: validation.fields },
        { status: 400 },
      );
    }

    const sanitizedData = {
      companyName: data.companyName.trim().substring(0, 150),
      nit: data.nit.trim().substring(0, 50),
      legalRepresentative: data.legalRepresentative.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 100),
      phone: data.phone.trim().substring(0, 20),
      address: data.address.trim().substring(0, 250),
      providerType: data.providerType,
      operationalContactName: data.operationalContactName.trim().substring(0, 100),
      dataConsent: true,
      applicationStatus: "pending",
      locale: data.locale || "es",
    };

    // Send email (primary)
    try {
      await sendProviderEmail(sanitizedData);
    } catch (emailError) {
      console.error("[Email] Failed to send provider email:", emailError);
    }

    // Save to Strapi (secondary — graceful fail)
    let strapiId: number | null = null;
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (STRAPI_API_TOKEN) {
        headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
      }

      const strapiResponse = await fetch(
        `${STRAPI_URL}/api/provider-applications`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ data: sanitizedData }),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (strapiResponse.ok) {
        const result = await strapiResponse.json();
        strapiId = result.data?.id ?? null;
      } else {
        console.warn(
          "[Strapi] Provider application failed:",
          strapiResponse.status,
        );
      }
    } catch (strapiError) {
      console.warn("[Strapi] Not reachable, skipping CMS save:", strapiError);
    }

    return NextResponse.json({
      success: true,
      message: "Provider application submitted successfully",
      id: strapiId,
    });
  } catch (error) {
    console.error("Provider application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
