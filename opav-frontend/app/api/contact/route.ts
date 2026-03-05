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

// Rate limiting
const contactAttempts = new Map<string, number[]>();

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
  const maxAttempts = 10;

  const attempts = contactAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) return false;

  recentAttempts.push(now);
  contactAttempts.set(ip, recentAttempts);
  return true;
}

function validateContact(data: any): {
  valid: boolean;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    fields.fullName = "Full name is required (min 2 characters)";
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    fields.email = "Valid email is required";
  }
  if (!data.phone || !/^\+?[\d\s\-()]{10,}$/.test(data.phone)) {
    fields.phone = "Valid phone number is required";
  }
  if (!data.message || data.message.trim().length < 10) {
    fields.message = "Message is required (min 10 characters)";
  }

  return { valid: Object.keys(fields).length === 0, fields };
}

async function sendContactEmail(data: any): Promise<void> {
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!resend || !toEmail) {
    console.warn(
      "[Email] Resend not configured or CONTACT_TO_EMAIL missing — skipping email",
    );
    return;
  }

  const isEn = data.contactLocale === "en";
  const subject = isEn
    ? `New contact message from ${data.fullName}`
    : `Nuevo mensaje de contacto de ${data.fullName}`;

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
        ${isEn ? `New message from ${data.fullName} – ${data.phone}` : `Nuevo mensaje de ${data.fullName} – ${data.phone}`}
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
      </div>
      <h2 style="color:#d50058">${isEn ? "New Contact Message" : "Nuevo Mensaje de Contacto"}</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5;width:140px">${isEn ? "Name" : "Nombre"}</td><td style="padding:8px 12px">${data.fullName}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Email</td><td style="padding:8px 12px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Phone" : "Teléfono"}</td><td style="padding:8px 12px">${data.phone}</td></tr>
        ${data.company ? `<tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Company" : "Empresa"}</td><td style="padding:8px 12px">${data.company}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5;vertical-align:top">${isEn ? "Message" : "Mensaje"}</td><td style="padding:8px 12px;white-space:pre-wrap">${data.message}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Language" : "Idioma"}</td><td style="padding:8px 12px">${data.contactLocale}</td></tr>
      </table>
      ${data.attachmentUrl ? `<p><strong>${isEn ? "Attachment" : "Adjunto"}:</strong> <a href="${data.attachmentUrl}">${data.attachmentUrl}</a></p>` : ""}
      <hr style="margin-top:24px"/>
      <p style="color:#888;font-size:12px">opavsas.com – ${isEn ? "Contact form" : "Formulario de contacto"}</p>
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
        { error: "Too many contact attempts. Please try again later." },
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

    // Honeypot check
    if (data.website) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 },
      );
    }

    const validation = validateContact(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", fields: validation.fields },
        { status: 400 },
      );
    }

    const sanitizedData = {
      fullName: data.fullName.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 100),
      phone: data.phone.trim().substring(0, 20),
      company: data.company?.trim().substring(0, 100) || null,
      message: data.message.trim().substring(0, 2000),
      attachmentUrl: data.attachmentUrl || null,
      contactType: "contact_form",
      contactLocale: data.locale || "es",
      ipAddress: ip !== "unknown" ? ip : null,
    };

    // Send email (primary — always attempted)
    try {
      await sendContactEmail(sanitizedData);
    } catch (emailError) {
      console.error("[Email] Failed to send contact email:", emailError);
      // Don't block the response — Strapi save is the secondary record
    }

    // Save to Strapi (secondary — graceful fail)
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
        console.warn(
          "[Strapi] Contact submission failed:",
          strapiResponse.status,
        );
      }
    } catch (strapiError) {
      console.warn("[Strapi] Not reachable, skipping CMS save:", strapiError);
    }

    return NextResponse.json({
      success: true,
      id: strapiId,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
