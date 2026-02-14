import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Rate limiting - in-memory store (use Redis in production)
const providerAttempts = new Map<string, number[]>();

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
      },
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
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxAttempts = 5; // 5 submissions per hour per IP

  const attempts = providerAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  providerAttempts.set(ip, recentAttempts);
  return true;
}

// Server-side validation
function validateProviderApplication(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Company name validation
  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.push("Company name is required (min 2 characters)");
  }

  // NIT validation
  if (!data.nit || data.nit.trim().length < 5) {
    errors.push("NIT is required (min 5 characters)");
  }

  // Legal representative validation
  if (!data.legalRepresentative || data.legalRepresentative.trim().length < 3) {
    errors.push("Legal representative name is required (min 3 characters)");
  }

  // Email validation
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }

  // Phone validation
  if (!data.phone || !/^\+?[\d\s\-()]{7,20}$/.test(data.phone)) {
    errors.push("Valid phone number is required");
  }

  // Address validation
  if (!data.address || data.address.trim().length < 10) {
    errors.push("Address is required (min 10 characters)");
  }

  // Provider type validation
  if (
    !data.providerType ||
    !["service", "product", "both"].includes(data.providerType)
  ) {
    errors.push("Valid provider type is required (service, product, or both)");
  }

  // Operational contact name validation
  if (
    !data.operationalContactName ||
    data.operationalContactName.trim().length < 3
  ) {
    errors.push("Operational contact name is required (min 3 characters)");
  }

  // Data consent validation
  if (data.dataConsent !== true) {
    errors.push("Data consent is required");
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
        { error: "Too many submission attempts. Please try again later." },
        { status: 429 },
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
          { status: 400 },
        );
      }
    }

    // Honeypot check - this field should never be filled by humans
    if (data.website) {
      console.warn("Bot detected via honeypot field:", ip);
      // Silently fail - don't give bots info
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Server-side validation
    const validation = validateProviderApplication(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    // Sanitization - trim and limit field lengths
    const sanitizedData = {
      companyName: data.companyName.trim().substring(0, 150),
      nit: data.nit.trim().substring(0, 50),
      legalRepresentative: data.legalRepresentative.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 100),
      phone: data.phone.trim().substring(0, 20),
      address: data.address.trim().substring(0, 250),
      providerType: data.providerType,
      operationalContactName: data.operationalContactName
        .trim()
        .substring(0, 100),
      dataConsent: true,
      applicationStatus: "pending",
      locale: data.locale || "es",
    };

    // Save to Strapi
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Use API token if available
    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const strapiResponse = await fetch(
      `${STRAPI_URL}/api/provider-applications`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: sanitizedData,
        }),
      },
    );

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json();
      console.error("Strapi error:", errorData);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 },
      );
    }

    const result = await strapiResponse.json();

    return NextResponse.json({
      success: true,
      message: "Provider application submitted successfully",
      id: result.data?.id,
    });
  } catch (error) {
    console.error("Provider application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
