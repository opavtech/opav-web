import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Rate limiting
const applicationAttempts = new Map<string, number[]>();

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string, ip: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("reCAPTCHA not configured, skipping verification");
    return true; // Skip if not configured
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${ip}`,
      }
    );

    const data = await response.json();

    // Score threshold: 0.5 (0 = bot, 1 = human)
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  const maxAttempts = 5; // Más estricto que upload

  const attempts = applicationAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  applicationAttempts.set(ip, recentAttempts);
  return true;
}

// Validación server-side
function validateApplication(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push("Full name is required");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.phone || !/^\+?[\d\s\-()]{10,}$/.test(data.phone)) {
    errors.push("Valid phone number is required");
  }

  if (!data.resumeUrl) {
    errors.push("Resume URL is required");
  }

  if (!data.coverLetter || data.coverLetter.trim().length < 10) {
    errors.push("Cover letter is required (min 10 characters)");
  }

  if (!data.positionOfInterest || data.positionOfInterest.trim().length < 2) {
    errors.push("Position of interest is required");
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many application attempts. Please try again later." },
        { status: 429 }
      );
    }

    const data = await request.json();

    // reCAPTCHA verification
    if (data.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(data.recaptchaToken, ip);
      if (!isValidRecaptcha) {
        console.warn("reCAPTCHA verification failed for IP:", ip);
        return NextResponse.json(
          { error: "reCAPTCHA verification failed" },
          { status: 400 }
        );
      }
    }

    // Honeypot check - if filled, it's a bot
    if (data.website) {
      console.warn("Bot detected via honeypot field:", ip);
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    // Validación
    const validation = validateApplication(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Sanitización básica
    const sanitizedData = {
      fullName: data.fullName.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 100),
      phone: data.phone.trim().substring(0, 20),
      resumeUrl: data.resumeUrl,
      coverLetter: data.coverLetter.substring(0, 5000),
      positionOfInterest: data.positionOfInterest.trim().substring(0, 200),
      salaryExpectation:
        data.salaryExpectation?.trim().substring(0, 100) || null,
      vacante: data.vacanteId || null,
      source: data.vacanteId ? "specific" : "spontaneous",
      applicationStatus: "pending",
      applicationLocale: data.locale || "es",
    };

    // Guardar en Strapi
    const strapiResponse = await fetch(`${STRAPI_URL}/api/job-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: sanitizedData,
      }),
    });

    if (!strapiResponse.ok) {
      const errorText = await strapiResponse.text();
      console.error("Strapi error:", errorText);
      throw new Error("Failed to save application to Strapi");
    }

    const strapiData = await strapiResponse.json();

    // HubSpot se enviará automáticamente vía webhook de Strapi
    // (configurado en lifecycle de job-application)

    return NextResponse.json({
      success: true,
      id: strapiData.data.id,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
