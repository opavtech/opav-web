"use client";

export default function DebugEnvPage() {
  return (
    <pre style={{ padding: "2rem", fontFamily: "monospace" }}>
      {JSON.stringify(
        {
          NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL ?? null,
          NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
        },
        null,
        2
      )}
    </pre>
  );
}
