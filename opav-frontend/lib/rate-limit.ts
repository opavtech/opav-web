import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

// ── Redis client ────────────────────────────────────────────────────────────

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// ── Limiters por endpoint ───────────────────────────────────────────────────

function createLimiter(tokens: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
    prefix: "ratelimit:opav",
  });
}

export const rateLimiters = {
  contact:             createLimiter(10, "1 h"),
  "job-application":   createLimiter(5,  "1 h"),
  "provider-application": createLimiter(5, "1 h"),
  rfp:                 createLimiter(5,  "1 h"),
  upload:              createLimiter(10, "1 h"),
} as const;

export type EndpointKey = keyof typeof rateLimiters;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Extrae la IP real del request */
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Aplica rate limiting para un endpoint dado.
 * Retorna `null` si está dentro del límite.
 * Retorna un NextResponse 429 si lo supera.
 * Si Redis no está configurado, permite todo (no bloquea).
 */
export async function applyRateLimit(
  ip: string,
  endpoint: EndpointKey
): Promise<NextResponse | null> {
  const limiter = rateLimiters[endpoint];

  if (!limiter) {
    // Redis no configurado — permite la request (no bloquea en dev local)
    return null;
  }

  const { success, limit, remaining, reset } = await limiter.limit(`${endpoint}:${ip}`);

  if (!success) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta más tarde." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit":     String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset":     String(reset),
        },
      }
    );
  }

  return null;
}
