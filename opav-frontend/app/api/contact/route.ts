import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Rate limiting
const contactAttempts = new Map<string, number[]>();

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
  const maxAttempts = 10; // Más permisivo que job-application

  const attempts = contactAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  contactAttempts.set(ip, recentAttempts);
  return true;
}

// Validación server-side
function validateContact(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push("Full name is required (min 2 characters)");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.phone || !/^\+?[\d\s\-()]{10,}$/.test(data.phone)) {
    errors.push("Valid phone number is required");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message is required (min 10 characters)");
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
        { error: "Too many contact attempts. Please try again later." },
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
    const validation = validateContact(data);
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
      company: data.company?.trim().substring(0, 100) || null,
      message: data.message.trim().substring(0, 2000),
      attachmentUrl: data.attachmentUrl || null,
      contactType: "contact_form",
      contactLocale: data.locale || "es",
      ipAddress: ip !== "unknown" ? ip : null,
    };

    // Guardar en Strapi
    const strapiResponse = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
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
      throw new Error("Failed to save contact to Strapi");
    }

    const strapiData = await strapiResponse.json();

    // HubSpot se enviará automáticamente vía webhook de Strapi
    // (si está configurado en lifecycle de contact-submissions)

    return NextResponse.json({
      success: true,
      id: strapiData.data.id,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
