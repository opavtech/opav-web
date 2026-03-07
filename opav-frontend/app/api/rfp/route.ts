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

import { applyRateLimit, getClientIp } from "@/lib/rate-limit";

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


function validateRFP(data: any): {
  valid: boolean;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    fields.fullName = "Full name is required (min 2 characters)";
  }
  if (!data.company || data.company.trim().length < 2) {
    fields.company = "Company name is required";
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    fields.email = "Valid email is required";
  }
  if (!data.phone || !/^\+?[\d\s\-()]{10,}$/.test(data.phone)) {
    fields.phone = "Valid phone number is required";
  }
  if (!data.city || data.city.trim().length < 2) {
    fields.city = "City is required";
  }
  if (!data.projectDescription || data.projectDescription.trim().length < 10) {
    fields.projectDescription =
      "Project description is required (min 10 characters)";
  }
  if (!data.brand || !["opav", "bs"].includes(data.brand)) {
    fields.brand = "Invalid brand";
  }

  return { valid: Object.keys(fields).length === 0, fields };
}

async function sendRFPEmail(data: any): Promise<void> {
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!resend || !toEmail) {
    console.warn(
      "[Email] Resend not configured or CONTACT_TO_EMAIL missing — skipping email",
    );
    return;
  }

  const isEn = data.rfpLocale === "en";
  const brandLabel = data.brand === "opav" ? "OPAV SAS" : "B&S Facilities";
  const brandColor = data.brand === "opav" ? "#d50058" : "#00acc8";

  const subject = isEn
    ? `New RFP from ${data.fullName} – ${brandLabel}`
    : `Nueva solicitud de propuesta de ${data.fullName} – ${brandLabel}`;

  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL no está configurado");
  }

  const operatorLabel = isEn ? "Current operator?" : "¿Operador actual?";
  const operatorValue =
    data.hasCurrentOperator === "yes"
      ? isEn
        ? "Yes"
        : "Sí"
      : data.hasCurrentOperator === "no"
        ? "No"
        : isEn
          ? "Not specified"
          : "No especificado";

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: toEmail,
    replyTo: data.email,
    subject,
    html: `
      <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">
        ${isEn ? `New RFP from ${data.fullName} – ${data.company}` : `Nueva RFP de ${data.fullName} – ${data.company}`}
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
      </div>
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:${brandColor};padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">
            ${isEn ? "New RFP Request" : "Nueva Solicitud de Propuesta"} — ${brandLabel}
          </h2>
        </div>
        <div style="background:#f9fafb;padding:24px 32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
          <table style="border-collapse:collapse;width:100%;font-size:14px">
            <tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0;width:180px">${isEn ? "Name" : "Nombre"}</td><td style="padding:8px 12px;background:white">${data.fullName}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0">${isEn ? "Company" : "Empresa"}</td><td style="padding:8px 12px;background:white">${data.company}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0">Email</td><td style="padding:8px 12px;background:white"><a href="mailto:${data.email}" style="color:${brandColor}">${data.email}</a></td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0">${isEn ? "Phone" : "Teléfono"}</td><td style="padding:8px 12px;background:white">${data.phone}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0">${isEn ? "City" : "Ciudad"}</td><td style="padding:8px 12px;background:white">${data.city}</td></tr>
            ${data.estimatedBudget ? `<tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0">${isEn ? "Estimated Budget" : "Presupuesto estimado"}</td><td style="padding:8px 12px;background:white">${data.estimatedBudget}</td></tr>` : ""}
            <tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0">${operatorLabel}</td><td style="padding:8px 12px;background:white">${operatorValue}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;background:#f0f0f0;vertical-align:top">${isEn ? "Project Description" : "Descripción del proyecto"}</td><td style="padding:8px 12px;background:white;white-space:pre-wrap">${data.projectDescription}</td></tr>
          </table>
          ${data.attachmentUrl ? `<p style="margin-top:16px"><strong>${isEn ? "Attachment" : "Adjunto"}:</strong> <a href="${data.attachmentUrl}" style="color:${brandColor}">${data.attachmentUrl}</a></p>` : ""}
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
          <p style="color:#9ca3af;font-size:12px;margin:0">opavsas.com – ${isEn ? "RFP Form" : "Formulario de propuesta"} – ${brandLabel}</p>
        </div>
      </div>
    `,
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const rlRes = await applyRateLimit(ip, "rfp");
    if (rlRes) return rlRes;

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

    // Honeypot check
    if (data.website) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 },
      );
    }

    const validation = validateRFP(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", fields: validation.fields },
        { status: 400 },
      );
    }

    const sanitizedData = {
      fullName: data.fullName.trim().substring(0, 100),
      company: data.company.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 100),
      phone: data.phone.trim().substring(0, 20),
      city: data.city.trim().substring(0, 100),
      projectDescription: data.projectDescription.trim().substring(0, 3000),
      estimatedBudget: data.estimatedBudget?.trim().substring(0, 100) || null,
      hasCurrentOperator: data.hasCurrentOperator || null,
      attachmentUrl: data.attachmentUrl || null,
      brand: data.brand,
      rfpLocale: data.locale || "es",
      contactType: "rfp_form",
      ipAddress: ip !== "unknown" ? ip : null,
    };

    // Send email
    try {
      await sendRFPEmail(sanitizedData);
    } catch (emailError) {
      console.error("[Email] Failed to send RFP email:", emailError);
    }

    // Save to Strapi (graceful fail)
    let strapiId: number | null = null;
    try {
      const strapiResponse = await fetch(
        `${STRAPI_URL}/api/contact-submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ data: sanitizedData }),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (strapiResponse.ok) {
        const strapiData = await strapiResponse.json();
        strapiId = strapiData.data?.id ?? null;
      } else {
        console.warn("[Strapi] RFP submission failed:", strapiResponse.status);
      }
    } catch (strapiError) {
      console.warn("[Strapi] Not reachable, skipping CMS save:", strapiError);
    }

    return NextResponse.json({
      success: true,
      id: strapiId,
      message: "RFP submitted successfully",
    });
  } catch (error) {
    console.error("RFP submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit RFP" },
      { status: 500 },
    );
  }
}
