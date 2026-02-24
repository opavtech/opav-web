import { NextRequest, NextResponse } from "next/server";

// Rate limiting simple con Map
const uploadAttempts = new Map<string, number[]>();

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Magic numbers for file type verification
const MAGIC_NUMBERS = {
  PDF: [0x25, 0x50, 0x44, 0x46], // %PDF
  DOC: [0xd0, 0xcf, 0x11, 0xe0], // DOC
  DOCX: [0x50, 0x4b, 0x03, 0x04], // DOCX (ZIP format)
};

async function verifyFileType(file: File | Blob): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const header = Array.from(bytes.slice(0, 4));

    const isPDF = header.every((byte, i) => byte === MAGIC_NUMBERS.PDF[i]);
    const isDOC = header.every((byte, i) => byte === MAGIC_NUMBERS.DOC[i]);
    const isDOCX = header.every((byte, i) => byte === MAGIC_NUMBERS.DOCX[i]);

    return isPDF || isDOC || isDOCX;
  } catch (error) {
    console.error("Error verifying file type:", error);
    return false;
  }
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  const maxAttempts = 10;

  const attempts = uploadAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  uploadAttempts.set(ip, recentAttempts);
  return true;
}

async function validateAndEncodeFile(
  file: File,
  fieldName: string,
): Promise<{ error?: string; encoded?: string; name?: string; type?: string }> {
  if (file.size > MAX_FILE_SIZE) {
    return { error: `${fieldName}: archivo muy grande (max 4MB)` };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      error: `Invalid ${fieldName} file type. Only PDF and Word documents allowed.`,
    };
  }

  const isValid = await verifyFileType(file);
  if (!isValid) {
    return {
      error: `Invalid ${fieldName} content. File does not match PDF or Word format.`,
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    encoded: buffer.toString("base64"),
    name: file.name,
    type: file.type,
  };
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many upload attempts. Please try again later." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const resume = formData.get("resume") as File | null;
    const coverLetter = formData.get("coverLetter") as File | null;

    if (!resume) {
      return NextResponse.json(
        { error: "Resume is required" },
        { status: 400 },
      );
    }

    // Validate and encode resume as base64 (no Strapi dependency)
    const resumeResult = await validateAndEncodeFile(resume, "Resume");
    if (resumeResult.error) {
      return NextResponse.json({ error: resumeResult.error }, { status: 400 });
    }

    let coverLetterResult: {
      encoded?: string;
      name?: string;
      type?: string;
    } | null = null;

    if (coverLetter) {
      const result = await validateAndEncodeFile(coverLetter, "Cover letter");
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      coverLetterResult = result;
    }

    // Return encoded file data — the job-application route will use it to send email
    return NextResponse.json({
      resume: {
        encoded: resumeResult.encoded,
        name: resumeResult.name,
        type: resumeResult.type,
      },
      coverLetter: coverLetterResult
        ? {
            encoded: coverLetterResult.encoded,
            name: coverLetterResult.name,
            type: coverLetterResult.type,
          }
        : null,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to process files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
