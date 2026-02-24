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
const applicationAttempts = new Map<string, number[]>();

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

  const attempts = applicationAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) return false;

  recentAttempts.push(now);
  applicationAttempts.set(ip, recentAttempts);
  return true;
}

function validateApplication(data: any): {
  valid: boolean;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    fields.fullName = "Full name is required";
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    fields.email = "Valid email is required";
  }
  if (!data.phone || !/^\+?[\d\s\-()]{10,}$/.test(data.phone)) {
    fields.phone = "Valid phone number is required";
  }
  if (!data.resumeData?.encoded) {
    fields.resume = "Resume file is required";
  }
  if (!data.coverLetter || data.coverLetter.trim().length < 10) {
    fields.coverLetter = "Cover letter is required (min 10 characters)";
  }
  if (!data.positionOfInterest || data.positionOfInterest.trim().length < 2) {
    fields.positionOfInterest = "Position of interest is required";
  }

  return { valid: Object.keys(fields).length === 0, fields };
}

async function sendJobApplicationEmail(data: any): Promise<void> {
  const toEmail = process.env.JOBS_TO_EMAIL;
  if (!resend || !toEmail) {
    console.warn(
      "[Email] Resend not configured or JOBS_TO_EMAIL missing — skipping email",
    );
    return;
  }

  const isEn = data.applicationLocale === "en";
  const subject = isEn
    ? `Job Application: ${data.positionOfInterest} – ${data.fullName}`
    : `Aplicación de empleo: ${data.positionOfInterest} – ${data.fullName}`;

  const attachments: any[] = [];

  if (data.resumeData?.encoded) {
    attachments.push({
      filename: data.resumeData.name || "resume.pdf",
      content: data.resumeData.encoded,
    });
  }

  if (data.coverLetterData?.encoded) {
    attachments.push({
      filename: data.coverLetterData.name || "cover-letter.pdf",
      content: data.coverLetterData.encoded,
    });
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@opav.com.co",
    to: toEmail,
    replyTo: data.email,
    subject,
    html: `
      <h2 style="color:#d50058">${isEn ? "New Job Application" : "Nueva Solicitud de Empleo"}</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5;width:180px">${isEn ? "Name" : "Nombre"}</td><td style="padding:8px 12px">${data.fullName}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Email</td><td style="padding:8px 12px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Phone" : "Teléfono"}</td><td style="padding:8px 12px">${data.phone}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Position" : "Cargo de interés"}</td><td style="padding:8px 12px">${data.positionOfInterest}</td></tr>
        ${data.salaryExpectation ? `<tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Salary Expectation" : "Expectativa salarial"}</td><td style="padding:8px 12px">${data.salaryExpectation}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5;vertical-align:top">${isEn ? "Cover Letter" : "Carta de presentación"}</td><td style="padding:8px 12px;white-space:pre-wrap">${data.coverLetter}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">${isEn ? "Source" : "Origen"}</td><td style="padding:8px 12px">${data.source}</td></tr>
      </table>
      <p style="color:#888;margin-top:16px">📎 ${isEn ? "Files attached above" : "Archivos adjuntos arriba"}</p>
      <hr style="margin-top:24px"/>
      <p style="color:#888;font-size:12px">OPAV.com.co – ${isEn ? "Job application form" : "Formulario de aplicación de empleo"}</p>
    `,
    attachments,
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
        { error: "Too many application attempts. Please try again later." },
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

    if (data.website) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 },
      );
    }

    const validation = validateApplication(data);
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
      resumeData: data.resumeData,
      coverLetterData: data.coverLetterData || null,
      coverLetter: data.coverLetter.substring(0, 5000),
      positionOfInterest: data.positionOfInterest.trim().substring(0, 200),
      salaryExpectation: data.salaryExpectation?.trim().substring(0, 100) || null,
      vacante: data.vacanteId || null,
      source: data.vacanteId ? "specific" : "spontaneous",
      applicationStatus: "pending",
      applicationLocale: data.locale || "es",
    };

    // Send email with resume attached (primary)
    try {
      await sendJobApplicationEmail(sanitizedData);
    } catch (emailError) {
      console.error("[Email] Failed to send job application email:", emailError);
    }

    // Save to Strapi (secondary — graceful fail, without file data)
    let strapiId: number | null = null;
    try {
      const strapiPayload = {
        fullName: sanitizedData.fullName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        coverLetter: sanitizedData.coverLetter,
        positionOfInterest: sanitizedData.positionOfInterest,
        salaryExpectation: sanitizedData.salaryExpectation,
        vacante: sanitizedData.vacante,
        source: sanitizedData.source,
        applicationStatus: sanitizedData.applicationStatus,
        applicationLocale: sanitizedData.applicationLocale,
      };

      const strapiResponse = await fetch(
        `${STRAPI_URL}/api/job-applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ data: strapiPayload }),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (strapiResponse.ok) {
        const strapiData = await strapiResponse.json();
        strapiId = strapiData.data?.id ?? null;
      } else {
        console.warn(
          "[Strapi] Job application save failed:",
          strapiResponse.status,
        );
      }
    } catch (strapiError) {
      console.warn("[Strapi] Not reachable, skipping CMS save:", strapiError);
    }

    return NextResponse.json({
      success: true,
      id: strapiId,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
