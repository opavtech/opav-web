import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Rate limiting simple con Map (en producción usa Upstash/Vercel KV)
const uploadAttempts = new Map<string, number[]>();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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

// Verify file type by magic number (server-side File/Blob)
async function verifyFileType(file: File | Blob): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const header = Array.from(bytes.slice(0, 4));

    // Check if matches any allowed magic number
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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many upload attempts. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const resume = formData.get("resume") as File | null;
    const coverLetter = formData.get("coverLetter") as File | null;

    if (!resume) {
      return NextResponse.json(
        { error: "Resume is required" },
        { status: 400 }
      );
    }

    // Validar resume
    if (resume.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid resume file type. Only PDF and Word documents allowed.",
        },
        { status: 400 }
      );
    }

    // Verify file type by magic number (deep validation)
    const isValidResumeType = await verifyFileType(resume);
    if (!isValidResumeType) {
      return NextResponse.json(
        {
          error:
            "Invalid file content. File does not match PDF or Word format.",
        },
        { status: 400 }
      );
    }

    // Subir resume a Strapi
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const resumeFormData = new FormData();
    resumeFormData.append(
      "files",
      new Blob([resumeBuffer], { type: resume.type }),
      resume.name
    );

    const resumeUploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: resumeFormData,
    });

    if (!resumeUploadResponse.ok) {
      const errorData = await resumeUploadResponse.text();
      console.error("Strapi upload error status:", resumeUploadResponse.status);
      console.error("Strapi upload error response:", errorData);
      throw new Error(
        `Failed to upload resume to Strapi: ${resumeUploadResponse.status} - ${errorData}`
      );
    }

    const resumeData = await resumeUploadResponse.json();
    const resumeUrl = `${STRAPI_URL}${resumeData[0].url}`;

    let coverLetterUrl = null;

    // Subir cover letter si existe
    if (coverLetter) {
      if (coverLetter.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Cover letter file size exceeds 5MB limit" },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(coverLetter.type)) {
        return NextResponse.json(
          { error: "Invalid cover letter file type" },
          { status: 400 }
        );
      }

      // Verify cover letter file type by magic number
      const isValidCoverLetterType = await verifyFileType(coverLetter);
      if (!isValidCoverLetterType) {
        return NextResponse.json(
          {
            error:
              "Invalid cover letter content. File does not match PDF or Word format.",
          },
          { status: 400 }
        );
      }

      const coverLetterBuffer = Buffer.from(await coverLetter.arrayBuffer());
      const coverLetterFormData = new FormData();
      coverLetterFormData.append(
        "files",
        new Blob([coverLetterBuffer], { type: coverLetter.type }),
        coverLetter.name
      );

      const coverLetterUploadResponse = await fetch(
        `${STRAPI_URL}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: coverLetterFormData,
        }
      );

      if (!coverLetterUploadResponse.ok) {
        throw new Error("Failed to upload cover letter to Strapi");
      }

      const coverLetterData = await coverLetterUploadResponse.json();
      coverLetterUrl = `${STRAPI_URL}${coverLetterData[0].url}`;
    }

    return NextResponse.json({
      resumeUrl,
      coverLetterUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
